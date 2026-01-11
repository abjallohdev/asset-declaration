"use client";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { USERS as MOCK_USERS } from "@/lib/mock-data";
import { ColumnDef } from "@tanstack/react-table";

// Type for user data
type User = typeof MOCK_USERS[0];

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "department", header: "Department" },
  { 
      id: "actions",
      cell: ({ row }) => <Button variant="outline" size="sm">Edit</Button>
  }
];

export default function AdministratorsPage() {
  const admins = MOCK_USERS.filter(u => u.role === "ADS_ADMIN" || u.role === "SUPER_ADMIN");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Administrators</h1>
            <p className="text-muted-foreground">Manage system administrators.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Administrator</Button>
      </div>
      <DataTable columns={columns} data={admins} searchKey="name" />
    </div>
  );
}
