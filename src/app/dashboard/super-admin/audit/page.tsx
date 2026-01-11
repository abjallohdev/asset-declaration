"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns" // Verify this import path
import { AuditLog } from "@/lib/mock-data"
import { adminService } from "@/services/admin.service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLogs = async () => {
      try {
          const data = await adminService.getAuditLogs()
          setLogs(data)
      } catch (e) {
          toast.error("Failed to load audit logs")
      } finally {
          setLoading(false)
      }
    }
    loadLogs()
  }, [])

  if (loading) {
      return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h3 className="text-lg font-medium">System Audit Logs</h3>
        <p className="text-sm text-muted-foreground">
          Track all critical system actions and security events.
        </p>
      </div>
      <DataTable columns={columns} data={logs} searchKey="user" />
    </div>
  )
}
