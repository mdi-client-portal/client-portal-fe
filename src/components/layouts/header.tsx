"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationCenter } from "@/components/widgets/notificationCenter";

export function Header() {
  return (
    <header
      className="sticky top-0 z-30 mb-4 flex w-full items-center justify-between rounded-2xl bg-card p-2 shadow-sm"
      role="banner"
      aria-label="Top header"
    >
      <div className="flex items-center">
        <SidebarTrigger
          className="rounded-xl hover:bg-muted"
          aria-label="Toggle sidebar"
        />
      </div>

      <div className="flex items-center gap-2">
        <NotificationCenter />
      </div>
    </header>
  );
}
