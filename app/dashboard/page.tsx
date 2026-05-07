import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  await auth.protect();

  return (
    <section className="rounded-2xl border border-surface-border bg-surface p-6">
      <h1 className="text-xl font-semibold tracking-tight text-copy-primary">
        Welcome to TuneMove
      </h1>
      <p className="mt-2 text-sm text-copy-secondary">
        Your account is authenticated. Continue with platform connections and
        playlist transfers from here.
      </p>
    </section>
  );
}
