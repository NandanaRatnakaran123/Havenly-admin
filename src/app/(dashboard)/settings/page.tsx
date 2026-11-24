import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ChangePasswordForm } from "@/components/tables/change-password-form";
import { SettingsForm } from "@/components/tables/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Site-wide contact details and your account." />
      <div className="space-y-6">
        <SettingsForm />
        <ChangePasswordForm />
      </div>
    </>
  );
}
