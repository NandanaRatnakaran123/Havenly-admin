"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { queryKeys } from "@/lib/query-keys";
import { servicesApi } from "@/lib/resources";
import { serviceSchema, type ServiceFormValues } from "@/lib/validations";
import type { Service } from "@/types";

export function ServiceForm({ id }: { id?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.detail("services", id ?? ""),
    queryFn: () => servicesApi.get(id!),
    enabled: Boolean(id),
  });
  if (id && isLoading) return <Skeleton className="h-72 w-full" />;
  if (id && !data) return <p className="text-sm text-red-600">Could not load this service.</p>;
  return <ServiceFormInner existing={data} />;
}

function ServiceFormInner({ existing }: { existing?: Service }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: existing?.title ?? "",
      slug: existing?.slug ?? "",
      summary: existing?.summary ?? "",
      points: existing?.points.join("\n") ?? "",
      status: existing?.status ?? "draft",
    },
  });

  const save = useMutation({
    mutationFn: (v: ServiceFormValues) => {
      const payload = {
        title: v.title,
        slug: v.slug,
        summary: v.summary,
        status: v.status,
        points: v.points
          .split("\n")
          .map((p) => p.trim())
          .filter(Boolean),
      };
      return existing
        ? servicesApi.update(existing.id, payload)
        : servicesApi.create({ ...payload, createdAt: new Date().toISOString().slice(0, 10) });
    },
    onSuccess: () => {
      toast.success(existing ? "Service updated" : "Service added");
      void queryClient.invalidateQueries({ queryKey: queryKeys.all("services") });
      router.push("/services");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form onSubmit={handleSubmit((v) => save.mutate(v))} noValidate>
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title" error={errors.title?.message}>
            <Input id="title" {...register("title")} />
          </FormField>
          <FormField
            label="Anchor (slug)"
            htmlFor="slug"
            error={errors.slug?.message}
            hint="Used as /services#slug, e.g. legal."
          >
            <Input id="slug" {...register("slug")} />
          </FormField>
          <FormField
            label="Summary"
            htmlFor="summary"
            error={errors.summary?.message}
            className="sm:col-span-2"
          >
            <Textarea id="summary" rows={3} {...register("summary")} />
          </FormField>
          <FormField
            label="Bullet points"
            htmlFor="points"
            hint="One per line."
            className="sm:col-span-2"
          >
            <Textarea id="points" rows={5} {...register("points")} />
          </FormField>
          <FormField label="Status" htmlFor="status">
            <Select id="status" {...register("status")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </FormField>
          <div className="flex items-end justify-end sm:col-span-2">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving..." : "Save service"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
