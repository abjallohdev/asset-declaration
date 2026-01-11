import { Notification, NOTIFICATIONS } from "@/lib/mock-data";

const NOTIFICATION_KEY = "ads_notifications";

export const notificationService = {
  // Initialize with mock data if empty
  init: () => {
    if (typeof window === "undefined") return;
    const existing = localStorage.getItem(NOTIFICATION_KEY);
    if (!existing) {
      localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(NOTIFICATIONS));
    }
  },

  getAll: (): Notification[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(NOTIFICATION_KEY);
    return data ? JSON.parse(data) : [];
  },

  getUserNotifications: (userId: string, role?: string): Notification[] => {
    const all = notificationService.getAll();
    return all.filter(n => {
        // Direct match
        if (n.userId === userId) return true;
        // Role-based broadcast (convention: userId = "ROLE:ADS_ADMIN")
        if (role && n.userId === `ROLE:${role}`) return true;
        return false;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addNotification: (notification: Omit<Notification, "id" | "date" | "read">) => {
    const all = notificationService.getAll();
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      read: false,
    };
    all.unshift(newNotification);
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(all));
    return newNotification;
  },

  markAsRead: (id: string) => {
    const all = notificationService.getAll();
    const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
  },

  markAllAsRead: (userId: string) => {
    const all = notificationService.getAll();
    const updated = all.map(n => (n.userId === userId ? { ...n, read: true } : n));
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
  },
  
  // Helper for components to subscribe/poll (simple version)
  getUnreadCount: (userId: string, role?: string) => {
      return notificationService.getUserNotifications(userId, role).filter(n => !n.read).length;
  }
};
