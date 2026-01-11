"use client";

import React from 'react';
import { AuthCarousel } from "@/components/ui/auth-carousel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Left Column - Carousel */}
      <div className="hidden lg:block relative bg-zinc-900 overflow-hidden">
         <AuthCarousel />
      </div>

      {/* Right Column - Content */}
      <div className="flex flex-col justify-center items-center p-8 bg-background relative overflow-y-auto h-screen">
          <div className="w-full max-w-md space-y-8">
            {children}
          </div>
      </div>
    </div>
  );
}
