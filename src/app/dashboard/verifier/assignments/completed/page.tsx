import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifierCompletedAssignmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Completed Assignments</h1>
       <div className="text-muted-foreground p-8 text-center bg-muted/20 rounded-lg">
          No completed assignments found.
       </div>
    </div>
  );
}
