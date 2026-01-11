"use client";

import { AUDIT_LOGS } from "@/lib/mock-data";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">Detailed history of system activities and security events.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>View all user actions and system events.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {AUDIT_LOGS.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                            <TableCell>{log.user}</TableCell>
                            <TableCell className="font-medium">{log.action}</TableCell>
                            <TableCell className="text-muted-foreground">{log.details}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className={log.status === 'Success' ? 'text-green-600' : 'text-red-600'}>
                                    {log.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
