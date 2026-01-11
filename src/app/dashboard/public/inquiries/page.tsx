"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";

export default function InquiriesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight">Inquiries</h1>
        <p className="text-muted-foreground">Submit questions or report issues to the ADS team.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>We typically respond within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="e.g. Technical Issue" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Describe your issue..." className="min-h-[120px]" />
                </div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recent Inquiries</CardTitle>
                <CardDescription>Status of your submitted tickets.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-center text-muted-foreground py-8 border border-dashed rounded-lg">
                    No recent inquiries found.
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
