"use client"

import { ColumnDef } from "@tanstack/react-table"

import { ArrowUpDown, MoreHorizontal, Eye, ShieldCheck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Declaration } from "@/lib/mock-data"
import Link from "next/link"
import { toast } from "sonner"
import { notificationService } from "@/services/notification.service"

export const columns: ColumnDef<Declaration>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Submitted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "userId",
    header: () => <span className="hidden md:inline">Officer ID</span>,
    cell: ({ row }) => <div className="font-medium uppercase hidden md:block">{row.getValue("userId")}</div>,
  },
  {
    accessorKey: "assets.immovable",
    header: () => <span className="hidden md:inline">Real Estate Value</span>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.assets.immovable.toString())
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium hidden md:block">{formatted}</div>
    },
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
              : status === "REJECTED" 
              ? "text-red-600 border-red-200 bg-red-50"
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
      const declaration = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(declaration.id)}
            >
              Copy declaration ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/ads-admin/declaration/${declaration.id}`} className="flex items-center cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" /> View Details
                </Link>
            </DropdownMenuItem>
            {declaration.status === "SUBMITTED" && (
                <DropdownMenuItem 
                    className="text-green-600 cursor-pointer"
                    onClick={() => {
                        notificationService.addNotification({
                            userId: declaration.userId,
                            title: "Declaration Verified",
                            message: `Your declaration for ${declaration.year} has been verified.`,
                            type: "success",
                            link: `/dashboard/officer/history`
                        });
                        toast.success("Declaration verified and officer notified.");
                        window.location.reload();
                    }}
                >
                    <ShieldCheck className="mr-2 h-4 w-4" /> Mark Verified
                </DropdownMenuItem>
            )}
            {declaration.status === "SUBMITTED" && (
                <DropdownMenuItem className="text-red-600">
                     <AlertCircle className="mr-2 h-4 w-4" /> Flag Issue
                </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
