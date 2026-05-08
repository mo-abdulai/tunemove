"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cable,
  History as HistoryIcon,
  LayoutDashboard,
  ListMusic,
  PanelLeftClose,
  Plus,
  Repeat,
  Settings as SettingsIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  isMobileOpen: boolean;
  isDesktopOpen: boolean;
  onCloseMobile: () => void;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/transfer", label: "Transfer", icon: Repeat },
  { href: "/dashboard/playlists", label: "Playlists", icon: ListMusic },
  { href: "/dashboard/history", label: "History", icon: HistoryIcon },
  { href: "/dashboard/connections", label: "Connections", icon: Cable },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

function isRouteActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({
  isMobileOpen,
  isDesktopOpen,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-base/70 transition-opacity lg:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col border-r border-surface-border bg-surface transition-all duration-300 ease-out lg:max-w-none lg:transition-[width,transform,border-color]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          isDesktopOpen
            ? "lg:static lg:z-0 lg:w-72 lg:translate-x-0 lg:pointer-events-auto"
            : "lg:static lg:z-0 lg:w-0 lg:translate-x-0 lg:overflow-hidden lg:border-r-0 lg:pointer-events-none",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-surface-border px-4">
          <p className="text-lg font-semibold tracking-tight text-copy-primary">
            TuneMove
          </p>
          <button
            type="button"
            onClick={onCloseMobile}
            className="group/sidebar-close inline-flex h-9 w-9 items-center justify-center rounded-md border border-surface-border bg-elevated text-copy-secondary transition-colors hover:text-copy-primary lg:hidden"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="h-4 w-4 transition-transform duration-200 ease-out group-hover/sidebar-close:rotate-90 motion-reduce:transform-none" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-2">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = isRouteActive(pathname, href);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onCloseMobile}
                    className={cn(
                      "group/nav-item flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "border-surface-border bg-elevated text-copy-primary"
                        : "border-transparent text-copy-secondary hover:bg-elevated hover:text-copy-primary",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-transform duration-200 ease-out motion-reduce:transform-none",
                        isActive
                          ? "scale-110 text-brand"
                          : "group-hover/nav-item:translate-x-0.5 group-hover/nav-item:scale-105",
                      )}
                    />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-surface-border p-4">
          <Link
            href="/dashboard/transfer"
            onClick={onCloseMobile}
            className="group/new-transfer inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-copy-primary transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4 transition-transform duration-200 ease-out group-hover/new-transfer:rotate-90 group-hover/new-transfer:scale-110 motion-reduce:transform-none" />
            <span>New Transfer</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
