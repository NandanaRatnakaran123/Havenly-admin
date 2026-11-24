"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, EyeOff } from "lucide-react";
import { ResourceTable } from "@/components/data-table/resource-table";
import { RowActions } from "@/components/data-table/row-actions";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { blogApi } from "@/lib/resources";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

const columns: ColumnDef<BlogPost, unknown>[] = [
  {
    accessorKey: "title",
    header: "Guide",
    cell: ({ row }) => (
      <div className="min-w-56">
        <p className="font-medium">{row.original.title}</p>
        <p className="text-xs text-slate-500">/blog/{row.original.slug}</p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <Badge>{row.original.category}</Badge>,
  },
  {
    accessorKey: "readMins",
    header: "Read time",
    cell: ({ row }) => `${row.original.readMins} min`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Published",
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
        resourceKey="blog"
        resource={blogApi}
        row={row.original}
        entity="guide"
        editHref={`/blog/${row.original.id}/edit`}
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

export function BlogTable() {
  return (
    <ResourceTable
      resourceKey="blog"
      resource={blogApi}
      columns={columns}
      searchPlaceholder="Search guides..."
      statusOptions={["published", "draft"]}
      emptyTitle="No guides"
    />
  );
}
