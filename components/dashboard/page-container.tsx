type PageContainerProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function PageContainer({
  title,
  description,
  children,
}: PageContainerProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-copy-primary">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-copy-secondary">{description}</p>
        ) : null}
      </header>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}
