"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronRight, Command } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { USERS } from "@/lib/mock-data";
import { SIDEBAR_CONFIG } from "@/config/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();

  let roleKey = "PUBLIC_USER";
  if (pathname.includes("/dashboard/super-admin")) roleKey = "SUPER_ADMIN";
  else if (pathname.includes("/dashboard/ads-admin")) roleKey = "ADS_ADMIN";
  else if (pathname.includes("/dashboard/officer")) roleKey = "PUBLIC_OFFICER";
  else if (pathname.includes("/dashboard/verifier")) roleKey = "VERIFIER";
  
  const user = USERS.find(u => u.role === roleKey) || USERS.find(u => u.role === "PUBLIC_USER");
  const config = SIDEBAR_CONFIG[roleKey as keyof typeof SIDEBAR_CONFIG];

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-sidebar-border bg-sidebar-background">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{config?.header.logo || "InfoSafe"}</span>
                  <span className="truncate text-xs">{config?.header.subtitle || "Asset System"}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {config?.nav.map((item: any) => (
            item.subItems ? (
                 <Collapsible key={item.id} asChild defaultOpen={pathname.startsWith(item.path) || item.subItems.some((sub: any) => pathname.startsWith(sub.path))}>
                    <SidebarMenuItem>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <item.icon />
                                    <span>{item.label}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile}>
                            {item.label}
                          </TooltipContent>
                        </Tooltip>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {item.subItems.map((subItem: any) => (
                                    <SidebarMenuSubItem key={subItem.id}>
                                        <SidebarMenuSubButton asChild isActive={pathname === subItem.path}>
                                            <Link href={subItem.path}>
                                                <subItem.icon className="h-4 w-4 mr-2" />
                                                <span>{subItem.label}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                 </Collapsible>
            ) : (
                <SidebarMenuItem key={item.id}>
                <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/" && pathname.length > item.path.length)}
                    tooltip={item.label}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                    <Link href={item.path}>
                    <item.icon className="bg-transparent" />
                    <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            )
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:p-0">
             <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden group-data-[collapsible=icon]:justify-center">
                 <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="group-data-[collapsible=icon]:hidden flex flex-col text-sm overflow-hidden truncate">
                    <span className="font-medium text-foreground truncate leading-none mb-0.5">{user?.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate opacity-80 uppercase leading-none">{user?.designation || user?.role}</span>
                </div>
             </div>
             <Tooltip>
                <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 group-data-[collapsible=icon]:hidden" asChild>
                        <Link href="/login">
                            <LogOut className="h-4 w-4" />
                            <span className="sr-only">Sign Out</span>
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Sign Out</TooltipContent>
             </Tooltip>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
