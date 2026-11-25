"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { ResourceTable } from "@/components/data-table/resource-table";
import { RowActions } from "@/components/data-table/row-actions";
import { StatusBadge } from "@/components/ui/badge";
import { paymentsApi } from "@/lib/resources";
import { formatDate, formatPrice, propertyRef, titleCase } from "@/lib/utils";
import type { Payment } from "@/types";

const columns: ColumnDef<Payment, unknown>[] = [
  { accessorKey: "reference", header: "Reference" },
  {
    accessorKey: "payerName",
    header: "Payer",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.payerName}</p>
        {row.original.payerEmail && (
          <p className="text-xs text-slate-500">{row.original.payerEmail}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "purpose",
    header: "For",
    cell: ({ row }) => (
      <div>
        <p>{row.original.purpose}</p>
        {row.original.propertyId && (
          <p className="text-xs text-slate-500">{propertyRef(row.original.propertyId)}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatPrice(row.original.amount)}</span>
    ),
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => (row.original.method === "upi" ? "UPI" : titleCase(row.original.method)),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
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
        resourceKey="payments"
        resource={paymentsApi}
        row={row.original}
        entity="payment"
        actions={
          row.original.status === "pending"
            ? [{ label: "Mark paid", icon: CheckCircle2, patch: { status: "paid" } }]
            : row.original.status === "paid"
              ? [{ label: "Refund", icon: RotateCcw, patch: { status: "refunded" } }]
              : []
        }
      />
    ),
  },
];

export function PaymentsTable() {
  return (
    <ResourceTable
      resourceKey="payments"
      resource={paymentsApi}
      columns={columns}
      statusOptions={["paid", "pending", "failed", "refunded"]}
      searchPlaceholder="Search reference, payer, purpose..."
      emptyTitle="No payments"
    />
  );
}
