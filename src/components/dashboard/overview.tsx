"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, ClipboardList, Inbox, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryLabels } from "@/config/options";
import { queryKeys } from "@/lib/query-keys";
import {
  enquiriesApi,
  propertiesApi,
  requirementsApi,
  submissionsApi,
  usersApi,
} from "@/lib/resources";
import { formatDate, formatPrice } from "@/lib/utils";
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
    <Link href={href} className="block h-full">
      <Card className="h-full transition-colors hover:border-emerald-500">
        <CardContent className="flex h-full min-h-28 items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            {value === undefined ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : (
              <p className="mt-1 text-3xl font-semibold">{value}</p>
            )}
            <p className="mt-1 min-h-4 text-xs text-slate-500">{hint}</p>
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

  const users = useQuery({
    queryKey: queryKeys.list("users", { pageSize: 1 }),
    queryFn: () => usersApi.list({ pageSize: 1 }),
  });

  const recentProperties = useQuery({
    queryKey: queryKeys.list("properties", { sort: "createdAt", order: "desc", pageSize: 5 }),
    queryFn: () => propertiesApi.list({ sort: "createdAt", order: "desc", pageSize: 5 }),
  });
  const recentUsers = useQuery({
    queryKey: queryKeys.list("users", { sort: "createdAt", order: "desc", pageSize: 5 }),
    queryFn: () => usersApi.list({ sort: "createdAt", order: "desc", pageSize: 5 }),
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
          href="/properties?tab=submissions&status=pending"
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
        <StatCard label="Users" value={users.data?.total} href="/users" icon={Users} />
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
              href="/properties?tab=submissions&status=pending"
              className="mt-3 inline-block text-sm text-emerald-600 underline"
            >
              Review submissions
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recently added properties</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProperties.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : recentProperties.data?.data.length ? (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentProperties.data.data.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <div className="min-w-0">
                      <Link
                        href={`/properties/${p.id}/edit`}
                        className="block truncate font-medium hover:text-emerald-600"
                      >
                        {p.title}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {formatPrice(p.price)} · {p.locality}, {p.city} · {formatDate(p.createdAt)}
                      </p>
                    </div>
                    <StatusBadge value={p.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No properties yet.</p>
            )}
            <Link
              href="/properties"
              className="mt-3 inline-block text-sm text-emerald-600 underline"
            >
              View all properties
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently added users</CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : recentUsers.data?.data.length ? (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentUsers.data.data.map((u) => (
                  <li key={u.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{u.name}</p>
                      <p className="truncate text-xs text-slate-500">
                        {u.email} · {formatDate(u.createdAt)}
                      </p>
                    </div>
                    <StatusBadge value={u.role} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No users yet.</p>
            )}
            <Link href="/users" className="mt-3 inline-block text-sm text-emerald-600 underline">
              View all users
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
