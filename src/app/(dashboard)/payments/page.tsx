import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentsTable } from "@/components/tables/payments-table";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return (
    <>
      <PageHeader
        title="Payments"
        description="Fees paid for featured listings, verification and services."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <PaymentsTable />
      </Suspense>
    </>
  );
}
