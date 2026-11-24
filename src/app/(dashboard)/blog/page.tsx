import type { Metadata } from "next";
import { Suspense } from "react";
import { AddLink } from "@/components/shared/add-link";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogTable } from "@/components/tables/blog-table";

export const metadata: Metadata = { title: "Guides" };

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="Property guides"
        description="Articles shown on /blog."
        actions={<AddLink href="/blog/new" label="Add guide" />}
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <BlogTable />
      </Suspense>
    </>
  );
}
