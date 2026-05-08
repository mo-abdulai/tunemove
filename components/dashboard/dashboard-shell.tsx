"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const TITLES_BY_ROUTE: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/transfer": "Transfer",
  "/dashboard/playlists": "Playlists",
  "/dashboard/history": "History",
  "/dashboard/connections": "Connections",
  "/dashboard/settings": "Settings",
};

type DashboardShellProps = {
  children: React.ReactNode;
};

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateViewportState = () => setIsDesktopViewport(mediaQuery.matches);

    updateViewportState();
    mediaQuery.addEventListener("change", updateViewportState);

    return () => mediaQuery.removeEventListener("change", updateViewportState);
  }, []);

  const title = useMemo(() => {
    const normalizedPathname = normalizePathname(pathname);

    return TITLES_BY_ROUTE[normalizedPathname];
  }, [pathname]);

  const isSidebarOpen = isDesktopViewport
    ? isDesktopSidebarOpen
    : isMobileSidebarOpen;

  function handleToggleSidebar() {
    if (isDesktopViewport) {
      setIsDesktopSidebarOpen((prev) => !prev);
      return;
    }

    setIsMobileSidebarOpen((prev) => !prev);
  }

  return (
    <div className="flex h-screen bg-base text-copy-primary">
      <DashboardSidebar
        isMobileOpen={isMobileSidebarOpen}
        isDesktopOpen={isDesktopSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardNavbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          title={title}
        />
        <main className="min-h-0 flex-1 overflow-y-auto bg-base">{children}</main>
      </div>
    </div>
  );
}
