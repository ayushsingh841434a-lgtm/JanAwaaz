"use client";

import { useEffect, useRef, useState } from "react";
import { get } from "@/lib/api-client";

type LocationType =
  | "COUNTRY" | "STATE" | "DIVISION" | "DISTRICT" | "SUB_DISTRICT" | "BLOCK"
  | "VILLAGE" | "CITY" | "TOWN" | "MUNICIPAL_BODY" | "WARD";

type LocationOption = {
  id: string;
  type: LocationType;
  name: string;
  parentId: string | null;
};

type OptionsResponse = { locations: LocationOption[]; total: number };

export interface LocationFormValue {
  state: string;
  district: string;
  city: string;
  area: string;
  subDistrict: string;
  block: string;
  ward: string;
  locationId: string;
  settlementId: string;
  stateId: string;
  districtId: string;
  subDistrictId: string;
  blockId: string;
  wardId: string;
  settlementType: LocationType | "";
  latitude: string;
  longitude: string;
}

const EMPTY_IDS = {
  locationId: "", settlementId: "", stateId: "", districtId: "", subDistrictId: "",
  blockId: "", wardId: "", settlementType: "" as const, subDistrict: "", block: "", ward: "",
};

async function fetchOptions(type: LocationType, parentId?: string, q?: string, blockId?: string) {
  const params = new URLSearchParams({ type, limit: "100" });
  if (parentId) params.set("parentId", parentId);
  if (q && q.length >= 2) params.set("q", q);
  if (blockId && type === "VILLAGE") params.set("blockId", blockId);
  return get<OptionsResponse>(`/api/locations?${params.toString()}`);
}

