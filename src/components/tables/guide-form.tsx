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
import { guideCategories } from "@/config/options";
import { queryKeys } from "@/lib/query-keys";
import { blogApi } from "@/lib/resources";
import { slugify } from "@/lib/utils";
import { guideSchema, type GuideFormValues } from "@/lib/validations";
import type { BlogPost } from "@/types";

export function GuideForm({ id }: { id?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.detail("blog", id ?? ""),
    queryFn: () => blogApi.get(id!),
    enabled: Boolean(id),
  });
  if (id && isLoading) return <Skeleton className="h-96 w-full" />;
  if (id && !data) return <p className="text-sm text-red-600">Could not load this guide.</p>;
  return <GuideFormInner existing={data} />;
}

function GuideFormInner({ existing }: { existing?: BlogPost }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<GuideFormValues>({
    resolver: zodResolver(guideSchema),
    defaultValues: {
      title: existing?.title ?? "",
      slug: existing?.slug ?? "",
      excerpt: existing?.excerpt ?? "",
      category: existing?.category ?? guideCategories[0],
      readMins: existing?.readMins ?? 4,
      body: existing?.body ?? "",
      status: existing?.status ?? "draft",
    },
  });

  const save = useMutation({
    mutationFn: (v: GuideFormValues) =>
      existing
        ? blogApi.update(existing.id, v)
        : blogApi.create({ ...v, createdAt: new Date().toISOString().slice(0, 10) }),
    onSuccess: () => {
      toast.success(existing ? "Guide updated" : "Guide added");
      void queryClient.invalidateQueries({ queryKey: queryKeys.all("blog") });
      router.push("/blog");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form onSubmit={handleSubmit((v) => save.mutate(v))} noValidate>
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Title"
            htmlFor="title"
            error={errors.title?.message}
            className="sm:col-span-2"
          >
            <Input
              id="title"
              {...register("title", {
                onBlur: () => {
                  if (!getValues("slug")) setValue("slug", slugify(getValues("title")));
                },
              })}
            />
          </FormField>
          <FormField
            label="Slug"
            htmlFor="slug"
            error={errors.slug?.message}
            hint="Used as /blog/slug."
          >
            <Input id="slug" {...register("slug")} />
          </FormField>
          <FormField label="Category" htmlFor="category" error={errors.category?.message}>
            <Input id="category" list="guide-categories" {...register("category")} />
            <datalist id="guide-categories">
              {guideCategories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </FormField>
          <FormField
            label="Excerpt"
            htmlFor="excerpt"
            error={errors.excerpt?.message}
            className="sm:col-span-2"
          >
            <Textarea id="excerpt" rows={2} {...register("excerpt")} />
          </FormField>
          <FormField
            label="Body"
            htmlFor="body"
            error={errors.body?.message}
            className="sm:col-span-2"
          >
            <Textarea id="body" rows={10} {...register("body")} />
          </FormField>
          <FormField
            label="Read time (minutes)"
            htmlFor="readMins"
            error={errors.readMins?.message}
          >
            <Input
              id="readMins"
              type="number"
              min={1}
              {...register("readMins", { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Status" htmlFor="status">
            <Select id="status" {...register("status")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </FormField>
          <div className="flex justify-end sm:col-span-2">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving..." : "Save guide"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
