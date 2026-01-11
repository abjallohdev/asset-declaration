"use client";

import { USERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

export default function ProfilePage() {
  const pathname = usePathname();
  let role = "PUBLIC_USER";
  if (pathname.includes("/dashboard/super-admin")) role = "SUPER_ADMIN";
  else if (pathname.includes("/dashboard/ads-admin")) role = "ADS_ADMIN";
  else if (pathname.includes("/dashboard/officer")) role = "PUBLIC_OFFICER";
  
  const user = USERS.find(u => u.role === role) || USERS[3];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and account security.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Click to upload a new one.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="text-xl bg-secondary">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">Change Avatar</Button>
            </CardContent>
        </Card>

        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Your registered account information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" defaultValue={user.email} disabled />
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" defaultValue={user.role.replace("_", " ")} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input id="designation" defaultValue={user.designation} />
                    </div>
                </div>
                {user.mda && (
                     <div className="space-y-2">
                        <Label htmlFor="mda">MDA</Label>
                        <Input id="mda" defaultValue={user.mda} disabled />
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost">Cancel</Button>
                <Button>Save Changes</Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
