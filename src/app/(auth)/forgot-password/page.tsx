"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "@/lib/auth-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    console.log("Recovery requested for:", data);
    setSubmitted(true);
  };

  return (
    <Card className="border-0 shadow-none bg-transparent w-full">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-semibold text-center">Account Recovery</CardTitle>
        <CardDescription className="text-center">Enter your email to receive a recovery code</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {submitted ? (
             <div className="text-center space-y-4">
                <div className="text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 p-4 rounded-md text-sm">
                    Recovery link sent! Please check your email inbox.
                </div>
                 <Button asChild className="w-full" variant="outline">
                    <Link href="/login">Back to Login</Link>
                </Button>
             </div>
        ) : (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="w-full" type="submit">
                        Send Recovery Link
                    </Button>
                </form>
            </Form>
        )}
      </CardContent>
      {!submitted && (
          <CardFooter className="justify-center px-0">
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
                Back to Login
            </Link>
          </CardFooter>
      )}
    </Card>
  );
}
