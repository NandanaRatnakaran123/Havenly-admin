"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Ban, UserCheck } from "lucide-react";
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
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.active ? "active" : "blocked"} />,
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
        editHref={`/users/${row.original.id}/edit`}
        actions={
          row.original.active
            ? [
                {
                  label: "Block user",
                  icon: Ban,
                  patch: { active: false },
                  confirm: `${row.original.name} will no longer be able to sign in to the admin panel.`,
                },
              ]
            : [{ label: "Unblock user", icon: UserCheck, patch: { active: true } }]
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
      tabs={{
        param: "role",
        items: [
          { value: "", label: "All" },
          { value: "admin", label: "Admins" },
          { value: "staff", label: "Staff" },
          { value: "agent", label: "Agents" },
          { value: "buyer", label: "Buyers" },
        ],
      }}
      searchPlaceholder="Search name, email, role..."
      emptyTitle="No users"
    />
  );
}
