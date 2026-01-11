"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Edit2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { db } from "@/lib/db"
import { Draft } from "@/lib/db"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

export const columns: ColumnDef<Draft>[] = [
  {
    accessorKey: "id",
    header: "Draft ID",
    cell: ({ row }) => (
        <div className="font-mono text-xs flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            {row.getValue("id")}
        </div>
    )
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Saved",
    cell: ({ row }) => {
        const timestamp = row.getValue("lastUpdated") as number
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }
  },
  {
    header: "Completion",
    cell: ({ row }) => {
        const data = row.original.data;
        const totalKeys = Object.keys(data).length;
        const filledKeys = Object.values(data).filter(v => v !== "" && v !== null && (Array.isArray(v) ? v.length > 0 : true)).length;
        const progress = Math.round((filledKeys / 50) * 100);

        return <Badge variant="outline">{progress}%</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const draft = row.original;
      // Hook usage inside component is valid
      const router = useRouter(); 

      const handleDelete = async () => {
          try {
              await db.drafts.delete(draft.id);
              toast.success("Draft deleted successfully");
          } catch (error) {
              toast.error("Failed to delete draft");
          }
      };

      return (
        <div className="text-right">
            <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push("/dashboard/officer/declaration/new")}
            >
                <Edit2 className="h-4 w-4 mr-2" /> Resume
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your draft {draft.id}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      )
    },
  },
]
