"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Notification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { notificationService } from "@/services/notification.service";
import { useSession } from "@/components/auth/SessionProvider";

export function NotificationBell() {
  const { user } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = () => {
      if (user) {
          notificationService.init();
          const data = notificationService.getUserNotifications(user.id, user.role);
          setNotifications(data);
      }
  };

  // Initial load and polling/refresh
  useEffect(() => {
    fetchNotifications();
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user, isOpen]); // Also refresh when opening

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    if (user) {
        notificationService.markAllAsRead(user.id);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-background rounded-full animate-pulse" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
            <h4 className="font-semibold text-sm">Notifications</h4>
            {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="h-auto px-2 text-xs text-muted-foreground hover:text-primary" onClick={markAllAsRead}>
                    Mark all read
                </Button>
            )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">No notifications</div>
            ) : (
                <div className="divide-y">
                    {notifications.map((notification) => (
                        <div key={notification.id} 
                             className={cn("p-4 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer relative group", !notification.read && "bg-muted/20")}
                             onClick={() => markAsRead(notification.id)}
                        >
                            <div className="mt-1 flex-shrink-0">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className={cn("text-sm font-medium leading-none", !notification.read && "font-semibold")}>
                                    {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground leading-snug">
                                    {notification.message}
                                </p>
                                <p className="text-[10px] text-muted-foreground/70 pt-1">
                                    {new Date(notification.date).toLocaleDateString()}
                                </p>
                            </div>
                            {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
