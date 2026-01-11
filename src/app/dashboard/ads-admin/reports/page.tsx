"use client";

import { REPORTS } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileBarChart } from "lucide-react";

import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminService } from "@/services/admin.service";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  useEffect(() => {
    adminService.getReports()
        .then(data => {
            setReports(data);
            setLoading(false);
        })
        .catch(e => setLoading(false));
  }, []);

  const handleDownload = (e: React.MouseEvent, report: any) => {
      e.stopPropagation();
      toast.success(`Downloading ${report.title}...`);
      // Simulate download delay
      setTimeout(() => {
          toast.success("Download complete");
      }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight">System Reports</h1>
        <p className="text-muted-foreground">Access generated compliance and verification reports.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? <div>Loading reports...</div> : reports.map((report) => (
            <Card 
                key={report.id} 
                className="hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => setSelectedReport(report)}
            >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <FileBarChart className="h-6 w-6" />
                    </div>
                    {report.status === "Ready" && (
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => handleDownload(e, report)}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="pt-4">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription className="mt-1">Generated: {report.date}</CardDescription>
                    <div className="mt-4 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            report.status === 'Ready' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20'
                        }`}>
                            {report.status}
                        </span>
                         <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10">
                            {report.type}
                        </span>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

      {/* Report Preview Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="max-w-3xl">
            {selectedReport && (
                <>
                    <DialogHeader>
                        <DialogTitle>{selectedReport.title}</DialogTitle>
                        <DialogDescription>
                            Generated on {selectedReport.date} • {selectedReport.type}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="p-4 bg-muted rounded-md font-mono text-sm max-h-[400px] overflow-auto whitespace-pre-wrap">
                            {/* Simulated Content based on Report Type */}
                            {selectedReport.title.includes("Compliance") ? (
                                `REPORT ID: ${selectedReport.id}
                                
EXECUTIVE SUMMARY:
Overall compliance rate matches current dashboard metrics.
                                
DETAILS:
- Total Officers Targeted: 1250
- Submissions Received: 890
- Pending Verification: 45
- Verified: 845
- Non-Compliant: 360

RECOMMENDATION:
Send reminder triggers to non-compliant officers.`
                            ) : selectedReport.title.includes("Asset") ? (
                                `REPORT ID: ${selectedReport.id}
                                
ASSET VALUE DISTRIBUTION ANALYSIS
                                
SEGMENTS:
- Real Estate: $450M (65%)
- Cash/Deposits: $120M (17%)
- Securities: $80M (11%)
- Vehicles/Other: $50M (7%)

Top 1% of officers hold 25% of declared wealth.`
                            ) : (
                                `REPORT ID: ${selectedReport.id}
                                
SYSTEM PERFORMANCE LOG
                                
UPTIME: 99.99%
API LATENCY: 45ms avg
ERROR RATE: 0.05%

INCIDENTS:
- None reported in this period.`
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedReport(null)}>Close</Button>
                        <Button onClick={(e) => handleDownload(e as any, selectedReport)}>
                            <Download className="mr-2 h-4 w-4" /> Download Report
                        </Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
