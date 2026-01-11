import { api } from "@/lib/api";
import { User, AuditLog } from "@/lib/mock-data";

export interface SystemSettings {
  siteName: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  email: string;
}

export interface AdminMetrics {
  totalUsers: number;
  activeDeclarations: number;
  complianceRate: number;
  securityIncidents: number;
}

export const adminService = {
  // --- User Management ---
  getUsers: async (): Promise<User[]> => {
    return api.get<User[]>('/api/admin/users');
  },

  createUser: async (user: Partial<User>): Promise<User> => {
    return api.post<User>('/api/admin/users', user);
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<void> => {
    return api.patch(`/api/admin/users/${id}`, updates);
  },

  // --- Metrics & Audit ---
  getMetrics: async (): Promise<AdminMetrics> => {
    return api.get<AdminMetrics>('/api/admin/metrics');
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    return api.get<AuditLog[]>('/api/admin/audit-logs');
  },

  // --- System Settings ---
  getSettings: async (): Promise<SystemSettings> => {
    return api.get<SystemSettings>('/api/admin/settings');
  },

  saveSettings: async (settings: SystemSettings): Promise<void> => {
    return api.post('/api/admin/settings', settings);
  },

  // --- Reports ---
  getReports: async (): Promise<any[]> => {
    return api.get<any[]>('/api/ads-admin/reports');
  }
};
