import { api } from "@/lib/api";

export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  /** Filters rows by their `role` field (e.g. user role tabs). */
  role?: string;
  /** Enquiry audience: "buyer", "agent" or "general" (no choice made). */
  iAm?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface ListResult<T> {
  data: T[];
  total: number;
}

export type CreateInput<T> = Omit<T, "id">;
export type UpdateInput<T> = Partial<Omit<T, "id">>;

export interface Resource<T extends { id: string }> {
  list(params?: ListParams): Promise<ListResult<T>>;
  get(id: string): Promise<T>;
  create(input: CreateInput<T>): Promise<T>;
  update(id: string, patch: UpdateInput<T>): Promise<T>;
  remove(id: string): Promise<void>;
}

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

function toQuery(params: ListParams) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") qs.set(key, String(value));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

/** Pure list logic (search, status filter, sort, pagination), shared by the mock store and tests. */
export function applyListParams<T extends { id: string }>(
  rows: T[],
  params: ListParams,
  searchKeys: (keyof T)[],
): ListResult<T> {
  const { page = 1, pageSize = 10, search, status, role, iAm, sort, order = "asc" } = params;
  let result = rows;

  if (status) {
    result = result.filter((r) => (r as Record<string, unknown>).status === status);
  }
  if (role) {
    result = result.filter((r) => (r as Record<string, unknown>).role === role);
  }
  if (iAm) {
    result = result.filter((r) => {
      const value = (r as Record<string, unknown>).iAm;
      return iAm === "general" ? !value : value === iAm;
    });
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((r) =>
      searchKeys.some((k) =>
        String(r[k] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }
  if (sort) {
    const dir = order === "desc" ? -1 : 1;
    result = [...result].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sort];
      const bv = (b as Record<string, unknown>)[sort];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av ?? "").localeCompare(String(bv ?? "")) * dir;
    });
  }

  const total = result.length;
  const start = (page - 1) * pageSize;
  return { data: result.slice(start, start + pageSize), total };
}

/**
 * Builds a CRUD client for one backend collection.
 * With NEXT_PUBLIC_USE_MOCKS != "false" it works on an in-memory copy of `seed`
 * (changes reset on reload); otherwise it calls `${API_URL}${path}`.
 */
export function createResource<T extends { id: string }>(
  path: string,
  seed: T[],
  searchKeys: (keyof T)[],
): Resource<T> {
  if (!USE_MOCKS) {
    return {
      list: (params = {}) => api<ListResult<T>>(`${path}${toQuery(params)}`),
      get: (id) => api<T>(`${path}/${id}`),
      create: (input) => api<T>(path, { method: "POST", body: JSON.stringify(input) }),
      update: (id, patch) =>
        api<T>(`${path}/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
      remove: (id) => api<void>(`${path}/${id}`, { method: "DELETE" }),
    };
  }

  let rows: T[] = seed.map((r) => ({ ...r }));
  let nextId = Math.max(0, ...seed.map((r) => Number(r.id) || 0)) + 1;

  return {
    async list(params = {}) {
      await delay();
      return applyListParams(rows, params, searchKeys);
    },
    async get(id) {
      await delay();
      const row = rows.find((r) => r.id === id);
      if (!row) throw new Error("Not found");
      return { ...row };
    },
    async create(input) {
      await delay();
      const row = { ...input, id: String(nextId++) } as T;
      rows = [row, ...rows];
      return row;
    },
    async update(id, patch) {
      await delay();
      const index = rows.findIndex((r) => r.id === id);
      if (index === -1) throw new Error("Not found");
      rows[index] = { ...rows[index], ...patch };
      return { ...rows[index] };
    },
    async remove(id) {
      await delay();
      rows = rows.filter((r) => r.id !== id);
    },
  };
}
