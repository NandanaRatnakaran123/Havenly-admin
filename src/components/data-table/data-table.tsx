"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/table";

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  loading?: boolean;
  skeletonRows?: number;
}

/** Presentational table. Sorting is server-side: the parent owns `sorting` and refetches. */
export function DataTable<T>({
  columns,
  data,
  sorting,
  onSortingChange,
  loading,
  skeletonRows = 6,
}: DataTableProps<T>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    manualSorting: true,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <THead>
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id}>
            {group.headers.map((header) => {
              const sorted = header.column.getIsSorted();
              const canSort = header.column.getCanSort();
              const label = flexRender(header.column.columnDef.header, header.getContext());
              return (
                <Th
                  key={header.id}
                  aria-sort={
                    sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined
                  }
                >
                  {canSort ? (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className="inline-flex items-center gap-1 uppercase hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      {label}
                      {sorted === "asc" ? (
                        <ArrowUp className="h-3 w-3" aria-hidden />
                      ) : sorted === "desc" ? (
                        <ArrowDown className="h-3 w-3" aria-hidden />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-40" aria-hidden />
                      )}
                    </button>
                  ) : (
                    label
                  )}
                </Th>
              );
            })}
          </tr>
        ))}
      </THead>
      <TBody>
        {loading
          ? Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i}>
                {columns.map((_, j) => (
                  <Td key={j}>
                    <Skeleton className="h-4 w-full max-w-40" />
                  </Td>
                ))}
              </tr>
            ))
          : table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                ))}
              </Tr>
            ))}
      </TBody>
    </Table>
  );
}
