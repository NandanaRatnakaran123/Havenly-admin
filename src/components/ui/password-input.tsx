"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Password field with an eye button (shown while the field has focus) to reveal the text. */
export function PasswordInput({
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [show, setShow] = useState(false);
  return (
    <div className="group relative">
      <Input {...props} type={show ? "text" : "password"} className={cn("pr-10", className)} />
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()} // keep focus in the field while toggling
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 hover:text-emerald-600 focus-visible:text-emerald-600 focus-visible:outline-none dark:text-slate-400"
      >
        {show ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
      </button>
    </div>
  );
}
