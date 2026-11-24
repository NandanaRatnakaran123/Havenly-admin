"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { UserCheck, UserX } from "lucide-react";
import { ResourceTable } from "@/components/data-table/resource-table";
import { RowActions } from "@/components/data-table/row-actions";
import { StatusBadge } from "@/components/ui/badge";
import { usersApi } from "@/lib/resources";
import { formatDate } from "@/lib/utils";
import type { AdminUser } from "@/types";

const columns: ColumnDef<AdminUser, unknown>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-slate-500">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <StatusBadge value={row.original.role} />,
  },
  {
    accessorKey: "active",
    header: "Access",
    cell: ({ row }) => <StatusBadge value={row.original.active ? "active" : "inactive"} />,
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
        resourceKey="users"
        resource={usersApi}
        row={row.original}
        entity="user"
        actions={
          row.original.active
            ? [{ label: "Deactivate", icon: UserX, patch: { active: false } }]
            : [{ label: "Activate", icon: UserCheck, patch: { active: true } }]
        }
      />
    ),
  },
];

export function UsersTable() {
  return (
    <ResourceTable
      resourceKey="users"
      resource={usersApi}
      columns={columns}
      searchPlaceholder="Search name, email, role..."
      emptyTitle="No users"
    />
  );
}
