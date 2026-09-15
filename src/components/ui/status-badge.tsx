import { CircleCheck } from "lucide-react";

type StatusBadgeProps = {
  children: string;
};

export function StatusBadge({ children }: StatusBadgeProps) {
  return (
    <span className="border-terracotta/20 bg-terracotta/8 text-terracotta inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase">
      <CircleCheck aria-hidden="true" className="size-3.5" strokeWidth={2} />
      {children}
    </span>
  );
}
