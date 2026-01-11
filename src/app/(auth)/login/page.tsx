"use client";

import { useSession } from "@/components/auth/SessionProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { USERS } from "@/lib/mock-data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/auth-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function LoginPage() {
  const { login } = useSession();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (!isMounted) return null;

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Error handled in provider (toast)
    } finally {
      setLoading(false);
        }
  };
  
  const fillCredential = (demoEmail: string) => {
      form.setValue("email", demoEmail);
      form.setValue("password", "password"); 
  };

  return (
    <>
        <div className="flex flex-col space-y-2 text-center mb-8">
            <div className="flex justify-center mb-4">
                 <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
                    <ShieldCheck className="w-8 h-8" />
                    <span>InfoSafe</span>
                </div>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
                Enter your email to sign in to your dashboard
            </p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="officer@mda.gov" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                 <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <FormControl>
                                <div className="relative">
                                    <Input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="••••••••" 
                                        {...field} 
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="sr-only">Toggle password visibility</span>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                </Button>
            </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground mt-6">
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with demo</span></div>
            </div>
                
            {/* Demo Credentials Section */}
            <div className="grid grid-cols-2 gap-2 mb-6">
                {USERS.filter(u => u.role !== "PUBLIC_USER").map(user => (
                    <Button 
                        key={user.id} 
                        variant="outline" 
                        size="sm" 
                        className="w-full h-auto py-2 flex flex-col items-start gap-0.5"
                        onClick={() => fillCredential(user.email)}
                    >
                        <span className="text-[10px] font-bold uppercase text-primary/80">{user.role.replace('_', ' ')}</span>
                        <span className="text-[10px] text-muted-foreground truncate w-full text-left">{user.email}</span>
                    </Button>
                ))}
            </div>

            <p className="mb-4">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                    Create an account
                </Link>
            </p>

            <Link href="/" className="hover:text-primary underline underline-offset-4 text-xs">
                Back to Transparency Portal
            </Link>
        </div>
    </>
  );
}
