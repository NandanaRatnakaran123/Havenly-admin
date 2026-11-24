import type { Metadata } from "next";
import { Overview } from "@/components/dashboard/overview";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  return (
    <>
      <PageHeader title="Overview" description="What needs attention across Havenly." />
      <Overview />
    </>
  );
}
