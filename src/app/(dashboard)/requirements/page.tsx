import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { RequirementsTable } from "@/components/tables/requirements-table";

export const metadata: Metadata = { title: "Requirements" };

export default function RequirementsPage() {
  return (
    <>
      <PageHeader
        title="Requirements"
        description="What buyers and tenants posted via “Post your requirement”."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <RequirementsTable />
      </Suspense>
    </>
  );
}
