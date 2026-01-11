"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { User } from "@/lib/mock-data";

export default function PublicDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Simulating logged-in public user 'u4'
  const userId = "u4";

  useEffect(() => {
    fetch(`/api/admin/users/${userId}`)
        .then(res => res.json())
        .then(data => {
            setUser(data);
            setLoading(false);
        })
        .catch(err => setLoading(false));
  }, []);

  if (loading) {
      return <div className="flex items-center justify-center p-8 text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile...</div>;
  }

  if (!user) return <div className="p-8">Unable to load profile.</div>;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">Manage your citizen profile and inquiries.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Account Status</CardTitle>
                <CardDescription>Your current standing</CardDescription>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                    {user.status}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    {user.lastLogin ? `Last login: ${user.lastLogin}` : "Verified Citizen"}
                </p>
            </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-2 bg-primary/5 border-primary/10">
             <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
                <CardDescription>Contact our support team for assistance.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <p className="text-sm max-w-md">
                    If you are having trouble with your account or need information about asset declarations, please submit an inquiry.
                </p>
                <Button asChild>
                    <Link href="/dashboard/public/inquiries">
                        Submit Inquiry
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-2 bg-secondary rounded-full">
                        <UserCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-base">My Profile</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
             <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-2 bg-secondary rounded-full">
                        <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-base">My Inquiries</CardTitle>
                        <CardDescription>View past questions and answers</CardDescription>
                    </div>
                </CardHeader>
            </Card>
       </div>
    </div>
  );
}
