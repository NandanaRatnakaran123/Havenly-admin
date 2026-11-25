import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PlansView } from "@/components/plans/plans-view";

export const metadata: Metadata = { title: "Plans" };

export default function PlansPage() {
  return (
    <>
      <PageHeader
        title="Plans"
        description="Premium plans for owners, agents and builders. Taking a plan records a payment."
      />
      <PlansView />
    </>
  );
}
