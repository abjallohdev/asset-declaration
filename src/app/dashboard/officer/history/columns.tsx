"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Declaration } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import Link from "next/link"

export const columns: ColumnDef<Declaration>[] = [
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => <div className="font-medium">{row.getValue("year")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
        <span className="hidden md:inline">Date Submitted</span>
    ),
    cell: ({ row }) => <div className="hidden md:block">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant="outline"
          className={
            status === "VERIFIED"
              ? "text-green-600 border-green-200 bg-green-50"
              : status === "SUBMITTED"
              ? "text-blue-600 border-blue-200 bg-blue-50"
              : "text-orange-600 border-orange-200 bg-orange-50"
          }
        >
          {status.replace("_", " ")}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const decl = row.original
      return (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/officer/history/${decl.id}`}>
              <Eye className="h-4 w-4 mr-2" /> View
            </Link>
          </Button>
          {decl.status === "VERIFIED" && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/officer/history/${decl.id}`}>
                <Download className="h-4 w-4 mr-2" /> Receipt
              </Link>
            </Button>
          )}
        </div>
      )
    },
  },
]
