"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
}

/** Modal confirmation built on the native <dialog> element (focus trap + Esc for free). */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  pending,
  onConfirm,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={() => onOpenChange(false)}
      className="m-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-black/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="space-y-2 p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
        <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={pending}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={pending}>
          {pending ? "Working..." : confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
