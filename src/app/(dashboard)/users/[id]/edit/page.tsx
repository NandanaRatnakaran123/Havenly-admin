import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { UserForm } from "@/components/tables/user-form";

export const metadata: Metadata = { title: "Edit user" };

async function EditLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserForm id={id} />;
}

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <PageHeader title="Edit user" description="Change name, email, role or access." />
      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <EditLoader params={params} />
      </Suspense>
    </>
  );
}
