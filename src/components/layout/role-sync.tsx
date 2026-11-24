"use client";

import { useEffect } from "react";
import { isUserRole } from "@/config/access";
import { ROLE_COOKIE_NAME } from "@/lib/auth-constants";
import { useUi } from "@/store/ui";

/** Copies the role cookie into the UI store so the sidebar can hide sections the role can't open. */
export function RoleSync() {
  const setRole = useUi((s) => s.setRole);

  useEffect(() => {
    const value = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${ROLE_COOKIE_NAME}=`))
      ?.split("=")[1];
    if (isUserRole(value)) setRole(value);
  }, [setRole]);

  return null;
}
