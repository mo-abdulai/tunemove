import { cn } from "@/lib/utils";

type PageContainerProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidthClassName?: string;
  contentClassName?: string;
};

export function PageContainer({
  title,
  description,
  children,
  maxWidthClassName = "max-w-6xl",
  contentClassName,
}: PageContainerProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full px-4 py-6 sm:px-6 lg:px-8",
        maxWidthClassName,
      )}
    >
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-copy-primary">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-copy-secondary">{description}</p>
        ) : null}
      </header>
      <div className={cn("mt-6 space-y-6", contentClassName)}>{children}</div>
    </section>
  );
}
