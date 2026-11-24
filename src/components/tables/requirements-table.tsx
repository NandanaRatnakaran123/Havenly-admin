"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CheckCheck, PhoneCall } from "lucide-react";
import { ResourceTable } from "@/components/data-table/resource-table";
import { RowActions } from "@/components/data-table/row-actions";
import { StatusBadge } from "@/components/ui/badge";
import { categoryLabels } from "@/config/options";
import { requirementsApi } from "@/lib/resources";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Requirement } from "@/types";

const columns: ColumnDef<Requirement, unknown>[] = [
  {
    accessorKey: "name",
    header: "Visitor",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-slate-500">
          {row.original.phone}
          {row.original.email && ` · ${row.original.email}`}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Looking for",
    cell: ({ row }) => (
      <div>
        <p>
          {categoryLabels[row.original.category]} · {row.original.type === "rent" ? "Rent" : "Buy"}
        </p>
        <p className="text-xs text-slate-500">
          {row.original.locality ? `${row.original.locality}, ` : ""}
          {row.original.city}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "budget",
    header: "Max budget",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatPrice(row.original.budget)}</span>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    enableSorting: false,
    cell: ({ row }) => (
      <p className="max-w-xs truncate text-slate-600 dark:text-slate-300">{row.original.notes}</p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Received",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatDate(row.original.createdAt)}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => (
      <RowActions
        resourceKey="requirements"
        resource={requirementsApi}
        row={row.original}
        entity="requirement"
        actions={[
          {
            label: "Mark contacted",
            icon: PhoneCall,
            patch: { status: "contacted" },
            hideWhenStatus: "contacted",
          },
          {
            label: "Close",
            icon: CheckCheck,
            patch: { status: "closed" },
            hideWhenStatus: "closed",
          },
        ]}
      />
    ),
  },
];

export function RequirementsTable() {
  return (
    <ResourceTable
      resourceKey="requirements"
      resource={requirementsApi}
      columns={columns}
      searchPlaceholder="Search name, city, locality, phone..."
      statusOptions={["new", "contacted", "closed"]}
      emptyTitle="No requirements"
    />
  );
}
