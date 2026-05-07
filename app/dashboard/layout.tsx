import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-base text-copy-primary">
      <header className="border-b border-surface-border bg-base">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-md border border-surface-border bg-surface" />
            <div className="space-y-0.5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-copy-muted">
                TuneMove
              </p>
              <p className="text-sm font-medium text-copy-primary">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <UserButton />
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
