import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceForm } from "@/components/tables/service-form";

export const metadata: Metadata = { title: "Add service" };

export default function NewServicePage() {
  return (
    <>
      <PageHeader title="Add service" />
      <ServiceForm />
    </>
  );
}
