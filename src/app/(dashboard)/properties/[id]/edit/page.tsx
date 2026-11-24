import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyForm } from "@/components/property/property-form";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Edit property" };

async function EditLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PropertyForm id={id} />;
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <PageHeader title="Edit property" />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <EditLoader params={params} />
      </Suspense>
    </>
  );
}
