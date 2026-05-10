import { History } from "lucide-react";

export function EmptyActivityCard() {
  return (
    <section className="rounded-2xl border border-surface-border bg-surface p-6">
      <div className="flex min-h-44 flex-col items-center justify-center text-center">
        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-surface-border bg-elevated text-copy-muted"
          aria-hidden="true"
        >
          <History className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-base font-semibold tracking-tight text-copy-primary">
          No transfers yet
        </h2>
        <p className="mt-2 max-w-sm text-sm text-copy-secondary">
          Your completed playlist transfers will appear here.
        </p>
      </div>
    </section>
  );
}
