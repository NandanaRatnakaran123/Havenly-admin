"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { queryKeys } from "@/lib/query-keys";
import { usersApi } from "@/lib/resources";
import { userSchema, type UserFormValues } from "@/lib/validations";

export function UserForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", role: "editor", active: true },
  });

  const save = useMutation({
    mutationFn: (v: UserFormValues) =>
      usersApi.create({ ...v, createdAt: new Date().toISOString().slice(0, 10) }),
    onSuccess: () => {
      toast.success("User added");
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
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
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
