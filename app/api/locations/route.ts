import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api-utils";
import { LOCATION_TYPES } from "@/lib/locations/import-format";

const cachedList = unstable_cache(
  async (type: (typeof LOCATION_TYPES)[number], parentIds: string[], blockId: string, query: string, skip: number, take: number) =>
    prisma.location.findMany({
      where: {
        type,
        isActive: true,
        ...(parentIds.length ? { parentId: { in: parentIds } } : {}),
        ...(blockId ? { blockId } : {}),
        ...(query ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { aliases: { has: query } },
            { aliases: { has: query.toLocaleLowerCase() } },
          ],
        } : {}),
      },
      orderBy: { name: "asc" },
      skip,
      take,
      select: { id: true, type: true, name: true, source: true, sourceCode: true, parentId: true },
    }),
  ["india-location-options-v1"],
  { revalidate: 300, tags: ["locations"] },
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type")?.toUpperCase();
  const parentId = searchParams.get("parentId");
  const blockId = searchParams.get("blockId") ?? "";
  const query = searchParams.get("q")?.trim();
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "100");

  if (!type || !LOCATION_TYPES.includes(type as (typeof LOCATION_TYPES)[number])) {
    return fail(`type must be one of: ${LOCATION_TYPES.join(", ")}`, 422);
  }
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
    return fail("page must be positive and limit must be between 1 and 100.", 422);
  }
  if (query && query.length < 2) return fail("q must contain at least two characters.", 422);

  let parentIds = parentId ? [parentId] : [];
  if (type === "DISTRICT" && parentId) {
    const divisions = await prisma.location.findMany({
      where: { type: "DIVISION", parentId, isActive: true },
      select: { id: true },
    });
    parentIds = [parentId, ...divisions.map((division) => division.id)];
  }

  const filterQuery = query?.toLocaleLowerCase() ?? "";
  const [locations, total] = await Promise.all([
    cachedList(
    type as (typeof LOCATION_TYPES)[number],
    parentIds,
    blockId,
    filterQuery,
    (page - 1) * limit,
    limit,
    ),
    prisma.location.count({
      where: {
        type: type as (typeof LOCATION_TYPES)[number],
        isActive: true,
        ...(parentIds.length ? { parentId: { in: parentIds } } : {}),
        ...(blockId ? { blockId } : {}),
        ...(filterQuery ? {
          OR: [
            { name: { contains: filterQuery, mode: "insensitive" } },
            { aliases: { has: query! } },
            { aliases: { has: filterQuery } },
          ],
        } : {}),
      },
    }),
  ]);
  return ok({ locations, total, page, limit });
}
