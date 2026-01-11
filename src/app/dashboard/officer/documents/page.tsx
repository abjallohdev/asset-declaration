"use client";

import { FileUpload } from "@/components/ui/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DocumentsPage() {
  const documents = [
    { id: 1, name: "Property_Deed_123.pdf", type: "Deed", date: "2024-03-15", size: "2.4 MB", status: "Verified" },
    { id: 2, name: "Bank_Statement_Mar24.pdf", type: "Financial", date: "2024-03-10", size: "1.1 MB", status: "Pending" },
    { id: 3, name: "Vehicle_Registration.pdf", type: "Registration", date: "2024-02-28", size: "0.8 MB", status: "Verified" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight">Documents</h1>
        <p className="text-muted-foreground">Manage your supporting documents and evidence.</p>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
            <TabsTrigger value="list">My Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
             <Card>
                <CardHeader>
                    <CardTitle>Uploaded Files</CardTitle>
                    <CardDescription>A list of all documents attached to your declarations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date Uploaded</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        {doc.name}
                                    </TableCell>
                                    <TableCell>{doc.type}</TableCell>
                                    <TableCell>{doc.date}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={doc.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                            {doc.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="upload">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Documents</CardTitle>
                    <CardDescription>Attach proofs of ownership, bank statements, etc.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FileUpload />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
