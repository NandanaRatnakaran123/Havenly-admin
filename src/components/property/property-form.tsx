"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  amenityOptions,
  categoryLabels,
  cities,
  furnishingLabels,
  keralaDistricts,
  listingTypeLabels,
  possessionOptions,
  posterRoleLabels,
} from "@/config/options";
import { propertySchema, type PropertyFormValues } from "@/lib/validations";
import { queryKeys } from "@/lib/query-keys";
import { propertiesApi } from "@/lib/resources";
import { formatPrice, pricePerSqft, propertyRef } from "@/lib/utils";
import type { Property } from "@/types";

const emptyValues: PropertyFormValues = {
  title: "",
  description: "",
  type: "sale",
  category: "apartment",
  price: undefined as unknown as number,
  bedrooms: 2,
  bathrooms: 2,
  areaSqft: undefined as unknown as number,
  address: "",
  locality: "",
  city: "",
  district: "",
  image: "",
  furnishing: "",
  possession: "Ready to move",
  amenities: [],
  posterName: "",
  posterRole: "owner",
  status: "draft",
  featured: false,
  verified: false,
};

function toFormValues(p: Property): PropertyFormValues {
  return {
    ...emptyValues,
    ...p,
    district: p.district ?? "",
    image: p.image ?? "",
    furnishing: p.furnishing ?? "",
  };
}

/** Create (no id) or edit (id) a property. Loads the record first when editing. */
export function PropertyForm({ id }: { id?: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.detail("properties", id ?? ""),
    queryFn: () => propertiesApi.get(id!),
    enabled: Boolean(id),
  });

  if (id && isLoading) return <Skeleton className="h-96 w-full" />;
  if (id && (isError || !data)) {
    return <p className="text-sm text-red-600">Could not load this property.</p>;
  }

  return <PropertyFormInner existing={data} />;
}

function PropertyFormInner({ existing }: { existing?: Property }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: existing ? toFormValues(existing) : emptyValues,
  });

  const [type, category, price, area] = useWatch({
    control,
    name: ["type", "category", "price", "areaSqft"],
  });
  const hasRooms = category !== "plot";

  const save = useMutation({
    mutationFn: (values: PropertyFormValues) => {
      const payload = {
        ...values,
        district: values.district || undefined,
        image: values.image || undefined,
        furnishing: values.furnishing || undefined,
      };
      return existing
        ? propertiesApi.update(existing.id, payload)
        : propertiesApi.create({ ...payload, createdAt: new Date().toISOString().slice(0, 10) });
    },
    onSuccess: () => {
      toast.success(existing ? "Property updated" : "Property added");
      void queryClient.invalidateQueries({ queryKey: queryKeys.all("properties") });
      router.push("/properties");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const err = (name: keyof PropertyFormValues) => errors[name]?.message as string | undefined;

  return (
    <form onSubmit={handleSubmit((v) => save.mutate(v))} className="space-y-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
          {existing && (
            <p className="mt-1 text-xs text-slate-500">Property ID: {propertyRef(existing.id)}</p>
          )}
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title" error={err("title")} className="sm:col-span-2">
            <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
          </FormField>
          <FormField label="Listing for" htmlFor="type">
            <Select id="type" {...register("type")}>
              {Object.entries(listingTypeLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Property type" htmlFor="category">
            <Select id="category" {...register("category")}>
              {Object.entries(categoryLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            label={type === "rent" ? "Monthly rent (₹)" : "Price (₹)"}
            htmlFor="price"
            error={err("price")}
            hint={
              price && area
                ? `${formatPrice(price)}${type === "rent" ? " /mo" : ` · ${pricePerSqft(price, area)}`}`
                : undefined
            }
          >
            <Input
              id="price"
              type="number"
              min={0}
              aria-invalid={!!errors.price}
              {...register("price", { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Area (sq.ft)" htmlFor="areaSqft" error={err("areaSqft")}>
            <Input
              id="areaSqft"
              type="number"
              min={0}
              aria-invalid={!!errors.areaSqft}
              {...register("areaSqft", { valueAsNumber: true })}
            />
          </FormField>
          {hasRooms && (
            <>
              <FormField label="Bedrooms" htmlFor="bedrooms" error={err("bedrooms")}>
                <Input
                  id="bedrooms"
                  type="number"
                  min={0}
                  {...register("bedrooms", { valueAsNumber: true })}
                />
              </FormField>
              <FormField label="Bathrooms" htmlFor="bathrooms" error={err("bathrooms")}>
                <Input
                  id="bathrooms"
                  type="number"
                  min={0}
                  {...register("bathrooms", { valueAsNumber: true })}
                />
              </FormField>
            </>
          )}
          <FormField label="Furnishing" htmlFor="furnishing">
            <Select id="furnishing" {...register("furnishing")}>
              <option value="">Not applicable</option>
              {Object.entries(furnishingLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            label="Possession"
            htmlFor="possession"
            error={err("possession")}
            hint="Pick a suggestion or type a date, e.g. Dec 2027."
          >
            <Input id="possession" list="possession-options" {...register("possession")} />
            <datalist id="possession-options">
              {possessionOptions.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </FormField>
          <FormField
            label="Description"
            htmlFor="description"
            error={err("description")}
            className="sm:col-span-2"
          >
            <Textarea
              id="description"
              rows={5}
              aria-invalid={!!errors.description}
              {...register("description")}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Address"
            htmlFor="address"
            error={err("address")}
            className="sm:col-span-2"
          >
            <Input id="address" aria-invalid={!!errors.address} {...register("address")} />
          </FormField>
          <FormField label="Locality / project" htmlFor="locality" error={err("locality")}>
            <Input id="locality" aria-invalid={!!errors.locality} {...register("locality")} />
          </FormField>
          <FormField label="City" htmlFor="city" error={err("city")}>
            <Select id="city" aria-invalid={!!errors.city} {...register("city")}>
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Kerala district" htmlFor="district" hint="Only for Kerala listings.">
            <Select id="district" {...register("district")}>
              <option value="">Not applicable</option>
              {keralaDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            label="Image URL"
            htmlFor="image"
            error={err("image")}
            hint="Leave empty to use the category picture."
          >
            <Input id="image" type="url" placeholder="https://..." {...register("image")} />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="amenities"
            render={({ field }) => (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {amenityOptions.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-emerald-600"
                      checked={field.value.includes(a)}
                      onChange={(e) =>
                        field.onChange(
                          e.target.checked
                            ? [...field.value, a]
                            : field.value.filter((x) => x !== a),
                        )
                      }
                    />
                    {a}
                  </label>
                ))}
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advertiser</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor="posterName" error={err("posterName")}>
            <Input id="posterName" aria-invalid={!!errors.posterName} {...register("posterName")} />
          </FormField>
          <FormField label="Advertiser type" htmlFor="posterRole">
            <Select id="posterRole" {...register("posterRole")}>
              {Object.entries(posterRoleLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Status"
            htmlFor="status"
            hint="Only published listings appear on the site."
          >
            <Select id="status" {...register("status")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </FormField>
          <div className="space-y-2 pt-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 accent-emerald-600"
                {...register("featured")}
              />
              Featured (shown in &ldquo;Featured properties&rdquo;)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 accent-emerald-600"
                {...register("verified")}
              />
              Verified by Havenly
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Link
          href="/properties"
          className="inline-flex h-10 items-center rounded-md border border-slate-300 px-4 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving..." : existing ? "Save changes" : "Add property"}
        </Button>
      </div>
    </form>
  );
}
