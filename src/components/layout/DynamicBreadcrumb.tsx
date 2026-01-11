"use client";

import { usePathname } from "next/navigation";
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean).filter(s => s !== 'dashboard');
  
  // Custom label map
  const labelMap: Record<string, string> = {
    'ads-admin': 'Admin',
    'super-admin': 'Super Admin',
    'new': 'New Declaration',
    'declaration': 'Declaration',
    'history': 'My Declarations',
    'users': 'User Management',
    'settings': 'System Settings',
    'audit': 'Audit Logs',
    'reports': 'System Reports',
    'officer': 'Officer',
    'verifier': 'Verifier'
  };

  const getLabel = (segment: string) => {
      // Check if it looks like an ID
      if (segment.startsWith('d') && !isNaN(Number(segment.substring(1)))) return `Ref #${segment}`; 
      if (segment.length > 20) return 'Detail'; // UUID heuristic
      return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        {segments.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}
        
        {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = `/dashboard/${segments.slice(0, index + 1).join('/')}`;
            const label = getLabel(segment);

            return (
                <React.Fragment key={href}>
                    <BreadcrumbItem>
                        {isLast ? (
                            <BreadcrumbPage>{label}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                </React.Fragment>
            );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
