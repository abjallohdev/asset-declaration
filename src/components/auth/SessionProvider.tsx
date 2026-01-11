"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, USERS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

interface SessionContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session token in cookies (mock)
    const checkSession = () => {
        // In a real app, we'd verify the token with an API
        const token = document.cookie.split('; ').find(row => row.startsWith('ads_session_token='));
        if (token) {
             // Rehydrate user state - normally this comes from /api/me
             // For mock, we'll try to find a user if stored in localStorage or just persist logic?
             // Simplification: We will just trust the session existence for auth state, 
             // but identifying *which* user requires storage if we don't have an API.
             const storedUser = localStorage.getItem("ads_user_session");
             if(storedUser) {
                 setUser(JSON.parse(storedUser));
             }
        }
        setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, password?: string) => {
    try {
        const response = await authService.login({ email, password });
        const foundUser = response.user || response; // Handle if response is just user (legacy) or {user, token}
        
        // Setup session (Cookie management is mostly server-side or handled by browser for httpOnly)
        // For MSW + Client, we simulate the effect:
        document.cookie = "ads_session_token=valid_mock_token; path=/; max-age=86400; SameSite=Strict; Secure";
        localStorage.setItem("ads_user_session", JSON.stringify(foundUser)); 
        
        setUser(foundUser);
        toast.success("Welcome back", { description: `Signed in as ${foundUser.name}` });
        
        // Redirect logic moved here for centralization
         switch (foundUser.role) {
            case "SUPER_ADMIN":
                router.push("/dashboard/super-admin");
                break;
            case "ADS_ADMIN":
                router.push("/dashboard/ads-admin");
                break;
            case "PUBLIC_OFFICER":
                router.push("/dashboard/officer");
                break;
            case "VERIFIER":
                router.push("/dashboard/verifier");
                break;
            default:
                router.push("/");
        }
    } catch (err) {
        throw err;
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    document.cookie = "ads_session_token=; path=/; max-age=0";
    localStorage.removeItem("ads_user_session");
    setUser(null);
    router.push("/login");
    toast.info("Signed out");
  };

  return (
    <SessionContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
