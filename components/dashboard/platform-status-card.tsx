import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type PlatformStatusCardProps = {
  platformName: string;
  status: string;
  actionLabel: string;
  icon: LucideIcon;
  accentTextClassName: string;
  accentSurfaceClassName: string;
  accentBorderClassName: string;
};

export function PlatformStatusCard({
  platformName,
  status,
  actionLabel,
  icon: Icon,
  accentTextClassName,
  accentSurfaceClassName,
  accentBorderClassName,
}: PlatformStatusCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-surface-border/80 bg-surface/80 p-5 shadow-sm shadow-base/30 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-copy-secondary/40 hover:shadow-md hover:shadow-base/40">
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full blur-3xl opacity-50",
          accentSurfaceClassName,
        )}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm shadow-base/30",
              accentSurfaceClassName,
              accentBorderClassName,
              accentTextClassName,
            )}
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-copy-primary">
              {platformName}
            </h3>
            <p className="mt-1 text-xs text-copy-muted">Connection status</p>
          </div>
        </div>
        <div className="rounded-full border border-surface-border/70 bg-elevated/70 p-0.5">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
              accentSurfaceClassName,
              accentBorderClassName,
              accentTextClassName,
            )}
          >
            {status}
          </span>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          className="inline-flex items-center rounded-xl border border-surface-border/80 bg-elevated/80 px-3 py-1.5 text-xs font-medium text-copy-secondary shadow-sm shadow-base/25 transition-all duration-200 hover:border-copy-secondary/40 hover:bg-elevated hover:text-copy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        >
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
