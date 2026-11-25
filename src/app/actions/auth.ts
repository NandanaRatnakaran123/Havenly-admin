"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isUserRole } from "@/config/access";
import { AUTH_COOKIE_NAME, ROLE_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth-constants";
import { loginSchema } from "@/lib/validations";
import type { UserRole } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export interface LoginState {
  error?: string;
}

/** Only allow same-app relative paths, to prevent open redirects. */
function safeNext(next: string | null | undefined) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

interface Session {
  token: string;
  role: UserRole;
}

async function backendLogin(email: string, password: string): Promise<Session | null> {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { token?: string; role?: string };
    if (!body.token) return null;
    return { token: body.token, role: isUserRole(body.role) ? body.role : "buyer" };
  } catch {
    return null; // backend unreachable
  }
}

/** Local development accounts from .env.local. Never active in production. */
function devLogin(email: string, password: string): Session | null {
  if (process.env.NODE_ENV === "production") return null;
  const accounts: { email?: string; password?: string; role: UserRole }[] = [
    { email: process.env.ADMIN_DEV_EMAIL, password: process.env.ADMIN_DEV_PASSWORD, role: "admin" },
    {
      email: process.env.STAFF_DEV_EMAIL,
      password: process.env.STAFF_DEV_PASSWORD,
      role: "staff",
    },
  ];
  const match = accounts.find(
    (a) => a.email && a.password && a.email === email && a.password === password,
  );
  return match ? { token: `dev-session:${match.role}`, role: match.role } : null;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const { email, password } = parsed.data;
  const session = (await backendLogin(email, password)) ?? devLogin(email, password);
  if (!session) return { error: "Invalid email or password." };

  const jar = await cookies();
  const base = {
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
  jar.set(AUTH_COOKIE_NAME, session.token, { ...base, httpOnly: true });
  // Role is readable by the browser so the sidebar can hide sections. Not a security control.
  jar.set(ROLE_COOKIE_NAME, session.role, { ...base, httpOnly: false });

  redirect(safeNext(formData.get("next")?.toString()));
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE_NAME);
  jar.delete(ROLE_COOKIE_NAME);
  redirect("/login");
}
