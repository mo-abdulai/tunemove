import { PageContainer } from "@/components/dashboard/page-container";

export default function TransferPage() {
  return (
    <PageContainer
      title="Transfer"
      description="Start and manage playlist transfers across connected platforms."
    >
      <section className="rounded-2xl border border-surface-border bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight text-copy-primary">
          New Transfer
        </h2>
        <p className="mt-2 text-sm text-copy-secondary">
          Transfer setup UI will be implemented in the next feature unit.
        </p>
      </section>
    </PageContainer>
  );
}
