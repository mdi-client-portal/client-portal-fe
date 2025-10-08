"use client";

import type React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, Users, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import SignOutButton from "@/components/common/buttons/signout";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "invoices", href: "/invoices", icon: Users },
  { label: "payments", href: "/payments", icon: Settings },
];

function Logo() {
  const { state } = useSidebar();
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-card p-3 shadow-sm">
      <Image
        src="/logo-default.png"
        alt="Company Logo"
        width={28}
        height={28}
        className="rounded-lg"
      />
      {state === "expanded" && (
        <span className="font-semibold text-sm tracking-tight">
          Mobile Data Indonesia
        </span>
      )}
    </div>
  );
}

function MainNav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2">Main</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "rounded-2xl transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="shrink-0" />
                    {state === "expanded" && <span>{item.label}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ProfileSection() {
  const { state } = useSidebar();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="rounded-2xl bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback>...</AvatarFallback>
          </Avatar>
          {state === "expanded" && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Loading...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
          <AvatarFallback>
            {session?.user?.name
              ? session.user.name.charAt(0).toUpperCase()
              : "U"}
          </AvatarFallback>
        </Avatar>
        {state === "expanded" && session?.user && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {session.user.name || "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        )}
      </div>
      <div className="mt-3">
        <SignOutButton />
      </div>
    </div>
  );
}

export function Sidebar({ children }: { children?: React.ReactNode }) {
  return (
    <ShadcnSidebar className="data-[slot=sidebar-container]:!md:flex">
      <SidebarHeader className="p-3">
        <Logo />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <MainNav />
      </SidebarContent>

      <SidebarFooter className="p-3">
        <ProfileSection />
      </SidebarFooter>
    </ShadcnSidebar>
  );
}

export function SidebarWithProvider() {
  return (
    <SidebarProvider>
      <Sidebar />
    </SidebarProvider>
  );
}
