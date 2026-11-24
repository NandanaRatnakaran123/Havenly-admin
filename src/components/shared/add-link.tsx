import { Plus } from "lucide-react";
import Link from "next/link";

export function AddLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700"
    >
      <Plus className="h-4 w-4" aria-hidden />
      {label}
    </Link>
  );
}
