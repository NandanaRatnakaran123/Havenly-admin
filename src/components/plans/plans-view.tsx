"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, Crown } from "lucide-react";
import { useState } from "react";
import { PlanCheckoutDialog } from "@/components/plans/plan-checkout-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { plans, type Plan } from "@/config/plans";
import { queryKeys } from "@/lib/query-keys";
import { paymentsApi } from "@/lib/resources";
import { cn, formatDate, formatPrice } from "@/lib/utils";

const recentParams = { search: "Plan:", sort: "createdAt", order: "desc", pageSize: 5 } as const;

export function PlansView() {
  const [selected, setSelected] = useState<Plan | null>(null);
  const recent = useQuery({
    queryKey: queryKeys.list("payments", recentParams),
    queryFn: () => paymentsApi.list(recentParams),
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "h-full",
              plan.highlighted && "border-emerald-500 dark:border-emerald-500",
            )}
          >
            <CardContent className="flex h-full flex-col gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    {plan.highlighted && <Crown className="h-4 w-4 text-emerald-600" aria-hidden />}
                    {plan.name}
                  </h2>
                  {plan.highlighted && <Badge tone="green">Popular</Badge>}
                </div>
                <p className="text-sm text-slate-500">{plan.tagline}</p>
              </div>
              <p className="text-3xl font-semibold">
                {plan.price === 0 ? "Free" : formatPrice(plan.price)}
                {plan.price > 0 && (
                  <span className="text-sm font-normal text-slate-500"> /month</span>
                )}
              </p>
              <ul className="flex-1 space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.price === 0 ? (
                <Button variant="secondary" disabled>
                  Included for everyone
                </Button>
              ) : (
                <Button onClick={() => setSelected(plan)}>Take {plan.name}</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent plan purchases</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : recent.data?.data.length ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recent.data.data.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.payerName}</p>
                    <p className="truncate text-xs text-slate-500">
                      {p.purpose.replace("Plan: ", "")} · {formatDate(p.createdAt)}
                    </p>
                  </div>
                  <span className="whitespace-nowrap">{formatPrice(p.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No plans taken yet.</p>
          )}
        </CardContent>
      </Card>

      <PlanCheckoutDialog plan={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
