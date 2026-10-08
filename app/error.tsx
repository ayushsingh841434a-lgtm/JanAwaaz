"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-ink-900">Kuch gadbad hui</h1>
      <p className="mt-2 text-ink-600">Something went wrong. Please try again.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-2xl bg-saffron-600 px-6 py-3 font-bold text-white shadow-soft transition hover:bg-saffron-700"
      >
        Try again
      </button>
    </div>
  );
}
