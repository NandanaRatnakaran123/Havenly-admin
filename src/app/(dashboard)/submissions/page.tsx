import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { SubmissionsTable } from "@/components/tables/submissions-table";

export const metadata: Metadata = { title: "Submissions" };

export default function SubmissionsPage() {
  return (
    <>
      <PageHeader
        title="Submissions"
        description="Properties posted by visitors via “Post property”. Approving one creates a draft listing."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <SubmissionsTable />
      </Suspense>
    </>
  );
}
