import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { UserForm } from "@/components/tables/user-form";

export const metadata: Metadata = { title: "Add user" };

export default function NewUserPage() {
  return (
    <>
      <PageHeader title="Add user" description="Create an admin panel account." />
      <UserForm />
    </>
  );
}
