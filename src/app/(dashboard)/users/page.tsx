import type { Metadata } from "next";
import { Suspense } from "react";
import { AddLink } from "@/components/shared/add-link";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersTable } from "@/components/tables/users-table";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  return (
    <>
      <PageHeader
        title="Users"
        description="Admin panel accounts and their roles."
        actions={<AddLink href="/users/new" label="Add user" />}
      />
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <UsersTable />
      </Suspense>
    </>
  );
}
