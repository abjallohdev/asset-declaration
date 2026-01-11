// Fix for Next.js 15+ Async Page Props
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function VerifierAssignmentsPage({ params }: { params: Promise<{ status?: string }> }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Verifier Assignments</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
              <CardHeader><CardTitle>Assignment #1234</CardTitle></CardHeader>
              <CardContent><p>Pending Review</p></CardContent>
          </Card>
          <Card>
              <CardHeader><CardTitle>Assignment #5678</CardTitle></CardHeader>
              <CardContent><p>Pending Review</p></CardContent>
          </Card>
      </div>
    </div>
  );
}
