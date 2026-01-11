"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";

export default function CalendarPage() {
  const events = [
    { id: 1, title: "Declaration Submission Deadline", date: "2024-03-31", type: "Critical", daysLeft: 5 },
    { id: 2, title: "Assets Verification Period Starts", date: "2024-04-15", type: "Info", daysLeft: 20 },
    { id: 3, title: "Annual Compliance Training", date: "2024-05-10", type: "Reminder", daysLeft: 45 },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight">Compliance Calendar</h1>
        <p className="text-muted-foreground">Keep track of important dates and deadlines.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
            <Card key={event.id} className={event.type === 'Critical' ? 'border-red-200 bg-red-50/10' : ''}>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <Badge variant={event.type === 'Critical' ? 'destructive' : 'secondary'} className="mb-2">
                            {event.type}
                        </Badge>
                        <span className="text-sm font-medium text-muted-foreground flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> {event.daysLeft} days left
                        </span>
                    </div>
                    <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Note
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                Deadlines are strict. Late submissions may attract penalties as per the Anti-Corruption Act. Please ensure all declarations are submitted before 11:59 PM on the deadline date.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
