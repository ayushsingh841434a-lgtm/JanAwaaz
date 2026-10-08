"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

interface Toast {
  id: number;
  kind: "success" | "error" | "info";
  message: string;
}

const ToastContext = createContext<{
  toast: (message: string, kind?: Toast["kind"]) => void;
} | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, kind: Toast["kind"] = "success") => {
    const id = nextId++;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-24 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4 md:bottom-8">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bubble-in pointer-events-auto flex w-full items-center gap-3 rounded-2xl bg-ink-900 px-4 py-3 text-sm text-white shadow-lift"
          >
            {t.kind === "success" && <CheckCircle2 className="h-5 w-5 shrink-0 text-leaf-400" />}
            {t.kind === "error" && <AlertTriangle className="h-5 w-5 shrink-0 text-saffron-400" />}
            {t.kind === "info" && <Info className="h-5 w-5 shrink-0 text-chakra-300" />}
            <span className="flex-1">{t.message}</span>
            <button
              aria-label="Dismiss"
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              className="rounded p-1 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
