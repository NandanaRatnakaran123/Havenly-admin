import type { UserRole } from "@/types";

const all: UserRole[] = ["admin", "staff", "agent", "buyer"];
const staff: UserRole[] = ["admin", "staff"];
/** Roles that can look but not add or edit. */
const readOnly: UserRole[] = ["agent", "buyer"];

/** Which roles may open each top-level section. Used by the sidebar and by proxy.ts. */
export const sectionRoles: Record<string, UserRole[]> = {
  "/": all,
  "/properties": all,
  "/submissions": staff,
  "/requirements": all,
  "/enquiries": all,
  "/services": staff,
  "/plans": staff,
  "/payments": staff,
  "/users": ["admin"],
  "/settings": ["admin"],
};

export function isUserRole(value: string | undefined): value is UserRole {
  return value === "admin" || value === "staff" || value === "agent" || value === "buyer";
}

/** Agents and buyers are read-only: they can't open add/edit pages. */
export function canAccess(pathname: string, role: UserRole) {
  if (readOnly.includes(role) && (pathname.endsWith("/new") || pathname.endsWith("/edit")))
    return false;
  const section = "/" + (pathname.split("/")[1] ?? "");
  const allowed = sectionRoles[section];
  return allowed ? allowed.includes(role) : true;
}
