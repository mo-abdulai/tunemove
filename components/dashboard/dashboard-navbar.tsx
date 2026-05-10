"use client";

import { UserButton } from "@clerk/nextjs";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

type DashboardNavbarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  title?: string;
  subtitle?: string;
};

export function DashboardNavbar({
  isSidebarOpen,
  onToggleSidebar,
  title,
  subtitle,
}: DashboardNavbarProps) {
  const ToggleIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="h-[4.5rem] border-b border-surface-border/90 bg-surface/80 backdrop-blur-xl shadow-sm shadow-base/40">
      <div className="flex h-full items-center gap-4 px-4 sm:px-6">
        <div className="flex w-20 items-center">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-surface-border/80 bg-elevated/80 text-copy-secondary transition-all duration-200 hover:border-copy-secondary/40 hover:bg-elevated hover:text-copy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <ToggleIcon className="h-5 w-5 transition-transform duration-200 ease-out motion-reduce:transform-none" />
          </button>
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          {title ? (
            <div className="max-w-xl text-center">
              <p className="truncate text-sm font-semibold tracking-tight text-copy-primary sm:text-base">
                {title}
              </p>
              {subtitle ? (
                <p className="mt-0.5 truncate text-xs text-copy-muted sm:text-sm">
                  {subtitle}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="flex w-20 justify-end">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
