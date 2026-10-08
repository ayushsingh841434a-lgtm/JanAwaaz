import type { LocationType } from "@prisma/client";

export const LOCATION_TYPES = [
  "COUNTRY",
  "STATE",
  "DIVISION",
  "DISTRICT",
  "SUB_DISTRICT",
  "BLOCK",
  "VILLAGE",
  "CITY",
  "TOWN",
  "MUNICIPAL_BODY",
  "WARD",
] as const satisfies readonly LocationType[];

export type LocationImportRow = {
  type: LocationType;
  code: string;
  name: string;
  parentType: LocationType | null;
  parentCode: string | null;
  blockCode: string | null;
  aliases: string[];
  lastVerifiedAt: Date | null;
};

const ALLOWED_PARENTS: Partial<Record<LocationType, LocationType[]>> = {
  STATE: ["COUNTRY"],
  DIVISION: ["STATE"],
  DISTRICT: ["STATE", "DIVISION"],
  SUB_DISTRICT: ["DISTRICT"],
  BLOCK: ["DISTRICT"],
  VILLAGE: ["SUB_DISTRICT"],
  CITY: ["DISTRICT"],
  TOWN: ["DISTRICT"],
  MUNICIPAL_BODY: ["DISTRICT"],
  WARD: ["CITY", "TOWN", "MUNICIPAL_BODY"],
};

function parseCsvLine(line: string, lineNumber: number): string[] {
  const values: string[] = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += char;
    }
  }
  if (quoted) throw new Error(`CSV line ${lineNumber} has an unterminated quoted field.`);
  values.push(value.trim());
  return values;
}

export function parseLocationCsv(csv: string): LocationImportRow[] {
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length < 2) throw new Error("The location CSV must contain a header and at least one data row.");

  const headers = parseCsvLine(lines[0], 1).map((header) => header.toLowerCase());
  const required = ["type", "code", "name", "parenttype", "parentcode"];
  for (const column of required) {
    if (!headers.includes(column)) throw new Error(`The location CSV is missing the required "${column}" column.`);
  }

  const rows = lines.slice(1).map((line, index) => {
    const fields = parseCsvLine(line, index + 2);
    if (fields.length !== headers.length) {
      throw new Error(`CSV line ${index + 2} has ${fields.length} fields; expected ${headers.length}.`);
    }
    const row = Object.fromEntries(headers.map((header, i) => [header, fields[i]]));
    const type = row.type?.toUpperCase() as LocationType;
    if (!LOCATION_TYPES.includes(type as (typeof LOCATION_TYPES)[number])) {
      throw new Error(`CSV line ${index + 2} has unsupported location type "${row.type}".`);
    }
    const parentTypeText = row.parenttype?.toUpperCase() ?? "";
    const parentType = parentTypeText ? parentTypeText as LocationType : null;
    if (parentType && !LOCATION_TYPES.includes(parentType as (typeof LOCATION_TYPES)[number])) {
      throw new Error(`CSV line ${index + 2} has unsupported parent type "${row.parenttype}".`);
    }
    const verifiedText = row.lastverifiedat?.trim();
    const lastVerifiedAt = verifiedText ? new Date(verifiedText) : null;
    if (lastVerifiedAt && Number.isNaN(lastVerifiedAt.getTime())) {
      throw new Error(`CSV line ${index + 2} has an invalid lastVerifiedAt date.`);
    }

    return {
      type,
      code: row.code?.trim() ?? "",
      name: row.name?.trim() ?? "",
      parentType,
      parentCode: row.parentcode?.trim() || null,
      blockCode: row.blockcode?.trim() || null,
      aliases: (row.aliases ?? "").split("|").map((alias: string) => alias.trim()).filter(Boolean),
      lastVerifiedAt,
    };
  });

  validateLocationRows(rows);
  return rows;
}

export function validateLocationRows(rows: LocationImportRow[]): void {
  const byCode = new Map<string, LocationImportRow>();
  for (const row of rows) {
    if (!row.name || !row.code) throw new Error(`Every location needs a non-empty name and official code (row type ${row.type}).`);
    const key = `${row.type}:${row.code}`;
    if (byCode.has(key)) throw new Error(`Duplicate official code "${row.code}" for type ${row.type}.`);
    byCode.set(key, row);
    if (row.type === "COUNTRY" && row.code !== "IN") {
      throw new Error(`Only India's ISO 3166-1 code "IN" is accepted, not "${row.code}".`);
    }
  }

  for (const row of rows) {
    if (row.type === "COUNTRY") {
      if (row.parentType || row.parentCode) throw new Error(`Country "${row.name}" must not have a parent.`);
      continue;
    }
    if (row.type === "STATE" && !row.parentType && !row.parentCode) continue;
    const parentTypes = ALLOWED_PARENTS[row.type] ?? [];
    if (!row.parentType || !row.parentCode || !parentTypes.includes(row.parentType)) {
      throw new Error(`Invalid parent relationship for ${row.type} "${row.name}".`);
    }
    const parent = byCode.get(`${row.parentType}:${row.parentCode}`);
    if (!parent) throw new Error(`Missing parent ${row.parentType} code "${row.parentCode}" for ${row.type} "${row.name}".`);
    if (row.type === "VILLAGE" && row.blockCode) {
      const block = byCode.get(`BLOCK:${row.blockCode}`);
      if (!block) throw new Error(`Missing block code "${row.blockCode}" for village "${row.name}".`);
      const villageDistrict = findDistrictCode(row.parentType, row.parentCode, byCode);
      const blockDistrict = findDistrictCode(block.parentType, block.parentCode, byCode);
      if (villageDistrict !== blockDistrict) {
        throw new Error(`Village "${row.name}" and block "${block.name}" belong to different districts.`);
      }
    }
  }
}

function findDistrictCode(
  type: LocationType | null,
  code: string | null,
  byCode: Map<string, LocationImportRow>,
): string | null {
  if (type === "DISTRICT") return code;
  if (!type || !code) return null;
  const parent = byCode.get(`${type}:${code}`);
  if (!parent) return null;
  return findDistrictCode(parent.parentType, parent.parentCode, byCode);
}
