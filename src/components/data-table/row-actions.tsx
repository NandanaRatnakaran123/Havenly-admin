"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/query-keys";
import type { Resource, UpdateInput } from "@/lib/resource";

export interface RowAction {
  label: string;
  icon: LucideIcon;
  /** Field changes applied when clicked. */
  patch: Record<string, unknown>;
  /** Hide this action when the row's `status` already equals this (e.g. already approved). */
  hideWhenStatus?: string;
  /** Extra work after the patch succeeds (e.g. create a property from an approved submission). */
  after?: () => Promise<unknown>;
  /** Replaces the default patch-on-click (e.g. open a payment dialog first). */
  onClick?: () => void;
  /** Ask for confirmation first, showing this text. */
  confirm?: string;
}

interface RowActionsProps<T extends { id: string }> {
  resourceKey: string;
  resource: Resource<T>;
  row: T;
  /** Human name used in toasts and the confirm dialog, e.g. "property". */
  entity: string;
  editHref?: string;
  actions?: RowAction[];
  canDelete?: boolean;
}

export function RowActions<T extends { id: string }>({
  resourceKey,
  resource,
  row,
  entity,
  editHref,
  actions = [],
  canDelete = true,
}: RowActionsProps<T>) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<RowAction | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.all(resourceKey) });

  const update = useMutation({
    mutationFn: async ({
      patch,
      after,
    }: {
      patch: Record<string, unknown>;
      after?: RowAction["after"];
    }) => {
      await resource.update(row.id, patch as UpdateInput<T>);
      await after?.();
    },
    onSuccess: () => {
      toast.success(`Updated ${entity}`);
      void queryClient.invalidateQueries(); // after() may have touched other resources
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: () => resource.remove(row.id),
    onSuccess: () => {
      toast.success(`Deleted ${entity}`);
      setConfirmOpen(false);
      void refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="flex items-center justify-end gap-1">
      {actions
        .filter(
          (a) => !a.hideWhenStatus || (row as { status?: string }).status !== a.hideWhenStatus,
        )
        .map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            size="icon"
            title={action.label}
            aria-label={action.label}
            disabled={update.isPending}
            onClick={() =>
              action.onClick
                ? action.onClick()
                : update.mutate({ patch: action.patch, after: action.after })
            }
          >
            <action.icon className="h-4 w-4" />
          </Button>
        ))}
      {editHref && (
        <Link
          href={editHref}
          title={`Edit ${entity}`}
          aria-label={`Edit ${entity}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      )}
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          title={`Delete ${entity}`}
          aria-label={`Delete ${entity}`}
          className="text-red-600 hover:text-red-700"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      <ConfirmDialog
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={pendingAction?.label ?? ""}
        description={pendingAction?.confirm ?? ""}
        confirmLabel={pendingAction?.label}
        pending={update.isPending}
        onConfirm={() => {
          if (!pendingAction) return;
          update.mutate(
            { patch: pendingAction.patch, after: pendingAction.after },
            { onSettled: () => setPendingAction(null) },
          );
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete this ${entity}?`}
        description="This cannot be undone."
        pending={remove.isPending}
        onConfirm={() => remove.mutate()}
      />
    </div>
  );
}
