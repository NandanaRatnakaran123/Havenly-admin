import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertiesTable } from "@/components/property/properties-table";
import { AddLink } from "@/components/shared/add-link";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Properties" };

export default function PropertiesPage() {
  return (
    <>
      <PageHeader
        title="Properties"
        description="Every listing shown on the Havenly site. Publish, feature, verify or edit."
        actions={<AddLink href="/properties/new" label="Add property" />}
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <PropertiesTable />
      </Suspense>
    </>
  );
}
