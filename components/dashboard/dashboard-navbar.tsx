"use client";

import { UserButton } from "@clerk/nextjs";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

type DashboardNavbarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  title?: string;
};

export function DashboardNavbar({
  isSidebarOpen,
  onToggleSidebar,
  title,
}: DashboardNavbarProps) {
  const ToggleIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="h-16 border-b border-surface-border bg-surface">
      <div className="flex h-full items-center gap-4 px-4 sm:px-6">
        <div className="flex w-20 items-center">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-surface-border bg-elevated text-copy-secondary transition-colors hover:text-copy-primary"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <ToggleIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          {title ? (
            <p className="truncate text-sm font-semibold tracking-tight text-copy-primary sm:text-base">
              {title}
            </p>
          ) : null}
        </div>
        <div className="flex w-20 justify-end">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
