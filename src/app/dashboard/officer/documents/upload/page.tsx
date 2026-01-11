"use client";

import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UploadDocumentPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Upload New Document</h1>
      <Card>
          <CardHeader>
              <CardTitle>Select Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <FileUpload maxSize={10} accept=".pdf,.jpg,.png" />
              <div className="flex justify-end">
                  <Button>Upload Document</Button>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
