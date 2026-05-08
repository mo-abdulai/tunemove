import { PageContainer } from "@/components/dashboard/page-container";

export default function HistoryPage() {
  return (
    <PageContainer
      title="History"
      description="Review completed and in-progress playlist transfer runs."
    >
      <section className="rounded-2xl border border-surface-border bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight text-copy-primary">
          Transfer History
        </h2>
        <p className="mt-2 text-sm text-copy-secondary">
          Historical transfer logs and outcomes will be listed here.
        </p>
      </section>
    </PageContainer>
  );
}
