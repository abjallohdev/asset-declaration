"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Declaration } from "@/lib/mock-data";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";

import { declarationService } from "@/services/declaration.service";

export default function UserDashboard() {
  // Mock current user ID
  const currentUserId = "u2";
  const [myDeclarations, setMyDeclarations] = useState<Declaration[]>([]);

  useEffect(() => {
     declarationService.getMyDeclarations()
        .then((data) => {
            // Filter for current user (simulated)
            setMyDeclarations(data.filter(d => d.userId === currentUserId || d.userId === 'u3')); 
        });
  }, []);
  
  // Real drafts count
  const draftCount = useLiveQuery(() => db.drafts.count()) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light tracking-tight">My Dashboard</h1>
        <Button asChild>
            <Link href="/dashboard/officer/declaration/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Declaration
            </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground">
            <CardHeader>
                <CardTitle>Next Deadline</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                    Annual Declaration {new Date().getMonth() > 2 ? new Date().getFullYear() + 1 : new Date().getFullYear()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {(() => {
                    const today = new Date();
                    const currentYear = today.getFullYear();
                    // Deadline is March 31st
                    let deadline = new Date(currentYear, 2, 31); // Month is 0-indexed: 2 = March

                    // If we are past March 31st, deadline is next year
                    if (today > deadline) {
                        deadline = new Date(currentYear + 1, 2, 31);
                    }

                    const diffTime = deadline.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                        <>
                            <div className="text-2xl font-bold">
                                {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <p className="text-xs mt-2 opacity-80">
                                {diffDays} days remaining
                            </p>
                        </>
                    );
                })()}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Unread notifications</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs mt-2 text-muted-foreground">2 from Compliance Team</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Drafts</CardTitle>
                <CardDescription>Incomplete declarations</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{draftCount}</div>
                <p className="text-xs mt-2 text-muted-foreground">{draftCount > 0 ? "Continue editing" : "No active drafts"}</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>My Declarations</CardTitle>
            <CardDescription>History of your asset declarations</CardDescription>
        </CardHeader>
        <CardContent>
            {myDeclarations.length > 0 ? (
                <div className="space-y-4">
                    {myDeclarations.map(decl => (
                        <div key={decl.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-secondary rounded-full shrink-0">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium truncate">Declaration {decl.year}</p>
                                    <p className="text-xs text-muted-foreground truncate">Submitted on {decl.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                <Badge variant="outline" className="shrink-0">{decl.status}</Badge>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/dashboard/officer/history/${decl.id}`}>View</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No declarations found. Start a new one.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
