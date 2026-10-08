import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api-utils";
import { LOCATION_TYPES } from "@/lib/locations/import-format";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const requestedType = searchParams.get("type")?.toUpperCase();
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "20");

  if (query.length < 2) return fail("q must contain at least two characters.", 422);
  if (requestedType && !LOCATION_TYPES.includes(requestedType as (typeof LOCATION_TYPES)[number])) {
    return fail(`type must be one of: ${LOCATION_TYPES.join(", ")}`, 422);
  }
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 50) {
    return fail("page must be positive and limit must be between 1 and 50.", 422);
  }

  const where = {
    isActive: true,
    ...(requestedType ? { type: requestedType as (typeof LOCATION_TYPES)[number] } : {}),
    OR: [
      { name: { contains: query, mode: "insensitive" as const } },
      { aliases: { has: query } },
      { aliases: { has: query.toLocaleLowerCase() } },
    ],
  };
  const [total, locations] = await Promise.all([
    prisma.location.count({ where }),
    prisma.location.findMany({
      where,
      orderBy: [{ type: "asc" }, { name: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        type: true,
        name: true,
        source: true,
        sourceCode: true,
        parent: {
          select: {
            id: true,
            type: true,
            name: true,
            parent: { select: { id: true, type: true, name: true } },
          },
        },
      },
    }),
  ]);

  return ok({
    results: locations.map((location) => ({
      id: location.id,
      type: location.type,
      name: location.name,
      source: location.source,
      sourceCode: location.sourceCode,
      path: [location.parent?.parent?.name, location.parent?.name, location.name].filter(Boolean),
    })),
    total,
    page,
    limit,
  });
}
