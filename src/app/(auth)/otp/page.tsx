"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, OtpFormValues } from "@/lib/auth-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export default function OTPPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<OtpFormValues>({
      resolver: zodResolver(otpSchema),
      defaultValues: {
          otp: "",
      },
  });

  const onSubmit = (data: OtpFormValues) => {
    setLoading(true);
    // Simulate verification
    console.log("Verifying OTP:", data.otp);
    setTimeout(() => {
        router.push("/login");
    }, 1500);
  };

  return (
    <Card className="border-0 shadow-none bg-transparent w-full">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-semibold text-center">Verify Identity</CardTitle>
        <CardDescription className="text-center">Enter the one-time password sent to your phone</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col items-center">
                <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                             <Label className="sr-only">One-Time Password</Label>
                            <FormControl>
                                <InputOTP 
                                    maxLength={6} 
                                    value={field.value} 
                                    onChange={field.onChange}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                </Button>
            </form>
        </Form>

         <div className="text-center mt-4 text-sm text-muted-foreground">
            Didn&apos;t receive code? <button className="text-primary hover:underline font-medium">Resend Code</button>
        </div>
      </CardContent>
    </Card>
  );
}
