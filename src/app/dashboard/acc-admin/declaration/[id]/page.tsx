"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Declaration } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Printer, ShieldCheck, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function DeclarationDetail() {
  const params = useParams();
  const router = useRouter();
  const [declaration, setDeclaration] = useState<Declaration | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch('/api/ads-admin/declarations');
        const data = await res.json();
        const found = data.find((d: Declaration) => d.id === params.id);
        setDeclaration(found || null);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [params.id]);

  if (loading) return <div className="p-8">Loading detail...</div>;
  if (!declaration) return <div className="p-8">Declaration not found</div>;

  const handleVerify = async () => {
      try {
          // API Call
          await fetch(`/api/ads-admin/declarations/${params.id}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'VERIFIED' })
          });

          toast.success("Declaration Verified", { description: "Officer has been notified." });
          setDeclaration(prev => prev ? {...prev, status: "VERIFIED"} : null);
      } catch (error) {
          toast.error("Failed to verify");
      }
  };

  const handleReject = async () => {
      if(!rejectReason) return toast.error("Please provide a reason");
      
      try {
          // API call
          await fetch(`/api/ads-admin/declarations/${params.id}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'REJECTED', remarks: rejectReason })
          });

          toast.error("Declaration Rejected", { description: "Reason has been sent to officer." });
          setDeclaration(prev => prev ? {...prev, status: "REJECTED"} : null);
          setIsRejectOpen(false);
      } catch (error) {
          toast.error("Failed to reject");
      }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Declaration Reference # {declaration.id}</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>Submitted: {declaration.date}</span>
                <span>•</span>
                <span>Year: {declaration.year}</span>
            </div>
        </div>
        <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            
            {declaration.status === 'SUBMITTED' && (
                <>
                <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                    <DialogTrigger asChild>
                         <Button variant="destructive" size="sm">
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Declaration</DialogTitle>
                            <DialogDescription>Please specify the issues found. This will be sent to the officer.</DialogDescription>
                        </DialogHeader>
                        <Textarea 
                            placeholder="Reason for rejection (e.g. Missing bank statements)" 
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleReject}>Confirm Rejection</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
               
                <Button size="sm" onClick={handleVerify} className="bg-green-600 hover:bg-green-700">
                    <ShieldCheck className="w-4 h-4 mr-2" /> Verify
                </Button>
                </>
            )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Personal & Employment Info */}
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                     <div className="flex justify-between"><span className="text-muted-foreground">Name</span> <span className="font-medium">{(declaration as any).surname}, {(declaration as any).otherNames}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">DOB</span> <span className="font-medium">{(declaration as any).dob}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Marital Status</span> <span className="font-medium">{(declaration as any).maritalStatus}</span></div>
                    <Separator className="my-2"/>
                    <div className="flex justify-between"><span className="text-muted-foreground">Phone</span> <span className="font-medium">{(declaration as any).contact?.phones?.[0]}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Address</span> <span className="font-medium">{(declaration as any).contact?.presentAddress}</span></div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Employment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    {(declaration as any).employment?.map((emp: any, i: number) => (
                        <div key={i} className="p-3 bg-muted/40 rounded-lg space-y-1">
                             <div className="font-medium text-base">{emp.employer}</div>
                             <div className="text-muted-foreground">{emp.designation}</div>
                             <div className="flex justify-between mt-2 pt-2 border-t border-dashed">
                                 <span className="text-xs text-muted-foreground">Annual Salary</span>
                                 <span>{emp.currency} {emp.annualSalary?.toLocaleString()}</span>
                             </div>
                        </div>
                    )) || <div className="text-muted-foreground">No employment data</div>}
                </CardContent>
            </Card>
        </div>

        {/* Assets Section */}
        <Card className="md:col-span-2">
            <CardHeader>
                <div className="flex justify-between">
                    <div>
                        <CardTitle>Asset Summary</CardTitle>
                        <CardDescription>Declared assets and values</CardDescription>
                    </div>
                    <Badge variant={declaration.status === 'VERIFIED' ? 'default' : declaration.status === 'REJECTED' ? 'destructive' : 'outline'} className="h-6">
                        {declaration.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {declaration.status === 'REJECTED' && (
                    <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20 flex gap-2 items-start">
                         <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                         <div>
                             <p className="font-semibold">Rejection Reason</p>
                             <p className="text-sm">{rejectReason || "Issues with documentation provided."}</p>
                         </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Cash Assets</span>
                        <div className="font-medium text-lg">${declaration.assets.cash.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Real Estate</span>
                        <div className="font-medium text-lg">${declaration.assets.immovable.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Vehicles & Movables</span>
                        <div className="font-medium text-lg">${declaration.assets.movable.toLocaleString()}</div>
                    </div>
                     <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Securities</span>
                        <div className="font-medium text-lg">${declaration.assets.securities.toLocaleString()}</div>
                    </div>
                </div>
                <Separator />
                <div className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Declared Assets</span>
                        <span className="text-xl font-bold text-primary">
                            ${(declaration.assets.cash + declaration.assets.immovable + declaration.assets.movable + declaration.assets.securities + declaration.assets.other).toLocaleString()}
                        </span>
                    </div>
                </div>
                <div>
                     <span className="text-sm text-muted-foreground">Total Liabilities</span>
                     <div className="font-medium text-lg text-red-500">-${declaration.liabilities.toLocaleString()}</div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Officer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {/* Placeholder Avatar */}
                    JD
                </div>
                <div className="text-center">
                    <div className="font-medium">John Doe</div>
                    <div className="text-sm text-muted-foreground">Officer ID: {declaration.userId}</div>
                </div>
                <Separator />
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Role</span>
                        <span className="font-medium">Senior Officer</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">MDA</span>
                        <span className="font-medium">Ministry of Finance</span>
                    </div>
                 </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
