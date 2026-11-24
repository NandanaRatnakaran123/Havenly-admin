import type { Metadata } from "next";
import { PropertyForm } from "@/components/property/property-form";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Add property" };

export default function NewPropertyPage() {
  return (
    <>
      <PageHeader
        title="Add property"
        description="Create a listing. Keep it as a draft until it is ready."
      />
      <PropertyForm />
    </>
  );
}
