import { prisma } from "@/lib/db";
import { ok } from "@/lib/api-utils";

/** Aggregated, privacy-safe heatmap data: city-level counts only. */
const CITY_COORDS: Record<string, [number, number]> = {
  Delhi: [28.6139, 77.209], Kanpur: [26.4499, 80.3319], Lucknow: [26.8467, 80.9462],
  Mumbai: [19.076, 72.8777], Bengaluru: [12.9716, 77.5946], Patna: [25.5941, 85.1376],
  Kolkata: [22.5726, 88.3639], Chennai: [13.0827, 80.2707], Hyderabad: [17.385, 78.4867],
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const state = searchParams.get("state");
  const district = searchParams.get("district");
  const city = searchParams.get("city");
  const ward = searchParams.get("ward");

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (status) where.status = status;
  if (state) where.state = { equals: state, mode: "insensitive" };
  if (district) where.district = { equals: district, mode: "insensitive" };
  if (city) where.city = { equals: city, mode: "insensitive" };
  if (ward) where.ward = { equals: ward, mode: "insensitive" };

  const groups = await prisma.report.groupBy({
    by: ["city", "category", "status"],
    where, _count: true,
  });

  const cities: Record<string, { city: string; lat: number; lng: number; total: number; resolved: number; byCategory: Record<string, number> }> = {};
  for (const g of groups) {
    const coords = CITY_COORDS[g.city];
    if (!coords) continue;
    if (!cities[g.city]) {
      cities[g.city] = { city: g.city, lat: coords[0], lng: coords[1], total: 0, resolved: 0, byCategory: {} };
    }
    const c = cities[g.city];
    c.total += g._count;
    if (g.status === "RESOLVED") c.resolved += g._count;
    c.byCategory[g.category] = (c.byCategory[g.category] ?? 0) + g._count;
  }

  return ok({ cities: Object.values(cities) });
}
