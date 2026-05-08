import { PageContainer } from "@/components/dashboard/page-container";

export default function SettingsPage() {
  return (
    <PageContainer
      title="Settings"
      description="Configure dashboard preferences and account-level options."
    >
      <section className="rounded-2xl border border-surface-border bg-elevated p-6">
        <h2 className="text-lg font-semibold tracking-tight text-copy-primary">
          Settings
        </h2>
        <p className="mt-2 text-sm text-copy-secondary">
          Personalization and preferences will be configured here.
        </p>
      </section>
    </PageContainer>
  );
}
