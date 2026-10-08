import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAuth, getSessionUser } from "@/lib/auth";
import { ok, fail, zodError, parseJson } from "@/lib/api-utils";
import { nextPublicId } from "@/lib/reports";
import { publicReportShape } from "@/lib/utils";
import { CATEGORIES } from "@/lib/utils";
import { LOCATION_TYPES } from "@/lib/locations/import-format";

const createSchema = z.object({
  category: z.enum(CATEGORIES),
  title: z.string().min(4).max(140),
  description: z.string().min(10).max(5000),
  state: z.string().min(2).max(60),
  district: z.string().min(2).max(60),
  city: z.string().min(2).max(60),
  area: z.string().max(120).optional(),
  subDistrict: z.string().max(100).optional(),
  block: z.string().max(100).optional(),
  ward: z.string().max(100).optional(),
  locationId: z.string().cuid().optional(),
  stateId: z.string().cuid().optional(),
  districtId: z.string().cuid().optional(),
  subDistrictId: z.string().cuid().optional(),
  blockId: z.string().cuid().optional(),
  wardId: z.string().cuid().optional(),
  settlementType: z.enum(LOCATION_TYPES).optional(),
  landmark: z.string().max(160).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

/** Public listing — privacy-safe shape, no reporter identity. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const city = searchParams.get("city");
  const state = searchParams.get("state");
  const q = searchParams.get("q");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)));

  const where: Record<string, unknown> = { isPublic: true };
  if (category) where.category = category;
  if (status) where.status = status;
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (state) where.state = { contains: state, mode: "insensitive" };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { area: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.report.count({ where }),
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { evidence: true } } },
    }),
  ]);

  return ok({ reports: rows.map(publicReportShape), total, page, limit });
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if ("response" in auth) return auth.response;
  const user = await getSessionUser(auth.session);
  if (!user) return fail("Not authenticated", 401);

  const body = await parseJson(req);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const selectedIds = [
    parsed.data.stateId,
    parsed.data.districtId,
    parsed.data.subDistrictId,
    parsed.data.blockId,
    parsed.data.locationId,
    parsed.data.wardId,
  ].filter((id): id is string => Boolean(id));
  if (selectedIds.length) {
    const locations = new Map<string, { id: string; type: string; name: string; parentId: string | null; blockId: string | null; isActive: boolean }>();
    let pendingIds = [...new Set(selectedIds)];
    for (let depth = 0; pendingIds.length && depth < 8; depth += 1) {
      const unseenIds = pendingIds.filter((id) => !locations.has(id));
      if (!unseenIds.length) break;
      const rows = await prisma.location.findMany({
        where: { id: { in: unseenIds } },
        select: { id: true, type: true, name: true, parentId: true, blockId: true, isActive: true },
      });
      for (const location of rows) locations.set(location.id, location);
      pendingIds = rows.map((location) => location.parentId).filter((id): id is string => Boolean(id));
    }

    const chain = (id: string) => {
      const result: Array<{ id: string; type: string; name: string; parentId: string | null; blockId: string | null; isActive: boolean }> = [];
      let current = locations.get(id);
      while (current) {
        result.push(current);
        current = current.parentId ? locations.get(current.parentId) : undefined;
      }
      return result;
    };
    const expected = [
      [parsed.data.stateId, "STATE", parsed.data.state],
      [parsed.data.districtId, "DISTRICT", parsed.data.district],
      [parsed.data.subDistrictId, "SUB_DISTRICT", parsed.data.subDistrict],
      [parsed.data.blockId, "BLOCK", parsed.data.block],
    ] as const;
    for (const [id, type, name] of expected) {
      if (!id) continue;
      const item = locations.get(id);
      if (!item || !item.isActive || item.type !== type || item.name !== name) {
        return fail(`Selected ${type.toLowerCase().replaceAll("_", "-")} is invalid or no longer active.`, 422);
      }
      if (type !== "STATE" && !chain(id).some((ancestor) => ancestor.id === parsed.data.stateId)) {
        return fail("Selected locations do not belong to the selected State / UT.", 422);
      }
      if (["SUB_DISTRICT", "BLOCK"].includes(type) && !chain(id).some((ancestor) => ancestor.id === parsed.data.districtId)) {
        return fail("Selected locations do not belong to the selected district.", 422);
      }
    }

    if (parsed.data.locationId) {
      const location = locations.get(parsed.data.locationId);
      if (!location || !location.isActive) return fail("Selected settlement is invalid or no longer active.", 422);
      const allowed = ["VILLAGE", "CITY", "TOWN", "MUNICIPAL_BODY", "WARD"];
      if (!allowed.includes(location.type)) return fail("Selected location is not a village, city, town, municipal body, or ward.", 422);
      if (!chain(location.id).some((ancestor) => ancestor.id === parsed.data.districtId)) {
        return fail("Selected settlement does not belong to the selected district.", 422);
      }
      if (location.type === "VILLAGE" && (
        !chain(location.id).some((ancestor) => ancestor.id === parsed.data.subDistrictId) ||
        (parsed.data.blockId && location.blockId !== parsed.data.blockId)
      )) {
        return fail("Selected village does not match the selected sub-district and block.", 422);
      }
      if (location.type === "WARD") {
        const parent = location.parentId ? locations.get(location.parentId) : undefined;
        if (parsed.data.wardId !== location.id || !parent || parent.type !== parsed.data.settlementType || parent.name !== parsed.data.city || location.name !== parsed.data.ward) {
          return fail("Selected ward does not match the chosen city or town.", 422);
        }
      } else if (location.type !== parsed.data.settlementType || location.name !== parsed.data.city) {
        return fail("Selected settlement type does not match its official type.", 422);
      }
    }
    if (parsed.data.wardId && parsed.data.locationId !== parsed.data.wardId) {
      return fail("The selected ward does not match the report location.", 422);
    }
  }

  const publicId = await nextPublicId();
  const report = await prisma.report.create({
    data: {
      publicId,
      userId: user.id,
      category: parsed.data.category,
      title: parsed.data.title,
      description: parsed.data.description,
      state: parsed.data.state,
      district: parsed.data.district,
      city: parsed.data.city,
      area: parsed.data.area,
      subDistrict: parsed.data.subDistrict,
      block: parsed.data.block,
      ward: parsed.data.ward,
      locationId: parsed.data.locationId,
      settlementType: parsed.data.settlementType,
      landmark: parsed.data.landmark,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      priority: parsed.data.priority ?? "MEDIUM",
      statusHistory: { create: { toStatus: "REPORTED", note: "Report created by citizen" } },
    },
  });

  return ok({ publicId: report.publicId, id: report.id }, 201);
}
