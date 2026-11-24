import type { ListParams } from "@/lib/resource";

export const queryKeys = {
  all: (resource: string) => [resource] as const,
  list: (resource: string, params: ListParams) => [resource, "list", params] as const,
  detail: (resource: string, id: string) => [resource, "detail", id] as const,
};
