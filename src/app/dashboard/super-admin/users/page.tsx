"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { User } from "@/lib/mock-data"
import { adminService } from "@/services/admin.service"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  
  // Quick form state for "Add User" (in real app use react-hook-form)
  const [formData, setFormData] = useState({ name: "", email: "", role: "PUBLIC_USER" })

  const loadUsers = async () => {
    try {
        const data = await adminService.getUsers()
        setUsers(data)
    } catch (e) {
        toast.error("Failed to fetch users")
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleCreateUser = async () => {
      try {
          await adminService.createUser(formData as any)
          toast.success("User created successfully")
          setOpen(false)
          loadUsers()
      } catch (e) {
          toast.error("Failed to create user")
      }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h3 className="text-lg font-medium">User Management</h3>
            <p className="text-sm text-muted-foreground">
            View and manage all system users.
            </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Add User</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                        Add a new user to the system. They will receive an email to set their password.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Select onValueChange={(val) => setFormData({...formData, role: val})} defaultValue={formData.role}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PUBLIC_USER">Public User</SelectItem>
                                <SelectItem value="PUBLIC_OFFICER">Public Officer</SelectItem>
                                <SelectItem value="ADS_ADMIN">ADS Admin</SelectItem>
                                <SelectItem value="VERIFIER">Verifier</SelectItem>
                                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateUser}>Create User</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={users} searchKey="email" />
    </div>
  )
}
