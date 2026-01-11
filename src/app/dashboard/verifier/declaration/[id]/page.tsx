"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Declaration } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Printer, ShieldCheck } from "lucide-react";
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

import { declarationService } from "@/services/declaration.service";
import { adminService } from "@/services/admin.service";

export default function VerifierDeclarationDetail() {
  const params = useParams();
  const router = useRouter();
  const [declaration, setDeclaration] = useState<Declaration | null>(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState("");
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        // Reuse admin logic as in original file
        const data = await adminService.getAllDeclarations();
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

// ...

  const handleVerify = async () => {
      try {
          await declarationService.verifyDeclaration(params.id as string, remarks || "Verified by Verifier");

          toast.success("Declaration Verified", { description: "Status updated successfully." });
          setDeclaration(prev => prev ? {...prev, status: "VERIFIED"} : null);
          setIsVerifyOpen(false);
      } catch (error) {
          toast.error("Failed to verify");
      }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Verification: # {declaration.id}</h1>
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
                <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <ShieldCheck className="w-4 h-4 mr-2" /> Verify
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Verification</DialogTitle>
                            <DialogDescription>Add remarks and confirm verification of this declaration.</DialogDescription>
                        </DialogHeader>
                        <Textarea 
                            placeholder="Verification notes..." 
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsVerifyOpen(false)}>Cancel</Button>
                            <Button onClick={handleVerify}>Confirm Verify</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
            <CardHeader>
                <div className="flex justify-between">
                    <div>
                        <CardTitle>Asset Summary</CardTitle>
                        <CardDescription>Declared assets and values</CardDescription>
                    </div>
                    <Badge variant={declaration.status === 'VERIFIED' ? 'default' : 'outline'} className="h-6">
                        {declaration.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Officer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
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
