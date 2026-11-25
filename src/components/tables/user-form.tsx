"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { queryKeys } from "@/lib/query-keys";
import { usersApi } from "@/lib/resources";
import { userSchema, type UserFormValues } from "@/lib/validations";
import type { AdminUser } from "@/types";

/** Add a user, or edit one when an id is given. */
export function UserForm({ id }: { id?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.detail("users", id ?? ""),
    queryFn: () => usersApi.get(id!),
    enabled: Boolean(id),
  });
  if (id && isLoading) return <Skeleton className="h-48 w-full" />;
  if (id && !data) return <p className="text-sm text-red-600">Could not load this user.</p>;
  return <UserFormInner existing={data} />;
}

function UserFormInner({ existing }: { existing?: AdminUser }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: existing?.name ?? "",
      email: existing?.email ?? "",
      role: existing?.role ?? "staff",
      active: existing?.active ?? true,
    },
  });

  const save = useMutation({
    mutationFn: (v: UserFormValues) =>
      existing
        ? usersApi.update(existing.id, v)
        : usersApi.create({ ...v, createdAt: new Date().toISOString().slice(0, 10) }),
    onSuccess: () => {
      toast.success(existing ? "User updated" : "User added");
      void queryClient.invalidateQueries({ queryKey: queryKeys.all("users") });
      router.push("/users");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form onSubmit={handleSubmit((v) => save.mutate(v))} noValidate>
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" {...register("name")} />
          </FormField>
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register("email")} />
          </FormField>
          <FormField label="Role" htmlFor="role" error={errors.role?.message}>
            <Select id="role" {...register("role")}>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="agent">Agent</option>
              <option value="buyer">Buyer</option>
            </Select>
          </FormField>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" className="h-4 w-4" {...register("active")} />
            Active (can sign in)
          </label>
          <div className="flex items-end justify-end sm:col-span-2">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving..." : "Save user"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
