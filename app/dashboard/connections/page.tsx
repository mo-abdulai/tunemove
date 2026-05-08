import { PageContainer } from "@/components/dashboard/page-container";

export default function ConnectionsPage() {
  return (
    <PageContainer
      title="Connections"
      description="Manage your linked music platform accounts and token status."
    >
      <section className="rounded-2xl border border-surface-border bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight text-copy-primary">
          Platform Connections
        </h2>
        <p className="mt-2 text-sm text-copy-secondary">
          Spotify and Apple Music account connection states will be shown here.
        </p>
      </section>
    </PageContainer>
  );
}
