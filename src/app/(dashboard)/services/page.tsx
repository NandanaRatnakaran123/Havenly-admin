import type { Metadata } from "next";
import { Suspense } from "react";
import { AddLink } from "@/components/shared/add-link";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ServicesTable } from "@/components/tables/services-table";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Services"
        description="Legal advice, registration, building plans and other services shown on /services."
        actions={<AddLink href="/services/new" label="Add service" />}
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ServicesTable />
      </Suspense>
    </>
  );
}
