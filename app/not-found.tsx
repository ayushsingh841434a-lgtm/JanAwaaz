export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-extrabold text-tricolor">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">Page nahi mila</h1>
      <p className="mt-2 text-ink-600">
        The page you're looking for doesn't exist — but every voice still matters.
      </p>
      <a
        href="/"
        className="mt-6 rounded-2xl bg-saffron-600 px-6 py-3 font-bold text-white shadow-soft transition hover:bg-saffron-700"
      >
        Back to Home
      </a>
    </div>
  );
}
