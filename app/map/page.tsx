"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/i18n/provider";
import { Reveal } from "@/components/Reveal";
import { CATEGORIES } from "@/lib/utils";
import { get } from "@/lib/api-client";

type LocationSearchResult = {
  id: string;
  type: string;
  name: string;
  path: string[];
};

const IndiaMap = dynamic(() => import("@/components/IndiaMap").then((m) => m.IndiaMap), {
  ssr: false,
  loading: () => <div className="skeleton h-[480px] w-full rounded-3xl md:h-[560px]" />,
});

export default function MapPage() {
  const { dict, tCategory } = useLanguage();
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<LocationSearchResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | null>(null);
  const [states, setStates] = useState<{ id: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
  const [locationError, setLocationError] = useState("");

  const selectCls = "rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm font-semibold text-ink-700 outline-none focus:border-saffron-400";

  useEffect(() => {
    let active = true;
    get<{ locations: { id: string; name: string }[] }>("/api/locations?type=STATE&limit=100")
      .then((result) => { if (active) setStates(result.locations); })
      .catch(() => { if (active) setLocationError("Geographic filters are unavailable until official location data is imported."); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!state) {
      setDistricts([]);
      setDistrict("");
      return;
    }
    let active = true;
    const selectedState = states.find((item) => item.id === state);
    if (!selectedState) return;
    get<{ locations: { id: string; name: string }[] }>(`/api/locations?type=DISTRICT&parentId=${encodeURIComponent(state)}&limit=100`)
      .then((result) => { if (active) setDistricts(result.locations); })
      .catch(() => { if (active) setLocationError("Unable to load districts for the selected state."); });
    return () => { active = false; };
  }, [state, states]);

  useEffect(() => {
    if (locationQuery.trim().length < 2) {
      setLocationResults([]);
      return;
    }
    let active = true;
    const timer = window.setTimeout(() => {
      get<{ results: LocationSearchResult[] }>(`/api/locations/search?q=${encodeURIComponent(locationQuery.trim())}&limit=50`)
        .then((result) => {
          if (active) setLocationResults(result.results.filter((item) =>
            ["CITY", "TOWN", "MUNICIPAL_BODY", "VILLAGE", "WARD"].includes(item.type),
          ));
        })
        .catch(() => { if (active) setLocationError("Unable to search geographic locations."); });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [locationQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-extrabold text-ink-900 md:text-4xl">Where Does India Need Attention?</h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Aggregated, privacy-safe view of citizen reports across cities. Only area-level information is shown — never individual reporter locations.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-6 flex flex-wrap gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls} aria-label="Filter by category">
            <option value="">{dict.common.all} categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{tCategory(c)}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls} aria-label="Filter by status">
            <option value="">{dict.common.all} statuses</option>
            {["REPORTED", "UNDER_REVIEW", "ACTION_TAKEN", "RESOLVED"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={state} onChange={(e) => { setState(e.target.value); setDistrict(""); }} className={selectCls} aria-label="Filter by state or union territory">
            <option value="">All States / UTs</option>
            {states.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className={selectCls} aria-label="Filter by district" disabled={!state}>
            <option value="">All districts</option>
            {districts.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
          </select>
          <input
            value={locationQuery}
            onChange={(event) => setLocationQuery(event.target.value)}
            className={selectCls}
            aria-label="Search city, village or ward"
            placeholder="Search city, village or ward"
          />
          {locationResults.length > 0 && (
            <select
              value={selectedLocation?.id ?? ""}
              onChange={(event) => setSelectedLocation(locationResults.find((item) => item.id === event.target.value) ?? null)}
              className={selectCls}
              aria-label="Select a matching geographic location"
            >
              <option value="">Choose a matching location</option>
              {locationResults.map((item) => <option key={item.id} value={item.id}>{item.path.join(" › ")}</option>)}
            </select>
          )}
        </div>
        {locationError && <p role="status" className="mt-2 text-xs text-amber-800">{locationError}</p>}
      </Reveal>

      <Reveal delay={120} className="mt-6">
        <IndiaMap
          category={category || undefined}
          status={status || undefined}
          state={states.find((item) => item.id === state)?.name}
          district={district || undefined}
          city={selectedLocation
            ? selectedLocation.type === "WARD" ? selectedLocation.path.at(-2) : selectedLocation.name
            : undefined}
          ward={selectedLocation?.type === "WARD" ? selectedLocation.name : undefined}
        />
      </Reveal>

      <Reveal className="mt-6 rounded-2xl bg-chakra-50 px-5 py-4 text-[13px] text-chakra-800">
        🔒 <strong>Privacy note:</strong> This map shows only aggregated counts per city. Individual reports appear on the Explore page without any reporter identity or precise location.
      </Reveal>
    </div>
  );
}
