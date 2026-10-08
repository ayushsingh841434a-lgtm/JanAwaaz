"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { get } from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n/provider";

interface CityDatum {
  city: string;
  lat: number;
  lng: number;
  total: number;
  resolved: number;
  byCategory: Record<string, number>;
}

function FitBounds({ cities }: { cities: CityDatum[] }) {
  const map = useMap();
  useEffect(() => {
    if (cities.length === 0) return;
    const bounds = cities.map((c) => [c.lat, c.lng] as [number, number]);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [cities, map]);
  return null;
}

function intensityColor(total: number, resolved: number): string {
  if (total === 0) return "#22c55e";
  const openRatio = (total - resolved) / total;
  const density = Math.min(1, total / 12);
  if (density > 0.55 && openRatio > 0.5) return "#ef4444"; // high
  if (density > 0.3 || openRatio > 0.6) return "#f97316"; // medium
  if (openRatio < 0.35) return "#22c55e"; // mostly resolved
  return "#eab308"; // low
}

export function IndiaMap({ category, status, state, district, city, ward }: {
  category?: string;
  status?: string;
  state?: string;
  district?: string;
  city?: string;
  ward?: string;
}) {
  const { tCategory } = useLanguage();
  const [cities, setCities] = useState<CityDatum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (status) qs.set("status", status);
    if (state) qs.set("state", state);
    if (district) qs.set("district", district);
    if (city) qs.set("city", city);
    if (ward) qs.set("ward", ward);
    get<{ cities: CityDatum[] }>(`/api/map?${qs.toString()}`)
      .then((d) => setCities(d.cities))
      .catch(() => setCities([]))
      .finally(() => setLoading(false));
  }, [category, status, state, district, city, ward]);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-cream-100/70 backdrop-blur-sm">
          <div className="skeleton h-8 w-48 rounded-full" />
        </div>
      )}
      <MapContainer
        center={[23.5, 80]}
        zoom={5}
        scrollWheelZoom={false}
        className="h-[480px] w-full rounded-3xl shadow-lift md:h-[560px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds cities={cities} />
        {cities.map((c) => (
          <CircleMarker
            key={c.city}
            center={[c.lat, c.lng]}
            radius={Math.min(34, 10 + c.total * 2.2)}
            pathOptions={{
              color: "#fff",
              weight: 2,
              fillColor: intensityColor(c.total, c.resolved),
              fillOpacity: 0.82,
            }}
          >
            <Popup>
              <div className="min-w-44 p-1">
                <p className="text-sm font-bold text-ink-900">{c.city}</p>
                <p className="mt-1 text-[12px] text-ink-600">
                  {c.total} reports • {c.resolved} resolved
                </p>
                <div className="mt-2 space-y-1">
                  {Object.entries(c.byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([cat, n]) => (
                      <p key={cat} className="text-[12px] text-ink-600">
                        <span className="font-semibold">{tCategory(cat)}:</span> {n}
                      </p>
                    ))}
                </div>
                <a href={`/explore?city=${encodeURIComponent(c.city)}`} className="mt-2 inline-block text-[12px] font-bold text-saffron-700 hover:underline">
                  View reports →
                </a>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[5] rounded-2xl bg-white/92 px-3.5 py-2.5 shadow-soft backdrop-blur">
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-500">Issue concentration</p>
        <div className="flex flex-col gap-1 text-[11px] font-semibold text-ink-700">
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-red-500" /> High</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Medium</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-yellow-500" /> Low</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-green-500" /> Mostly resolved</span>
        </div>
      </div>
    </div>
  );
}
