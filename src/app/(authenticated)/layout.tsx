"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Header } from "@/components/layouts/header";
import { Sidebar } from "@/components/layouts/sidenav";
import { cn } from "@/lib/utils";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar />

      <SidebarInset className={cn("p-3 md:p-4")}>
        <div
          className="mb-3 h-2 w-full rounded-2xl bg-primary"
          aria-hidden="true"
        />
        <Header />
        <main
          role="main"
          className="min-h-[60vh] rounded-2xl bg-card p-4 shadow-sm md:p-6"
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
