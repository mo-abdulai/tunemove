import Link from "next/link";
import { History } from "lucide-react";

export function EmptyActivityCard() {
  return (
    <section className="rounded-2xl border border-surface-border/80 bg-surface/80 p-6 shadow-sm shadow-base/25 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-copy-secondary/40 hover:shadow-md hover:shadow-base/35">
      <div className="flex min-h-36 flex-col items-center justify-center text-center">
        <div className="inline-flex rounded-full border border-surface-border/70 bg-elevated/70 p-1.5">
          <div
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface-border/70 bg-base/40 text-copy-muted"
            aria-hidden="true"
          >
            <History className="h-5 w-5" />
          </div>
        </div>
        <h2 className="mt-4 text-base font-semibold tracking-tight text-copy-primary">
          No transfers yet
        </h2>
        <p className="mt-1.5 max-w-sm text-sm text-copy-secondary">
          Your completed playlist transfers will appear here.
        </p>
        <Link
          href="/dashboard/transfer"
          className="mt-4 inline-flex items-center rounded-xl border border-surface-border/80 bg-elevated/80 px-3 py-1.5 text-xs font-medium text-copy-secondary transition-all duration-200 hover:border-copy-secondary/40 hover:bg-elevated hover:text-copy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        >
          Start your first transfer
        </Link>
      </div>
    </section>
  );
}
