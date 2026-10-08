export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Public-safe report shape: strips reporter identity for public listings. */
export function publicReportShape(r: {
  publicId: string; category: string; title: string; description: string;
  state: string; district: string; city: string; area: string | null;
  status: string; priority: string; createdAt: Date | string; updatedAt: Date | string;
  _count?: { evidence: number };
}) {
  return {
    publicId: r.publicId,
    category: r.category,
    title: r.title,
    description: r.description,
    state: r.state,
    district: r.district,
    city: r.city,
    area: r.area,
    status: r.status,
    priority: r.priority,
    evidenceCount: r._count?.evidence ?? 0,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export const REPORT_STATUSES = [
  "REPORTED",
  "AUTHORITY_IDENTIFIED",
  "SUBMITTED",
  "ACKNOWLEDGED",
  "UNDER_REVIEW",
  "ACTION_TAKEN",
  "RESOLVED",
] as const;

export const CATEGORIES = [
  "WATER", "ROADS", "ELECTRICITY", "GARBAGE", "DRAINAGE", "EDUCATION",
  "HEALTHCARE", "TRANSPORT", "ENVIRONMENT", "PUBLIC_SERVICES", "EMPLOYMENT",
  "INFRASTRUCTURE", "DOCUMENTATION", "SAFETY", "RIGHTS", "OTHER",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type ReportStatus = (typeof REPORT_STATUSES)[number] | "REJECTED";
