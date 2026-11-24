"use client";

import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initial: LoginState = {};

export function LoginForm() {
  const next = useSearchParams().get("next") ?? "/";
  const [state, action, pending] = useActionState(loginAction, initial);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <FormField label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="username" required />
      </FormField>
      <FormField label="Password" htmlFor="password">
        <div className="group relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="pr-10"
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // keep focus in the field while toggling
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 hover:text-emerald-600 focus-visible:text-emerald-600 focus-visible:outline-none dark:text-slate-400"
          >
            {showPassword ?  (
              <Eye className="h-4 w-4" aria-hidden />
            ) : (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) }
          </button>
        </div>
      </FormField>
      {state.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
