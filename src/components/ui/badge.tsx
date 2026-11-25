import { cn, titleCase } from "@/lib/utils";

const tones: Record<string, string> = {
  green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  red: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  blue: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

/** Status/role value -> colour. Unknown values fall back to slate. */
const statusTone: Record<string, keyof typeof tones> = {
  published: "green",
  approved: "green",
  closed: "slate",
  draft: "slate",
  pending: "amber",
  new: "blue",
  contacted: "amber",
  rejected: "red",
  admin: "red",

  active: "green",
  inactive: "slate",
  blocked: "red",
  staff: "green",
  agent: "blue",
  buyer: "amber",
  paid: "green",
  failed: "red",
  refunded: "slate",
};

export function Badge({
  tone = "slate",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function StatusBadge({ value }: { value: string }) {
  return <Badge tone={statusTone[value] ?? "slate"}>{titleCase(value)}</Badge>;
}
