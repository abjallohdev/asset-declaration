"use client";

import { useEffect, useState } from "react";
import { Declaration } from "@/lib/mock-data";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, ShieldCheck, FileCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function AdsAdminDashboard() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ active: 0, pending: 0, verified: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/ads-admin/declarations');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setDeclarations(data);
        
        // Calculate basic metrics from data
        const active = data.length;
        const pending = data.filter((d: Declaration) => d.status === 'SUBMITTED').length;
        const verified = data.filter((d: Declaration) => d.status === 'VERIFIED').length;
        setMetrics({ active, pending, verified });

        // Simulate Notification Check
        if (pending > 0) {
            toast.message("New Declarations", {
                description: `${pending} new declaration(s) require review.`,
                icon: <Bell className="w-4 h-4 text-blue-500" />
            });
        }
      } catch (error) {
        console.error("Error fetching declarations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-light tracking-tight">Admin Manager</h1>
            <p className="text-muted-foreground">Overview of system declarations</p>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
                <Bell className="w-4 h-4" /> Notifications
                {metrics.pending > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{metrics.pending}</span>}
            </Button>
         </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Declarations</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{metrics.active}</div>
            </CardContent>
        </Card>
        <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{metrics.pending}</div>
            </CardContent>
        </Card>
        <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{metrics.verified}</div>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
             <CardHeader>
                <CardTitle>All Submissions</CardTitle>
                <CardDescription>Manage and review officer asset declarations</CardDescription>
            </CardHeader>
            <CardContent>
                 {loading ? (
                     <div className="text-center py-10">Loading declarations...</div>
                 ) : (
                    <DataTable columns={columns} data={declarations} searchKey="userId" />
                 )}
            </CardContent>
        </Card>
        
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Overview of declaration statuses</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                        { name: 'Submitted', value: metrics.pending },
                        { name: 'Verified', value: metrics.verified },
                        { name: 'Active', value: metrics.active - metrics.pending - metrics.verified }
                    ]}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]} className="fill-primary" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button"; // Late import to auto-fix missing usage if any, but better placed top
