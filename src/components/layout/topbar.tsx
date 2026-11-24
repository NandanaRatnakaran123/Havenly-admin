"use client";

import { ExternalLink, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useUi } from "@/store/ui";

export function Topbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const setSidebarOpen = useUi((s) => s.setSidebarOpen);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <a
        href={siteConfig.publicSiteUrl}
        target="_blank"
        rel="noreferrer"
        className="hidden items-center gap-1 text-sm text-slate-600 hover:text-emerald-600 sm:inline-flex dark:text-slate-300"
      >
        View site <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      </a>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        {/* Both icons rendered, CSS picks one, so there is no hydration mismatch. */}
        <Sun className="hidden h-4 w-4 dark:block" />
        <Moon className="h-4 w-4 dark:hidden" />
      </Button>

      <form action={logoutAction}>
        <Button type="submit" variant="secondary" size="sm">
          <LogOut className="h-4 w-4" aria-hidden /> Sign out
        </Button>
      </form>
    </header>
  );
}
