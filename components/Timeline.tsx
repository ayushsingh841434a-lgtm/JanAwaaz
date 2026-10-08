"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { REPORT_STATUSES } from "@/lib/utils";

/** Vertical complaint-tracking timeline. */
export function Timeline({ history, current }: {
  history: { toStatus: string; createdAt: string | Date; note?: string | null }[];
  current: string;
}) {
  const { tStatus } = useLanguage();
  const reached = new Set(history.map((h) => h.toStatus));
  const currentIdx = REPORT_STATUSES.indexOf(current as never);

  return (
    <ol className="relative space-y-0 border-l-2 border-ink-900/10 pl-0" aria-label="Complaint timeline">
      {REPORT_STATUSES.map((s, i) => {
        const done = reached.has(s) || i < currentIdx || current === s;
        const isCurrent = current === s;
        const entry = history.find((h) => h.toStatus === s);
        return (
          <li key={s} className="relative pb-7 pl-10 last:pb-0">
            <span
              className={cn(
                "absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2",
                done ? "border-leaf-500 bg-leaf-500 text-white" : "border-ink-900/20 bg-white",
                isCurrent && "ring-4 ring-saffron-200"
              )}
              aria-hidden="true"
            >
              {done && <Check className="h-3.5 w-3.5" />}
            </span>
            {i < REPORT_STATUSES.length - 1 && (
              <span className={cn("absolute -left-[2px] top-6 h-[calc(100%-24px)] w-0.5", done ? "bg-leaf-300" : "bg-ink-900/10")} aria-hidden="true" />
            )}
            <p className={cn("text-sm font-bold", isCurrent ? "text-saffron-700" : done ? "text-ink-900" : "text-ink-400")}>
              {tStatus(s)}
              {isCurrent && <span className="ml-2 rounded-full bg-saffron-100 px-2 py-0.5 text-[10px] font-bold uppercase">current</span>}
            </p>
            {entry && (
              <p className="mt-0.5 text-xs text-ink-400">
                {new Date(entry.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                {entry.note ? ` — ${entry.note}` : ""}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
