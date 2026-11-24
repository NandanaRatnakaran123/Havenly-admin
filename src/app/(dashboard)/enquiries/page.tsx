import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { EnquiriesTable } from "@/components/tables/enquiries-table";

export const metadata: Metadata = { title: "Enquiries" };

export default function EnquiriesPage() {
  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Contact messages, property and service enquiries, and loan call-back requests."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <EnquiriesTable />
      </Suspense>
    </>
  );
}