export function LocationSelector({
  value,
  onChange,
}: {
  value: LocationFormValue;
  onChange: (value: Partial<LocationFormValue>) => void;
}) {
  const [states, setStates] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [subDistricts, setSubDistricts] = useState<LocationOption[]>([]);
  const [blocks, setBlocks] = useState<LocationOption[]>([]);
  const [settlements, setSettlements] = useState<LocationOption[]>([]);
  const [wards, setWards] = useState<LocationOption[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manual, setManual] = useState(false);
  const [locating, setLocating] = useState(false);
  const checkedInitialValue = useRef(false);

  const useDeviceLocation = () => {
    if (!navigator.geolocation) {
      setError("This browser does not provide geolocation.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        });
        setLocating(false);
      },
      (reason) => {
        setError(`Unable to read device location: ${reason.message}`);
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
  };

  useEffect(() => {
    if (checkedInitialValue.current) return;
    if (value.state || value.district || value.city) {
      checkedInitialValue.current = true;
      if (!value.stateId) setManual(true);
    }
  }, [value.state, value.district, value.city, value.stateId]);

  useEffect(() => {
    let active = true;
    fetchOptions("STATE")
      .then((result) => {
        if (!active) return;
        setStates(result.locations);
        if (result.total === 0) setManual(true);
      })
      .catch(() => {
        if (active) {
          setError("Official location data is unavailable. You can still enter the location manually.");
          setManual(true);
        }
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!value.stateId || manual) {
      setDistricts([]);
      return;
    }
    let active = true;
    fetchOptions("DISTRICT", value.stateId)
      .then((result) => { if (active) setDistricts(result.locations); })
      .catch(() => { if (active) setError("Unable to load districts."); });
    return () => { active = false; };
  }, [value.stateId, manual]);

  useEffect(() => {
    if (!value.districtId || manual) {
      setSubDistricts([]);
      setBlocks([]);
      return;
    }
    let active = true;
    Promise.all([
      fetchOptions("SUB_DISTRICT", value.districtId),
      fetchOptions("BLOCK", value.districtId),
    ])
      .then(([subs, blockOptions]) => {
        if (!active) return;
        setSubDistricts(subs.locations);
        setBlocks(blockOptions.locations);
      })
      .catch(() => { if (active) setError("Unable to load sub-districts or blocks."); });
    return () => { active = false; };
  }, [value.districtId, manual]);

  useEffect(() => {
    if (!value.districtId || manual) {
      setSettlements([]);
      return;
    }
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      const requests: Promise<OptionsResponse>[] = [
        fetchOptions("CITY", value.districtId, search),
        fetchOptions("TOWN", value.districtId, search),
        fetchOptions("MUNICIPAL_BODY", value.districtId, search),
      ];
      if (value.subDistrictId) requests.push(fetchOptions("VILLAGE", value.subDistrictId, search, value.blockId));
      Promise.all(requests)
        .then((results) => {
          if (active) setSettlements(results.flatMap((result) => result.locations));
        })
        .catch(() => { if (active) setError("Unable to load cities or villages."); })
        .finally(() => { if (active) setLoading(false); });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [value.districtId, value.subDistrictId, value.blockId, search, manual]);

  useEffect(() => {
    if (!value.settlementId || !["CITY", "TOWN", "MUNICIPAL_BODY"].includes(value.settlementType)) {
      setWards([]);
      return;
    }
    let active = true;
    fetchOptions("WARD", value.settlementId, search)
      .then((result) => { if (active) setWards(result.locations); })
      .catch(() => { if (active) setError("Unable to load wards."); });
    return () => { active = false; };
  }, [value.settlementId, value.settlementType, search, manual]);

  const inputClass = "w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm text-ink-800 outline-none focus:border-saffron-400 disabled:bg-cream-100";
  const selection = (id: string) => {
    const option = [...states, ...districts, ...subDistricts, ...blocks, ...settlements, ...wards]
      .find((item) => item.id === id);
    return option;
  };
  return (
    <section className="space-y-4" aria-label="Report location">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-extrabold text-ink-800">📍 Location</h3>
        {states.length > 0 && (
          <button type="button" onClick={() => { setManual((current) => !current); setError(""); }} className="text-xs font-bold text-chakra-700 underline">
            {manual ? "Choose from official locations" : "Location not listed? Enter manually"}
          </button>
        )}
      </div>
      {error && <p role="status" className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">{error}</p>}
      {manual ? (
        <>
          {!states.length && <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">Official geographic data has not been imported yet. Manual entry remains available; only verified imported locations appear in suggestions.</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-bold text-ink-700">State / UT *
              <input required value={value.state} onChange={(event) => onChange({ state: event.target.value, ...EMPTY_IDS })} className={`${inputClass} mt-1`} placeholder="e.g. Uttar Pradesh" />
            </label>
            <label className="text-xs font-bold text-ink-700">District *
              <input required value={value.district} onChange={(event) => onChange({ district: event.target.value, ...EMPTY_IDS })} className={`${inputClass} mt-1`} placeholder="e.g. Kanpur Nagar" />
            </label>
            <label className="text-xs font-bold text-ink-700">City / Town / Village *
              <input required value={value.city} onChange={(event) => onChange({ city: event.target.value, ...EMPTY_IDS })} className={`${inputClass} mt-1`} placeholder="Enter settlement" />
            </label>
            <label className="text-xs font-bold text-ink-700">Area / Mohalla
              <input value={value.area} onChange={(event) => onChange({ area: event.target.value, ...EMPTY_IDS })} className={`${inputClass} mt-1`} placeholder="Optional, citizen-entered" />
            </label>
            <label className="text-xs font-bold text-ink-700">Sub-District / Tehsil / Taluka
              <input value={value.subDistrict} onChange={(event) => onChange({ ...EMPTY_IDS, subDistrict: event.target.value })} className={`${inputClass} mt-1`} />
            </label>
            <label className="text-xs font-bold text-ink-700">Block
              <input value={value.block} onChange={(event) => onChange({ ...EMPTY_IDS, block: event.target.value })} className={`${inputClass} mt-1`} />
            </label>
            <label className="text-xs font-bold text-ink-700">Ward
              <input value={value.ward} onChange={(event) => onChange({ ...EMPTY_IDS, ward: event.target.value })} className={`${inputClass} mt-1`} />
            </label>
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-bold text-ink-700">State / UT *
              <select required value={value.stateId} onChange={(event) => {
                const option = selection(event.target.value);
                onChange({
                  ...EMPTY_IDS, stateId: option?.id ?? "", state: option?.name ?? "",
                  districtId: "", district: "", city: "", area: "",
                });
              }} className={`${inputClass} mt-1`}>
                <option value="">Select State / UT</option>
                {states.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold text-ink-700">District *
              <select required disabled={!value.stateId} value={value.districtId} onChange={(event) => {
                const option = selection(event.target.value);
                onChange({ ...EMPTY_IDS, districtId: option?.id ?? "", district: option?.name ?? "", city: "", area: "" });
              }} className={`${inputClass} mt-1`}>
                <option value="">Select District</option>
                {districts.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold text-ink-700">Sub-District / Tehsil / Taluka
              <select disabled={!value.districtId} value={value.subDistrictId} onChange={(event) => {
                const option = selection(event.target.value);
                onChange({ ...EMPTY_IDS, subDistrictId: option?.id ?? "", subDistrict: option?.name ?? "" });
              }} className={`${inputClass} mt-1`}>
                <option value="">Select Sub-District (optional)</option>
                {subDistricts.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold text-ink-700">Block (optional)
              <select disabled={!value.districtId} value={value.blockId} onChange={(event) => {
                const option = selection(event.target.value);
                onChange({
                  blockId: option?.id ?? "",
                  block: option?.name ?? "",
                  ...(value.settlementType === "VILLAGE"
                    ? { city: "", locationId: "", settlementId: "", settlementType: "", wardId: "", ward: "" }
                    : {}),
                });
              }} className={`${inputClass} mt-1`}>
                <option value="">Select Block</option>
                {blocks.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
              </select>
            </label>
          </div>
          {value.districtId && (
            <div className="space-y-2">
              <label htmlFor="location-search" className="block text-xs font-bold text-ink-700">Search city / town / village</label>
              <input id="location-search" value={search} onChange={(event) => setSearch(event.target.value)} className={inputClass} placeholder="Type at least two characters to search larger lists" />
              <select value={value.settlementId} onChange={(event) => {
                const option = selection(event.target.value) ?? settlements.find((item) => item.id === event.target.value);
                onChange({
                  locationId: option?.id ?? "", settlementId: option?.id ?? "", city: option?.name ?? "",
                  settlementType: option?.type ?? "", wardId: "", ward: "",
                });
              }} className={inputClass}>
                <option value="">{loading ? "Loading locations…" : "Select City / Town / Village"}</option>
                {value.settlementId && !settlements.some((option) => option.id === value.settlementId) && (
                  <option value={value.settlementId}>{value.city} (selected)</option>
                )}
                {settlements.map((option) => <option key={option.id} value={option.id}>{option.name} ({option.type.replaceAll("_", " ").toLowerCase()})</option>)}
              </select>
              {!loading && settlements.length === 0 && <p className="text-xs text-ink-500">No official settlement matches. Try another search or enter the location manually.</p>}
            </div>
          )}
          {["CITY", "TOWN", "MUNICIPAL_BODY"].includes(value.settlementType) && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-bold text-ink-700">Ward (optional)
                <select value={value.wardId} onChange={(event) => {
                  const option = wards.find((item) => item.id === event.target.value);
                  onChange({ wardId: option?.id ?? "", ward: option?.name ?? "", locationId: option?.id ?? value.settlementId });
                }} className={`${inputClass} mt-1`}>
                  <option value="">Select Ward</option>
                  {value.wardId && !wards.some((option) => option.id === value.wardId) && (
                    <option value={value.wardId}>{value.ward} (selected)</option>
                  )}
                  {wards.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                </select>
              </label>
              <label className="text-xs font-bold text-ink-700">Area / Mohalla
                <input value={value.area} onChange={(event) => onChange({ area: event.target.value })} className={`${inputClass} mt-1`} placeholder="Optional, citizen-entered" />
              </label>
            </div>
          )}
          {value.settlementType === "VILLAGE" && (
            <label className="block text-xs font-bold text-ink-700">Locality / Mohalla
              <input value={value.area} onChange={(event) => onChange({ area: event.target.value })} className={`${inputClass} mt-1`} placeholder="Optional, citizen-entered" />
            </label>
          )}
        </>
      )}
      <div className="rounded-xl bg-cream-50 p-3">
        <p className="text-xs text-ink-600">Optional GPS coordinates are stored separately and are never shown on public maps.</p>
        <button type="button" onClick={useDeviceLocation} disabled={locating} className="mt-2 rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-xs font-bold text-ink-700 disabled:opacity-50">
          {locating ? "Getting device location…" : "Use my approximate GPS location"}
        </button>
        {value.latitude && value.longitude && <p className="mt-2 text-xs text-ink-500">Coordinates recorded with this report.</p>}
      </div>
    </section>
  );
}
