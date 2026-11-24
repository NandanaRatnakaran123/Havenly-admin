"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, EyeOff } from "lucide-react";
import { ResourceTable } from "@/components/data-table/resource-table";
import { RowActions } from "@/components/data-table/row-actions";
import { StatusBadge } from "@/components/ui/badge";
import { servicesApi } from "@/lib/resources";
import { formatDate } from "@/lib/utils";
import type { Service } from "@/types";

const columns: ColumnDef<Service, unknown>[] = [
  {
    accessorKey: "title",
    header: "Service",
    cell: ({ row }) => (
      <div className="min-w-56">
        <p className="font-medium">{row.original.title}</p>
        <p className="max-w-md truncate text-xs text-slate-500">{row.original.summary}</p>
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Anchor",
    cell: ({ row }) => <span className="text-slate-500">/services#{row.original.slug}</span>,
  },
  {
    id: "points",
    header: "Bullets",
    enableSorting: false,
    cell: ({ row }) => row.original.points.length,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Added",
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
        resourceKey="services"
        resource={servicesApi}
        row={row.original}
        entity="service"
        editHref={`/services/${row.original.id}/edit`}
        actions={[
          {
            label: "Publish",
            icon: Eye,
            patch: { status: "published" },
            hideWhenStatus: "published",
          },
          { label: "Unpublish", icon: EyeOff, patch: { status: "draft" }, hideWhenStatus: "draft" },
        ]}
      />
    ),
  },
];

export function ServicesTable() {
  return (
    <ResourceTable
      resourceKey="services"
      resource={servicesApi}
      columns={columns}
      searchPlaceholder="Search services..."
      statusOptions={["published", "draft"]}
      emptyTitle="No services"
    />
  );
}
