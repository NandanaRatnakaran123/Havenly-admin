import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertiesView } from "@/components/property/properties-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Properties" };

export default function PropertiesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <PropertiesView />
    </Suspense>
  );
}
