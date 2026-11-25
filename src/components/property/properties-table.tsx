"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { BadgeCheck, Eye, EyeOff, Star } from "lucide-react";
import { useState } from "react";
import { FeaturedPaymentDialog } from "@/components/property/featured-payment-dialog";
import { ResourceTable } from "@/components/data-table/resource-table";
import { RowActions } from "@/components/data-table/row-actions";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { categoryLabels, posterRoleLabels } from "@/config/options";
import { propertiesApi } from "@/lib/resources";
import { formatArea, formatDate, formatPrice, propertyRef } from "@/lib/utils";
import type { Property } from "@/types";

function PropertyRowActions({ property }: { property: Property }) {
  const [payOpen, setPayOpen] = useState(false);
  return (
    <>
      <RowActions
        resourceKey="properties"
        resource={propertiesApi}
        row={property}
        entity="property"
        editHref={`/properties/${property.id}/edit`}
        actions={[
          {
            label: "Publish",
            icon: Eye,
            patch: { status: "published" },
            hideWhenStatus: "published",
          },
          { label: "Unpublish", icon: EyeOff, patch: { status: "draft" }, hideWhenStatus: "draft" },
          {
            label: property.featured ? "Remove featured" : "Mark featured",
            icon: Star,
            patch: { featured: !property.featured },
            onClick: property.featured ? undefined : () => setPayOpen(true),
          },
          {
            label: property.verified ? "Remove verified" : "Mark verified",
            icon: BadgeCheck,
            patch: { verified: !property.verified },
          },
        ]}
      />

      <FeaturedPaymentDialog property={property} open={payOpen} onOpenChange={setPayOpen} />
    </>
  );
}

const columns: ColumnDef<Property, unknown>[] = [
  {
    accessorKey: "title",
    header: "Property",
    cell: ({ row }) => (
      <div className="min-w-56">
        <p className="font-medium">{row.original.title}</p>
        <p className="text-xs text-slate-500">
          {propertyRef(row.original.id)} · {row.original.locality}, {row.original.city}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Type",
    cell: ({ row }) => (
      <div>
        <p>{categoryLabels[row.original.category]}</p>
        <p className="text-xs text-slate-500">
          {row.original.type === "rent" ? "For rent" : "For sale"}
          {row.original.bedrooms > 0 && ` · ${row.original.bedrooms} BHK`} ·{" "}
          {formatArea(row.original.areaSqft)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatPrice(row.original.price)}
        {row.original.type === "rent" && " /mo"}
      </span>
    ),
  },
  {
    accessorKey: "posterName",
    header: "Advertiser",
    cell: ({ row }) => (
      <div>
        <p>{row.original.posterName}</p>
        <p className="text-xs text-slate-500">{posterRoleLabels[row.original.posterRole]}</p>
      </div>
    ),
  },
  {
    id: "flags",
    header: "Badges",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.featured && <Badge tone="blue">Featured</Badge>}
        {row.original.verified && <Badge tone="green">Verified</Badge>}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Posted",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatDate(row.original.createdAt)}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => <PropertyRowActions property={row.original} />,
  },
];

export function PropertiesTable() {
  return (
    <ResourceTable
      resourceKey="properties"
      resource={propertiesApi}
      columns={columns}
      searchPlaceholder="Search title, city, locality, advertiser..."
      statusOptions={["published", "draft"]}
      emptyTitle="No properties found"
    />
  );
}
