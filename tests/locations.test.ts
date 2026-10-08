import assert from "node:assert/strict";
import test from "node:test";
import { parseLocationCsv } from "../lib/locations/import-format";
import { extractLocationCandidates } from "../lib/locations/match";

const HEADER = "type,code,name,parentType,parentCode,blockCode,aliases,lastVerifiedAt";
const VALID_ROWS = [
  "COUNTRY,IN,India,,,,,2026-10-01",
  "STATE,S1,Example State,COUNTRY,IN,,,2026-10-01",
  "DIVISION,DV1,Example Division,STATE,S1,,,2026-10-01",
  'DISTRICT,D1,"Example, District",DIVISION,DV1,,,2026-10-01',
  "SUB_DISTRICT,SD1,Example Sub-District,DISTRICT,D1,,,2026-10-01",
  "BLOCK,B1,Example Block,DISTRICT,D1,,,2026-10-01",
  "VILLAGE,V1,Example Village,SUB_DISTRICT,SD1,B1,Example Village|गाँव,2026-10-01",
  "CITY,C1,Example City,DISTRICT,D1,,,2026-10-01",
  "MUNICIPAL_BODY,M1,Example Municipality,DISTRICT,D1,,,2026-10-01",
  "WARD,W1,Ward One,MUNICIPAL_BODY,M1,,,2026-10-01",
].join("\n");

test("parses valid administrative hierarchy, quoted fields, aliases and source dates", () => {
  const locations = parseLocationCsv(`${HEADER}\n${VALID_ROWS}`);
  assert.equal(locations.length, 10);
  assert.equal(locations.find((location) => location.type === "DISTRICT")?.name, "Example, District");
  assert.deepEqual(locations.find((location) => location.type === "VILLAGE")?.aliases, ["Example Village", "गाँव"]);
  assert.equal(locations.find((location) => location.type === "WARD")?.parentCode, "M1");
});

test("rejects duplicate official codes within a location type", () => {
  const duplicate = `${VALID_ROWS}\nSTATE,S1,Duplicate State,COUNTRY,IN,,,2026-10-01`;
  assert.throws(() => parseLocationCsv(`${HEADER}\n${duplicate}`), /Duplicate official code/);
});

test("rejects orphaned districts and invalid parent types", () => {
  const orphan = VALID_ROWS.replace("DISTRICT,D1,\"Example, District\",DIVISION,DV1", "DISTRICT,D1,\"Example, District\",DIVISION,MISSING");
  assert.throws(() => parseLocationCsv(`${HEADER}\n${orphan}`), /Missing parent/);
  const invalid = VALID_ROWS.replace("SUB_DISTRICT,SD1,Example Sub-District,DISTRICT,D1", "SUB_DISTRICT,SD1,Example Sub-District,STATE,S1");
  assert.throws(() => parseLocationCsv(`${HEADER}\n${invalid}`), /Invalid parent relationship/);
});

test("rejects village-to-block links that cross district boundaries", () => {
  const otherDistrict = [
    "DISTRICT,D2,Other District,STATE,S1,,,2026-10-01",
    "BLOCK,B2,Other Block,DISTRICT,D2,,,2026-10-01",
  ].join("\n");
  const mismatch = VALID_ROWS.replace("VILLAGE,V1,Example Village,SUB_DISTRICT,SD1,B1", "VILLAGE,V1,Example Village,SUB_DISTRICT,SD1,B2");
  assert.throws(() => parseLocationCsv(`${HEADER}\n${mismatch}\n${otherDistrict}`), /different districts/);
});

test("extracts location candidates from Hinglish and Hindi without treating them as verified", () => {
  const hinglish = extractLocationCandidates("UP Kanpur Dehat ke XYZ gaon mein road kharab hai");
  const hindi = extractLocationCandidates("कानपुर के मेरे इलाके में पानी नहीं आ रहा है");
  assert.ok(hinglish.includes("Kanpur Dehat"));
  assert.ok(hindi.includes("कानपुर"));
});
