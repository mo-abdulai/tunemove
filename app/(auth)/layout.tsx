import Link from "next/link";

const authFeatureList = [
  "Secure sign in and account management with Clerk.",
  "Connect your music services from one dashboard.",
  "Transfer playlists without rebuilding your library.",
];

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-base text-copy-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl">
        <aside className="hidden w-1/2 flex-col justify-between border-r border-surface-border px-12 py-14 lg:flex">
          <div className="space-y-8">
            <Link
              href="/"
              className="inline-flex text-lg font-semibold tracking-tight text-copy-primary"
            >
              TuneMove
            </Link>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-copy-muted">
                Playlist Transfer
              </p>
              <h1 className="max-w-md text-3xl font-semibold tracking-tight text-copy-primary">
                Move your playlists between platforms with less friction.
              </h1>
              <p className="max-w-md text-sm text-copy-secondary">
                Sign in to start connecting accounts and managing transfers.
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-copy-secondary">
            {authFeatureList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>

        <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:px-14">
          {children}
        </section>
      </div>
    </div>
  );
}
