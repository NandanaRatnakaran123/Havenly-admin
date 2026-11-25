"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CheckCheck, PhoneCall } from "lucide-react";
import { ResourceTable } from "@/components/data-table/resource-table";
import { RowActions } from "@/components/data-table/row-actions";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { enquiriesApi } from "@/lib/resources";
import { formatDate, titleCase } from "@/lib/utils";
import type { Enquiry } from "@/types";

const columns: ColumnDef<Enquiry, unknown>[] = [
  {
    accessorKey: "name",
    header: "From",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-slate-500">
          {row.original.email} · {row.original.phone}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => (
      <div className="space-y-1">
        <Badge>
          {row.original.source === "callback" ? "Loan call-back" : titleCase(row.original.source)}
        </Badge>
        {row.original.subject && <p className="text-xs text-slate-500">{row.original.subject}</p>}
      </div>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    enableSorting: false,
    cell: ({ row }) => (
      <p className="max-w-sm truncate text-slate-600 dark:text-slate-300">
        {row.original.iAm && <Badge className="mr-2">{titleCase(row.original.iAm)}</Badge>}
        {row.original.message}
      </p>
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
        resourceKey="enquiries"
        resource={enquiriesApi}
        row={row.original}
        entity="enquiry"
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

export function EnquiriesTable() {
  return (
    <ResourceTable
      resourceKey="enquiries"
      resource={enquiriesApi}
      columns={columns}
      tabs={{
        param: "iAm",
        items: [
          { value: "", label: "All" },
          { value: "agent", label: "Agents" },
          { value: "buyer", label: "Buyers" },
          { value: "general", label: "General" },
        ],
      }}
      searchPlaceholder="Search name, email, phone, message..."
      statusOptions={["new", "contacted", "closed"]}
      emptyTitle="No enquiries"
    />
  );
}
