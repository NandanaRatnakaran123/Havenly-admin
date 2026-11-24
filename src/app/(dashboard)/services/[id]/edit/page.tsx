import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceForm } from "@/components/tables/service-form";

export const metadata: Metadata = { title: "Edit service" };

async function EditLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ServiceForm id={id} />;
}

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <PageHeader title="Edit service" />
      <Suspense fallback={<Skeleton className="h-72 w-full" />}>
        <EditLoader params={params} />
      </Suspense>
    </>
  );
}
