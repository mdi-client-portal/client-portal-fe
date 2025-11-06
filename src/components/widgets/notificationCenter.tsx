"use client";

import { useState, useMemo } from "react";
import { Bell, X } from "lucide-react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcherWithAuth } from "@/lib/fetcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface APINotification {
  NotificationID: number;
  ClientID: string;
  Message: string;
  Read: boolean;
  CreatedAt: string;
}

interface NotificationResponse {
  code: number;
  message: string;
  data: APINotification[];
  timestamp: string;
}

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  notificationId: number;
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600)
    return `${Math.floor(seconds / 60)} minute${
      Math.floor(seconds / 60) > 1 ? "s" : ""
    } ago`;
  if (seconds < 86400)
    return `${Math.floor(seconds / 3600)} hour${
      Math.floor(seconds / 3600) > 1 ? "s" : ""
    } ago`;
  if (seconds < 2592000)
    return `${Math.floor(seconds / 86400)} day${
      Math.floor(seconds / 86400) > 1 ? "s" : ""
    } ago`;
  if (seconds < 31536000)
    return `${Math.floor(seconds / 2592000)} month${
      Math.floor(seconds / 2592000) > 1 ? "s" : ""
    } ago`;
  return `${Math.floor(seconds / 31536000)} year${
    Math.floor(seconds / 31536000) > 1 ? "s" : ""
  } ago`;
}

export function NotificationCenter() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const jwtToken = session?.user?.token || null;

  const { data, error, isLoading, mutate } = useSWR<NotificationResponse>(
    jwtToken ? `${process.env.NEXT_PUBLIC_API_URL}/api/notifications` : null,
    (url: string) =>
      fetcherWithAuth<NotificationResponse>(url, jwtToken || undefined),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const notifications: Notification[] = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((notif: APINotification) => ({
      id: notif.NotificationID.toString(),
      message: notif.Message,
      timestamp: new Date(notif.CreatedAt),
      read: notif.Read,
      notificationId: notif.NotificationID,
    }));
  }, [data]);

  const isMobile = useIsMobile();

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const handleMarkAllAsRead = async () => {
    try {
      await fetcherWithAuth<{ code: number; message: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/mark-as-read`,
        jwtToken || undefined,
        {
          method: "PUT",
        }
      );
      // Revalidate data after marking as read
      mutate();
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const notificationContent = (
    <div className="space-y-2">
      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Loading notifications...
          </p>
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-sm text-red-500">Failed to load notifications</p>
        </div>
      ) : notifications.length > 0 ? (
        <>
          <div className="max-h-[400px] space-y-2 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-3 transition-colors ${
                  notification.read
                    ? "border-muted bg-muted/30"
                    : "border-primary/20 bg-primary/5"
                }`}
              >
                <p className="text-sm font-medium text-foreground">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getTimeAgo(notification.timestamp)}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={handleMarkAllAsRead}
            className="w-full rounded-lg border border-primary/20 py-2 text-center text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            Mark as read all
          </button>
        </>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No notifications</p>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="relative rounded-xl hover:bg-muted transition-colors p-2"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="w-full sm:w-96">
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <div className="mt-4">{notificationContent}</div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl hover:bg-muted transition-colors p-2"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border bg-card p-4 shadow-lg">
          {notificationContent}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
