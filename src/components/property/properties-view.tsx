"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PropertiesTable } from "@/components/property/properties-table";
import { AddLink } from "@/components/shared/add-link";
import { PageHeader } from "@/components/shared/page-header";
import { SubmissionsTable } from "@/components/tables/submissions-table";
import { sectionRoles } from "@/config/access";
import { queryKeys } from "@/lib/query-keys";
import { submissionsApi } from "@/lib/resources";
import { cn } from "@/lib/utils";
import { useUi } from "@/store/ui";

const pendingParams = { status: "pending", pageSize: 1 } as const;

/** Properties page with two tabs: live listings, and visitor submissions waiting for review. */
export function PropertiesView() {
  const role = useUi((s) => s.role);
  const canReview = sectionRoles["/submissions"].includes(role);
  const tab =
    useSearchParams().get("tab") === "submissions" && canReview ? "submissions" : "properties";

  const pending = useQuery({
    queryKey: queryKeys.list("submissions", pendingParams),
    queryFn: () => submissionsApi.list(pendingParams),
    enabled: canReview,
  });

  const tabs = [
    { id: "properties", label: "Properties", href: "/properties" },
    ...(canReview
      ? [{ id: "submissions", label: "Submissions", href: "/properties?tab=submissions" }]
      : []),
  ];

  return (
    <>
      <PageHeader
        title="Properties"
        description={
          tab === "properties"
            ? "Every listing shown on the Havenly site. Publish, feature, verify or edit."
            : "Properties posted by visitors via “Post property”. Approving one creates a draft listing."
        }
        actions={
          tab === "properties" ? <AddLink href="/properties/new" label="Add property" /> : undefined
        }
      />
      <div
        role="tablist"
        aria-label="Properties sections"
        className="mb-4 flex gap-1 border-b border-slate-200 dark:border-slate-800"
      >
        {tabs.map((t) => {
          const selected = t.id === tab;
          return (
            <Link
              key={t.id}
              href={t.href}
              role="tab"
              aria-selected={selected}
              className={cn(
                "-mb-px flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium whitespace-nowrap",
                selected
                  ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100",
              )}
            >
              {t.label}
              {t.id === "submissions" && Boolean(pending.data?.total) && (
                <span className="rounded-full bg-amber-100 px-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {pending.data?.total}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      {tab === "properties" ? <PropertiesTable /> : <SubmissionsTable />}
    </>
  );
}
