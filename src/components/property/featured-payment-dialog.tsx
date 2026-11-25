"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { FEATURED_LISTING_FEE } from "@/config/options";
import { paymentsApi, propertiesApi } from "@/lib/resources";
import { formatPrice, propertyRef } from "@/lib/utils";
import type { PaymentMethod, Property } from "@/types";

const methods: { value: PaymentMethod; label: string }[] = [
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "netbanking", label: "Net banking" },
  { value: "cash", label: "Cash" },
];

interface FeaturedPaymentDialogProps {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Collects the featured-listing fee, records it as paid, then marks the property featured. */
export function FeaturedPaymentDialog({
  property,
  open,
  onOpenChange,
}: FeaturedPaymentDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const [method, setMethod] = useState<PaymentMethod>("upi");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const pay = useMutation({
    mutationFn: async () => {
      await paymentsApi.create({
        reference: `PAY-${Date.now().toString().slice(-6)}`,
        payerName: property.posterName,
        payerEmail: "",
        purpose: "Featured listing",
        propertyId: property.id,
        amount: FEATURED_LISTING_FEE,
        method,
        status: "paid",
        createdAt: new Date().toISOString().slice(0, 10),
      });
      await propertiesApi.update(property.id, { featured: true });
    },
    onSuccess: () => {
      toast.success("Payment recorded, property is now featured");
      onOpenChange(false);
      void queryClient.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <dialog
      ref={ref}
      onClose={() => onOpenChange(false)}
      className="m-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-black/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="space-y-4 p-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Pay to feature this property</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {property.title} ({propertyRef(property.id)})
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800">
          <span className="text-sm">Featured listing fee</span>
          <span className="text-lg font-semibold">{formatPrice(FEATURED_LISTING_FEE)}</span>
        </div>
        <div className="space-y-1">
          <label htmlFor="featured-method" className="text-sm font-medium">
            Payment method
          </label>
          <Select
            id="featured-method"
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
          >
            {methods.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
        <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={pay.isPending}>
          Cancel
        </Button>
        <Button onClick={() => pay.mutate()} disabled={pay.isPending}>
          {pay.isPending ? "Processing..." : `Pay ${formatPrice(FEATURED_LISTING_FEE)} & feature`}
        </Button>
      </div>
    </dialog>
  );
}
