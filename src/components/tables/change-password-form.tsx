"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { api } from "@/lib/api";
import { USE_MOCKS } from "@/lib/resource";
import { changePasswordSchema, type ChangePasswordValues } from "@/lib/validations";

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const save = useMutation({
    mutationFn: async (v: ChangePasswordValues) => {
      if (USE_MOCKS) return; // no backend yet
      await api<void>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: v.currentPassword,
          newPassword: v.newPassword,
        }),
      });
    },
    onSuccess: () => {
      if (USE_MOCKS) {
        toast.info("Demo mode: password not saved. The dev login comes from .env.local.");
      } else {
        toast.success("Password changed");
      }
      reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form onSubmit={handleSubmit((v) => save.mutate(v))} noValidate>
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <h2 className="text-base font-semibold">Change password</h2>
            <p className="text-sm text-slate-500">Update the password you use to sign in.</p>
          </div>
          <FormField
            label="Current password"
            htmlFor="currentPassword"
            error={errors.currentPassword?.message}
            className="sm:col-span-2"
          >
            <PasswordInput
              id="currentPassword"
              autoComplete="current-password"
              {...register("currentPassword")}
            />
          </FormField>
          <FormField
            label="New password"
            htmlFor="newPassword"
            error={errors.newPassword?.message}
            hint="At least 8 characters."
          >
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              {...register("newPassword")}
            />
          </FormField>
          <FormField
            label="Confirm new password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
          </FormField>
          <div className="flex justify-end sm:col-span-2">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Updating..." : "Update password"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
