"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, ClipboardList, Inbox, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryLabels } from "@/config/options";
import { queryKeys } from "@/lib/query-keys";
import { enquiriesApi, propertiesApi, requirementsApi, submissionsApi } from "@/lib/resources";
import type { PropertyCategory } from "@/types";

function StatCard({
  label,
  value,
  hint,
  href,
  icon: Icon,
}: {
  label: string;
  value: number | undefined;
  hint?: string;
  href: string;
  icon: typeof Building2;
}) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:border-emerald-500">
        <CardContent className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            {value === undefined ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : (
              <p className="mt-1 text-3xl font-semibold">{value}</p>
            )}
            {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
          </div>
          <Icon className="h-5 w-5 text-emerald-600" aria-hidden />
        </CardContent>
      </Card>
    </Link>
  );
}

export function Overview() {
  const properties = useQuery({
    queryKey: queryKeys.list("properties", { pageSize: 500 }),
    queryFn: () => propertiesApi.list({ pageSize: 500 }),
  });
  const pending = useQuery({
    queryKey: queryKeys.list("submissions", { status: "pending", pageSize: 5 }),
    queryFn: () => submissionsApi.list({ status: "pending", pageSize: 5 }),
  });
  const newReqs = useQuery({
    queryKey: queryKeys.list("requirements", { status: "new", pageSize: 1 }),
    queryFn: () => requirementsApi.list({ status: "new", pageSize: 1 }),
  });
  const newEnquiries = useQuery({
    queryKey: queryKeys.list("enquiries", { status: "new", pageSize: 1 }),
    queryFn: () => enquiriesApi.list({ status: "new", pageSize: 1 }),
  });

  const all = properties.data?.data;
  const published = all?.filter((p) => p.status === "published").length;
  const byCategory = (Object.keys(categoryLabels) as PropertyCategory[]).map((c) => ({
    key: c,
    count: all?.filter((p) => p.category === c).length ?? 0,
  }));
  const max = Math.max(1, ...byCategory.map((c) => c.count));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Properties"
          value={properties.data?.total}
          hint={published === undefined ? undefined : `${published} published`}
          href="/properties"
          icon={Building2}
        />
        <StatCard
          label="Pending submissions"
          value={pending.data?.total}
          href="/submissions?status=pending"
          icon={Inbox}
        />
        <StatCard
          label="New requirements"
          value={newReqs.data?.total}
          href="/requirements?status=new"
          icon={ClipboardList}
        />
        <StatCard
          label="New enquiries"
          value={newEnquiries.data?.total}
          href="/enquiries?status=new"
          icon={MessageSquare}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Listings by property type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {byCategory.map(({ key, count }) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{categoryLabels[key]}</span>
                  <span className="text-slate-500">{count}</span>
                </div>
                <div
                  className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"
                  role="img"
                  aria-label={`${categoryLabels[key]}: ${count}`}
                >
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Awaiting review</CardTitle>
          </CardHeader>
          <CardContent>
            {pending.isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : pending.data?.data.length ? (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {pending.data.data.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span>
                      {categoryLabels[s.category]} in {s.locality}, {s.city}
                    </span>
                    <span className="text-slate-500">{s.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Nothing waiting. 🎉</p>
            )}
            <Link
              href="/submissions?status=pending"
              className="mt-3 inline-block text-sm text-emerald-600 underline"
            >
              Review submissions
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
