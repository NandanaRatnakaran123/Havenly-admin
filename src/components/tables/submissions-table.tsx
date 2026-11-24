"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { ResourceTable } from "@/components/data-table/resource-table";
import { RowActions } from "@/components/data-table/row-actions";
import { StatusBadge } from "@/components/ui/badge";
import { categoryLabels, posterRoleLabels } from "@/config/options";
import { propertiesApi, submissionsApi } from "@/lib/resources";
import { formatArea, formatDate, formatPrice } from "@/lib/utils";
import type { Submission } from "@/types";

/** Approving a submission also creates a draft property, so staff can finish and publish it. */
function createDraftFrom(s: Submission) {
  return propertiesApi.create({
    title: `${categoryLabels[s.category]} in ${s.locality}`,
    description: s.description,
    price: s.price,
    type: s.type,
    category: s.category,
    bedrooms: 0,
    bathrooms: 0,
    areaSqft: s.areaSqft,
    address: s.locality,
    locality: s.locality,
    city: s.city,
    possession: "Ready to move",
    amenities: [],
    posterName: s.name,
    posterRole: s.role,
    featured: false,
    verified: false,
    status: "draft",
    createdAt: new Date().toISOString().slice(0, 10),
  });
}

const columns: ColumnDef<Submission, unknown>[] = [
  {
    accessorKey: "name",
    header: "Submitted by",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-slate-500">
          {posterRoleLabels[row.original.role]} · {row.original.phone}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Listing",
    cell: ({ row }) => (
      <div className="min-w-56">
        <p>
          {categoryLabels[row.original.category]} · {row.original.type === "rent" ? "Rent" : "Sale"}
        </p>
        <p className="text-xs text-slate-500">
          {row.original.locality}, {row.original.city} · {formatArea(row.original.areaSqft)}
        </p>
        <p className="max-w-sm truncate text-xs text-slate-500">{row.original.description}</p>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <span className="whitespace-nowrap">{formatPrice(row.original.price)}</span>,
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
        resourceKey="submissions"
        resource={submissionsApi}
        row={row.original}
        entity="submission"
        actions={[
          {
            label: "Approve and create draft property",
            icon: Check,
            patch: { status: "approved" },
            hideWhenStatus: "approved",
            after: () => createDraftFrom(row.original),
          },
          { label: "Reject", icon: X, patch: { status: "rejected" }, hideWhenStatus: "rejected" },
        ]}
      />
    ),
  },
];

export function SubmissionsTable() {
  return (
    <ResourceTable
      resourceKey="submissions"
      resource={submissionsApi}
      columns={columns}
      searchPlaceholder="Search name, locality, city, phone..."
      statusOptions={["pending", "approved", "rejected"]}
      emptyTitle="No submissions"
    />
  );
}
