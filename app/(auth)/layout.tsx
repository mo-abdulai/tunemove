import Link from "next/link";
import styles from "./auth-layout.module.css";

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
    <div className={styles.shell}>
      <div className={styles.split}>
        <aside className={styles.marketingPane}>
          <div className={styles.marketingInner}>
            <div className={styles.heroBlock}>
              <Link href="/" className={styles.brand}>
                TuneMove
              </Link>
              <div className={styles.intro}>
                <p className={styles.eyebrow}>Playlist Transfer</p>
                <h1 className={styles.headline}>
                  Move your playlists between platforms with less friction.
                </h1>
                <p className={styles.supporting}>
                  Sign in to start connecting accounts and managing transfers.
                </p>
              </div>
            </div>
            <ul className={styles.featureList}>
              {authFeatureList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>

        <section className={styles.formPane}>
          {children}
        </section>
      </div>
    </div>
  );
}
