import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { GuideForm } from "@/components/tables/guide-form";

export const metadata: Metadata = { title: "Add guide" };

export default function NewGuidePage() {
  return (
    <>
      <PageHeader title="Add guide" />
      <GuideForm />
    </>
  );
}
