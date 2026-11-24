import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-5xl font-bold text-emerald-600">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <Link href="/" className="text-sm text-emerald-600 underline">
        Back to overview
      </Link>
    </div>
  );
}
