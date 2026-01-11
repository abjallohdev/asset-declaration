"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { Clock, CheckCircle, Edit, ClipboardCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { declarationService } from "@/services/declaration.service";

export default function VerifierDashboard() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    declarationService.getAssignments()
      .then(data => {
          setAssignments(data);
          setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  const pendingCount = assignments.filter(a => a.status === 'SUBMITTED').length; // Assuming 'SUBMITTED' means pending verification for now, or 'PENDING_VERIFICATION' if strictly typed
  // Adjusting stats based on data
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h1 className="text-3xl font-light tracking-tight">Verifier Portal</h1>
          <p className="text-muted-foreground">Manage and review asset declarations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Assignments"
          value={pendingCount}
          description="Awaiting review"
          icon={Clock}
        />
        <StatsCard
          title="In Progress"
          value={assignments.filter(a => a.status === 'In Progress').length}
          description="Currently reviewing"
          icon={Edit}
        />
         <StatsCard
          title="Completed"
          value={assignments.filter(a => a.status === 'VERIFIED').length}
          description="Total verified"
          icon={CheckCircle}
        />
        <StatsCard
          title="Total Workload"
          value={assignments.length}
          description="All time assignments"
          icon={ClipboardCheck}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold leading-none tracking-tight">Recent Assignments</h3>
                <p className="text-sm text-muted-foreground">Declarations waiting for your review.</p>
            </div>
            <div className="p-6 pt-0">
                <div className="space-y-4">
                    {loading ? <div className="text-center py-4">Loading assignments...</div> : assignments.length === 0 ? <div className="text-center py-4 text-muted-foreground">No assignments found.</div> : assignments.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                                    {item.userId ? item.userId.substring(0, 2).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">User {item.userId}</p>
                                    <p className="text-xs text-muted-foreground">{item.year} Declaration • {item.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {item.status}
                                </span>
                                <Button size="sm" variant="outline" onClick={() => window.location.href=`/dashboard/verifier/declaration/${item.id}`}>
                                    Review
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold leading-none tracking-tight">Verification Performance</h3>
                <p className="text-sm text-muted-foreground">Your weekly completion rate.</p>
            </div>
             <div className="p-6 pt-0 flex flex-col items-center justify-center h-[300px]">
                <div className="relative h-40 w-40 flex items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="stroke-muted" cx="50" cy="50" r="40" strokeWidth="8" fill="none" />
                        <circle className="stroke-primary" cx="50" cy="50" r="40" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-bold">75%</span>
                        <span className="text-xs text-muted-foreground">Completed</span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground mt-6 text-center max-w-[200px]">
                    You are ahead of schedule. Keep up the good work!
                </p>
             </div>
        </div>
      </div>
    </div>
  );
}
