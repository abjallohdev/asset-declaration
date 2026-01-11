"use client";

import { useState, useCallback } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUpload?: (files: File[]) => void;
  maxSize?: number; // in MB
  accept?: string;
}

export function FileUpload({ onUpload, maxSize = 5, accept = ".pdf,.jpg,.png" }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setUploading(true);
    setProgress(0);

    // Simulate upload
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          if (onUpload) onUpload(files);
          setFiles([]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Drag & Drop files here</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">or click to browse</p>
        <input
          type="file"
          className="hidden"
          id="file-upload"
          multiple
          accept={accept}
          onChange={handleFileChange}
        />
        <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
          Browse Files
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
            Supported formats: {accept.replace(/,/g, ", ")} (Max {maxSize}MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
            {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-background">
                    <div className="flex items-center gap-3">
                        <File className="h-4 w-4 text-primary" />
                        <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)} disabled={uploading}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            {uploading && (
                <div className="space-y-1">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-center text-muted-foreground">Uploading... {progress}%</p>
                </div>
            )}

            {!uploading && (
                <div className="flex justify-end pt-2">
                    <Button onClick={handleUpload}>Upload {files.length} Files</Button>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
