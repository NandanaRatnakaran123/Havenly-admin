import type { UserRole } from "@/types";

const all: UserRole[] = ["admin", "editor", "viewer"];
const staff: UserRole[] = ["admin", "editor"];

/** Which roles may open each top-level section. Used by the sidebar and by proxy.ts. */
export const sectionRoles: Record<string, UserRole[]> = {
  "/": all,
  "/properties": all,
  "/submissions": staff,
  "/requirements": all,
  "/enquiries": all,
  "/services": staff,
  "/blog": staff,
  "/users": ["admin"],
  "/settings": ["admin"],
};

export function isUserRole(value: string | undefined): value is UserRole {
  return value === "admin" || value === "editor" || value === "viewer";
}

/** Viewers are read-only: they can't open add/edit pages. */
export function canAccess(pathname: string, role: UserRole) {
  if (role === "viewer" && (pathname.endsWith("/new") || pathname.endsWith("/edit"))) return false;
  const section = "/" + (pathname.split("/")[1] ?? "");
  const allowed = sectionRoles[section];
  return allowed ? allowed.includes(role) : true;
}
