"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { declarationService } from "@/services/declaration.service"
import { Declaration } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Printer, CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReceiptPage() {
  const params = useParams()
  const [declaration, setDeclaration] = useState<Declaration | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
        if (typeof params.id === 'string') {
            const data = await declarationService.getById(params.id)
            setDeclaration(data || null)
        }
        setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
      return <div className="p-8 space-y-4">
          <Skeleton className="h-12 w-[300px]" />
          <Skeleton className="h-[400px] w-full" />
      </div>
  }

  if (!declaration) {
      return <div className="p-8 text-center text-muted-foreground">Declaration not found.</div>
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6 print:hidden">
            <h1 className="text-2xl font-bold">Submission Receipt</h1>
            <Button onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Print Receipt
            </Button>
        </div>

        <Card className="print:shadow-none print:border-none">
            <CardHeader className="text-center border-b pb-6">
                <div className="flex justify-center mb-4">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Submission Acknowledgment</CardTitle>
                <CardDescription>Anti-Corruption Commission - Asset Declaration System</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Reference ID</p>
                        <p className="font-mono font-medium text-lg">{declaration.id}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground">Date Submitted</p>
                        <p className="font-medium">{new Date(declaration.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Declaration Year</p>
                        <p className="font-medium">{declaration.year}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium uppercase">{declaration.status.replace("_", " ")}</p>
                    </div>
                </div>

                <div className="border rounded-lg p-4 bg-muted/20">
                    <h3 className="font-semibold mb-2">Officer Details</h3>
                    <p>User ID: <span className="font-mono">{declaration.userId}</span></p>
                    {/* In a real app, populate actual user name if available in declaration object */}
                </div>

                <div className="text-center text-xs text-muted-foreground pt-8 border-t mt-8">
                    <p>This document is an official acknowledgment of your asset declaration submission.</p>
                    <p>Generated on {new Date().toLocaleString()}</p>
                </div>
            </CardContent>
        </Card>

        {/* Print Styles */}
        <style jsx global>{`
            @media print {
                @page { margin: 2cm; }
                body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                header, aside, nav, .print\\:hidden { display: none !important; }
            }
        `}</style>
    </div>
  )
}
