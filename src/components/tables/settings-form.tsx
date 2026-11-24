"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { settingsApi } from "@/lib/settings";
import { settingsSchema, type SettingsFormValues } from "@/lib/validations";

export function SettingsForm() {
  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get(),
  });
  if (isLoading || !data) return <Skeleton className="h-72 w-full" />;
  return <SettingsFormInner initial={data} />;
}

function SettingsFormInner({ initial }: { initial: SettingsFormValues }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initial,
  });

  const save = useMutation({
    mutationFn: (v: SettingsFormValues) => settingsApi.save(v),
    onSuccess: () => {
      toast.success("Settings saved");
      void queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form onSubmit={handleSubmit((v) => save.mutate(v))} noValidate>
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Site name" htmlFor="siteName" error={errors.siteName?.message}>
            <Input id="siteName" {...register("siteName")} />
          </FormField>
          <FormField
            label="Support email"
            htmlFor="supportEmail"
            error={errors.supportEmail?.message}
          >
            <Input id="supportEmail" type="email" {...register("supportEmail")} />
          </FormField>
          <FormField
            label="Support phone"
            htmlFor="supportPhone"
            error={errors.supportPhone?.message}
          >
            <Input id="supportPhone" {...register("supportPhone")} />
          </FormField>
          <FormField
            label="WhatsApp number"
            htmlFor="whatsappNumber"
            error={errors.whatsappNumber?.message}
            hint="Digits with country code. Shows the “Chat on WhatsApp” button on listings; leave empty to hide."
          >
            <Input id="whatsappNumber" inputMode="numeric" {...register("whatsappNumber")} />
          </FormField>
          <div className="flex justify-end sm:col-span-2">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving..." : "Save settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
