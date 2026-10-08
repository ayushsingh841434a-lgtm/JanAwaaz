"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/provider";

const STATUS_STYLE: Record<string, string> = {
  REPORTED: "bg-chakra-100 text-chakra-800",
  AUTHORITY_IDENTIFIED: "bg-chakra-100 text-chakra-800",
  SUBMITTED: "bg-chakra-100 text-chakra-800",
  ACKNOWLEDGED: "bg-amber-100 text-amber-800",
  UNDER_REVIEW: "bg-amber-100 text-amber-800",
  ACTION_TAKEN: "bg-saffron-100 text-saffron-800",
  RESOLVED: "bg-leaf-100 text-leaf-800",
  REJECTED: "bg-red-100 text-red-800",
  // issue statuses
  UNVERIFIED: "bg-stone-200 text-stone-700",
  ACTION_PENDING: "bg-amber-100 text-amber-800",
  DISPUTED: "bg-orange-100 text-orange-800",
};

const ISSUE_LABEL: Record<string, string> = {
  UNVERIFIED: "⚪ Unverified",
  REPORTED: "🔵 Reported",
  UNDER_REVIEW: "🔵 Under Review",
  ACTION_PENDING: "🟡 Action Pending",
  DISPUTED: "🟠 Disputed",
  RESOLVED: "🟢 Resolved",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const { tStatus } = useLanguage();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        STATUS_STYLE[status] ?? "bg-stone-200 text-stone-700",
        className
      )}
    >
      {ISSUE_LABEL[status] ?? tStatus(status)}
    </span>
  );
}

const INFO_TYPE_STYLE: Record<string, string> = {
  verified: "bg-leaf-100 text-leaf-800",
  ai: "bg-chakra-100 text-chakra-800",
  reported: "bg-amber-100 text-amber-800",
  user: "bg-stone-200 text-stone-700",
  disputed: "bg-orange-100 text-orange-800",
};

const INFO_TYPE_LABEL: Record<string, string> = {
  verified: "🟢 Verified Information",
  ai: "🔵 AI Explanation",
  reported: "🟡 Reported Information",
  user: "⚪ User Provided",
  disputed: "🟠 Disputed",
};

export function InfoTypeBadge({ type, className }: { type: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        INFO_TYPE_STYLE[type] ?? INFO_TYPE_STYLE.ai,
        className
      )}
    >
      {INFO_TYPE_LABEL[type] ?? type}
    </span>
  );
}
