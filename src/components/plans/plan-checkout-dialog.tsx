"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import type { Plan } from "@/config/plans";
import { paymentsApi } from "@/lib/resources";
import { formatPrice } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

const methods: { value: PaymentMethod; label: string }[] = [
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "netbanking", label: "Net banking" },
  { value: "cash", label: "Cash" },
];

interface PlanCheckoutDialogProps {
  plan: Plan | null;
  onClose: () => void;
}

/** Takes the first month's fee for a plan and records it as a paid payment. */
export function PlanCheckoutDialog({ plan, onClose }: PlanCheckoutDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [error, setError] = useState<string>();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (plan && !dialog.open) dialog.showModal();
    if (!plan && dialog.open) dialog.close();
  }, [plan]);

  const pay = useMutation({
    mutationFn: async () => {
      if (!plan) return;
      await paymentsApi.create({
        reference: `PAY-${Date.now().toString().slice(-6)}`,
        payerName: name.trim(),
        payerEmail: email.trim(),
        purpose: `Plan: ${plan.name}`,
        amount: plan.price,
        method,
        status: "paid",
        createdAt: new Date().toISOString().slice(0, 10),
      });
    },
    onSuccess: () => {
      toast.success(`${plan?.name} plan activated`);
      setName("");
      setEmail("");
      onClose();
      void queryClient.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function submit() {
    if (name.trim().length < 2) return setError("Enter the customer name.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email.");
    setError(undefined);
    pay.mutate();
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-black/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="space-y-4 p-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Take {plan?.name} plan</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Billed monthly. The first month is charged now.
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800">
          <span className="text-sm">{plan?.name} plan</span>
          <span className="text-lg font-semibold">{plan ? formatPrice(plan.price) : ""}/mo</span>
        </div>
        <div className="space-y-1">
          <label htmlFor="plan-name" className="text-sm font-medium">
            Customer name
          </label>
          <Input id="plan-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label htmlFor="plan-email" className="text-sm font-medium">
            Customer email
          </label>
          <Input
            id="plan-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="plan-method" className="text-sm font-medium">
            Payment method
          </label>
          <Select
            id="plan-method"
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
        {error && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
        <Button variant="secondary" onClick={onClose} disabled={pay.isPending}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={pay.isPending}>
          {pay.isPending ? "Processing..." : plan ? `Pay ${formatPrice(plan.price)}` : "Pay"}
        </Button>
      </div>
    </dialog>
  );
}
