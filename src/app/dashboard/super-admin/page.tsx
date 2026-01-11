"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileJson, ShieldAlert, BarChart3, Settings, UserCog, History } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { adminService, AdminMetrics } from "@/services/admin.service"
import { toast } from "sonner"

export default function SuperAdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics>({
      totalUsers: 0,
      activeDeclarations: 0,
      complianceRate: 0,
      securityIncidents: 0
  })

  useEffect(() => {
      const loadMetrics = async () => {
          try {
              const data = await adminService.getMetrics()
              setMetrics(data)
          } catch (e) {
             console.error("Failed to load metrics")
          }
      }
      loadMetrics()
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h2>
        <p className="text-muted-foreground">System overview and configuration</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Declarations</CardTitle>
            <FileJson className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeDeclarations}</div>
            <p className="text-xs text-muted-foreground">Current cycle submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.complianceRate}%</div>
            <p className="text-xs text-muted-foreground">Officer submission rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Incidents</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.securityIncidents}</div>
            <p className="text-xs text-muted-foreground">Failed logins (24h)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle>System Management</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                          <Settings className="h-6 w-6 text-primary" />
                          <div>
                              <p className="font-medium">Configuration</p>
                              <p className="text-sm text-muted-foreground">Manage site settings</p>
                          </div>
                      </div>
                      <Link href="/dashboard/super-admin/settings">
                          <Button variant="outline">Configure</Button>
                      </Link>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                          <UserCog className="h-6 w-6 text-primary" />
                          <div>
                              <p className="font-medium">User Roles</p>
                              <p className="text-sm text-muted-foreground">Manage access & permissions</p>
                          </div>
                      </div>
                      <Link href="/dashboard/super-admin/users">
                          <Button variant="outline">Manage Users</Button>
                      </Link>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                          <History className="h-6 w-6 text-primary" />
                          <div>
                              <p className="font-medium">Audit Logs</p>
                              <p className="text-sm text-muted-foreground">View system activity history</p>
                          </div>
                      </div>
                      <Link href="/dashboard/super-admin/audit">
                          <Button variant="outline">View Logs</Button>
                      </Link>
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  )
}
