import { readFile } from "node:fs/promises";
import { Prisma, PrismaClient, type LocationType } from "@prisma/client";
import { parseLocationCsv } from "../lib/locations/import-format";

const prisma = new PrismaClient();
const TYPE_ORDER: LocationType[] = [
  "COUNTRY", "STATE", "DIVISION", "DISTRICT", "SUB_DISTRICT", "BLOCK",
  "CITY", "TOWN", "MUNICIPAL_BODY", "VILLAGE", "WARD",
];
const SOURCE = process.env.LOCATION_DATA_SOURCE ?? "Local Government Directory (LGD), Ministry of Panchayati Raj";

function parentKey(type: LocationType, code: string) {
  return `${type}:${code}`;
}

async function importLocations(filePath: string) {
  const source = SOURCE.trim();
  if (!source) throw new Error("Set LOCATION_DATA_SOURCE to the authoritative source name.");
  const rows = parseLocationCsv(await readFile(filePath, "utf8"));
  const verifiedAt = process.env.LOCATION_DATA_VERIFIED_AT
    ? new Date(process.env.LOCATION_DATA_VERIFIED_AT)
    : null;
  if (verifiedAt && Number.isNaN(verifiedAt.getTime())) {
    throw new Error("LOCATION_DATA_VERIFIED_AT must be a valid date (YYYY-MM-DD).");
  }

  const country = await prisma.location.upsert({
    where: { source_type_sourceCode: { source: "ISO 3166-1", type: "COUNTRY", sourceCode: "IN" } },
    create: {
      type: "COUNTRY",
      name: "India",
      source: "ISO 3166-1",
      sourceCode: "IN",
      lastVerifiedAt: verifiedAt,
    },
    update: { name: "India", isActive: true, lastVerifiedAt: verifiedAt },
    select: { id: true },
  });

  const ids = new Map<string, string>([[parentKey("COUNTRY", "IN"), country.id]]);
  let imported = 0;
  for (const type of TYPE_ORDER) {
    const typeRows = rows.filter((row) => row.type === type);
    if (type === "COUNTRY") {
      for (const row of typeRows) {
        if (row.code !== "IN") throw new Error(`Only India's ISO 3166-1 code "IN" is accepted, not "${row.code}".`);
      }
      continue;
    }
    for (let start = 0; start < typeRows.length; start += 250) {
      const batch = typeRows.slice(start, start + 250);
      const values = batch.map((row) => {
        const parentType = row.parentType ?? (row.type === "STATE" ? "COUNTRY" : null);
        const parentCode = row.parentCode ?? (row.type === "STATE" ? "IN" : null);
        const parentId = parentType && parentCode ? ids.get(parentKey(parentType, parentCode)) : country.id;
        if (!parentId) throw new Error(`Parent not imported before ${row.type} "${row.name}" (${row.code}).`);
        const blockId = row.blockCode ? ids.get(parentKey("BLOCK", row.blockCode)) : null;
        if (row.blockCode && !blockId) throw new Error(`Block ${row.blockCode} was not imported before village "${row.name}".`);
        const aliases = [...new Set(row.aliases.flatMap((alias) => [alias, alias.toLocaleLowerCase()]))];
        return {
          row,
          sql: Prisma.sql`(
            ${row.type}::"LocationType",
            ${row.name},
            ${source},
            ${row.code},
            ${aliases}::text[],
            ${parentId},
            ${blockId},
            true,
            ${row.lastVerifiedAt ?? verifiedAt},
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          )`,
        };
      });
      const saved = await prisma.$queryRaw<{ id: string; type: LocationType; sourceCode: string }[]>(Prisma.sql`
        INSERT INTO "Location"
          ("type", "name", "source", "sourceCode", "aliases", "parentId", "blockId", "isActive", "lastVerifiedAt", "createdAt", "updatedAt")
        VALUES ${Prisma.join(values.map((item) => item.sql))}
        ON CONFLICT ("source", "type", "sourceCode")
        DO UPDATE SET
          "name" = EXCLUDED."name",
          "aliases" = EXCLUDED."aliases",
          "parentId" = EXCLUDED."parentId",
          "blockId" = EXCLUDED."blockId",
          "isActive" = true,
          "lastVerifiedAt" = EXCLUDED."lastVerifiedAt",
          "updatedAt" = CURRENT_TIMESTAMP
        RETURNING "id", "type", "sourceCode"
      `);
      for (const location of saved) ids.set(parentKey(location.type, location.sourceCode), location.id);
      imported += saved.length;
    }
  }

  const counts = await prisma.location.groupBy({
    by: ["type"],
    where: { source, isActive: true },
    _count: { _all: true },
    orderBy: { type: "asc" },
  });
  console.log(JSON.stringify({
    source,
    inputRows: rows.length,
    importedOrUpdated: imported,
    activeCountsByType: Object.fromEntries(counts.map((item) => [item.type, item._count._all])),
  }, null, 2));
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    throw new Error("Usage: npm run import:locations -- <official-locations.csv>");
  }
  await importLocations(filePath);
}

main()
  .catch((error: unknown) => {
    console.error("India location import failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
