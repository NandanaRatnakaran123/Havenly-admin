import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { GuideForm } from "@/components/tables/guide-form";

export const metadata: Metadata = { title: "Edit guide" };

async function EditLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GuideForm id={id} />;
}

export default function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <PageHeader title="Edit guide" />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <EditLoader params={params} />
      </Suspense>
    </>
  );
}
