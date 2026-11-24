import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsForm } from "@/components/tables/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Site-wide contact details." />
      <SettingsForm />
    </>
  );
}
