"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react" 
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuditLog } from "@/lib/mock-data"

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Timestamp
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "user",
    header: () => <span className="hidden md:inline">User</span>,
    cell: ({ row }) => <div className="hidden md:block">{row.getValue("user")}</div>,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <span className="font-medium">{row.getValue("action")}</span>
  },
  {
    accessorKey: "details",
    header: () => <span className="hidden lg:inline">Details</span>,
    cell: ({ row }) => <div className="hidden lg:block">{row.getValue("details")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
            <Badge variant={status === "Success" ? "default" : "destructive"}>
                {status}
            </Badge>
        )
    }
  },
]
