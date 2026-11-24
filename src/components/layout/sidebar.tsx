"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { isActive, navItems } from "@/config/nav";
import { cn } from "@/lib/utils";
import { useUi } from "@/store/ui";

/** Reads the pathname (runtime data), so it must sit inside <Suspense> for prerendering. */
function SidebarNav() {
  const pathname = usePathname();
  const role = useUi((s) => s.role);
  const setOpen = useUi((s) => s.setSidebarOpen);
  const items = navItems.filter((item) => item.roles.includes(role));

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Main">
      {items.map(({ label, href, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const open = useUi((s) => s.sidebarOpen);
  const setOpen = useUi((s) => s.setSidebarOpen);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <span className="text-lg font-bold text-emerald-600">Havenly Admin</span>
          <button
            type="button"
            className="rounded-md p-1 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <Suspense fallback={<div className="flex-1" />}>
          <SidebarNav />
        </Suspense>
      </aside>
    </>
  );
}
