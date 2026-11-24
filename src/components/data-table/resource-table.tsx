"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ColumnDef, OnChangeFn, SortingState } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { queryKeys } from "@/lib/query-keys";
import type { ListParams, Resource } from "@/lib/resource";
import { titleCase } from "@/lib/utils";

interface ResourceTableProps<T extends { id: string }> {
  /** react-query key prefix, e.g. "properties" */
  resourceKey: string;
  resource: Resource<T>;
  columns: ColumnDef<T, unknown>[];
  searchPlaceholder?: string;
  /** Values for the status filter dropdown. Omit to hide it. */
  statusOptions?: string[];
  emptyTitle: string;
  pageSize?: number;
}

/**
 * List view whose page, search, status filter and sort live in the URL (?page=&q=&status=&sort=&order=),
 * so every view is linkable and survives refresh.
 */
export function ResourceTable<T extends { id: string }>({
  resourceKey,
  resource,
  columns,
  searchPlaceholder = "Search...",
  statusOptions,
  emptyTitle,
  pageSize = 10,
}: ResourceTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params: ListParams = {
    page: Number(searchParams.get("page")) || 1,
    pageSize,
    search: searchParams.get("q") ?? "",
    status: searchParams.get("status") ?? "",
    sort: searchParams.get("sort") ?? undefined,
    order: searchParams.get("order") === "desc" ? "desc" : "asc",
  };

  function updateUrl(patch: Record<string, string | undefined>, keepPage = false) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!keepPage) next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Debounced search box -> URL
  const [text, setText] = useState(params.search ?? "");
  const debounced = useDebounce(text);
  useEffect(() => {
    if (debounced !== (searchParams.get("q") ?? "")) updateUrl({ q: debounced || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const sorting: SortingState = params.sort
    ? [{ id: params.sort, desc: params.order === "desc" }]
    : [];
  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    const first = next[0];
    updateUrl({ sort: first?.id, order: first ? (first.desc ? "desc" : "asc") : undefined });
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.list(resourceKey, params),
    queryFn: () => resource.list(params),
    placeholderData: keepPreviousData,
  });

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="relative min-w-52 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search"
            className="pl-9"
          />
        </div>
        {statusOptions && (
          <Select
            aria-label="Filter by status"
            value={params.status}
            onChange={(e) => updateUrl({ status: e.target.value || undefined })}
            className="w-40"
          >
            <option value="">All statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {titleCase(s)}
              </option>
            ))}
          </Select>
        )}
      </div>

      {isError ? (
        <div className="space-y-2 p-8 text-center">
          <p className="font-medium text-red-600">Could not load data</p>
          <p className="text-sm text-slate-500">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm text-emerald-600 underline"
          >
            Try again
          </button>
        </div>
      ) : !isLoading && data?.data.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={
            params.search || params.status ? "Try changing the search or filters." : undefined
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          sorting={sorting}
          onSortingChange={onSortingChange}
          loading={isLoading}
        />
      )}

      <DataTablePagination
        page={params.page ?? 1}
        pageSize={pageSize}
        total={data?.total ?? 0}
        onPageChange={(page) => updateUrl({ page: page > 1 ? String(page) : undefined }, true)}
      />
    </Card>
  );
}
