"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export default function SignOutButton() {
  const { state } = useSidebar();

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-center rounded-xl border border-border hover:bg-muted bg-transparent"
      aria-label="Log out"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="mr-2 size-4" />
      {state === "expanded" && <span>Logout</span>}
    </Button>
  );
}
