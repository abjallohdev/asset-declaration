"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ShieldCheck, FileText, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

// ... imports
import { Button } from "@/components/ui/button";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


type StatsType = {
    complianceRate: number;
    totalDeclarations: number;
    assetsDeclared: string;
    categories: { name: string; value: number }[];
    trends: { year: string; declarations: number }[];
    complianceByMda: { name: string; value: number }[]; // Added
};

export default function Home() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<{found: boolean; name: string | null; year: number | null} | null>(null);

  useEffect(() => {
    fetch('/api/public/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => toast.error("Failed to load transparency data"));
  }, []);

  const handleSearch = async () => {
      if(!searchQuery.trim()) return;
      try {
          const res = await fetch(`/api/public/verify?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSearchResult(data);
          if(data.found) toast.success("Verified: Declaration found.");
          else toast.warning("No public record found.");
      } catch(e) {
          toast.error("Search failed");
      }
  };

  if (!stats) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading portal data...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
       <header className="bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="font-semibold text-xl tracking-tight text-foreground">ADS Transparency Portal</div>
                <div className="flex items-center gap-4">
                     <Link href="/login" className="text-sm font-medium text-primary hover:underline">Officer Login</Link>
                </div>
            </div>
       </header>

       <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl font-light tracking-tight text-foreground">Public Accountability Data</h1>
                <p className="text-lg text-muted-foreground">Access anonymized insights and compliance statistics for public officials.</p>
                
                <div className="relative max-w-md mx-auto mt-6 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Verify an official (e.g. 'John Officer')..." 
                            className="pl-10 h-10 bg-card border-input" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <Button onClick={handleSearch}>Verify</Button>
                </div>
                {searchResult && (
                    <div className={`mt-4 p-4 rounded-lg border text-sm font-medium ${
                        searchResult.found 
                        ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' 
                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                    }`}>
                        {searchResult.found 
                            ? `✅ Confirmed: ${searchResult.name} filed a declaration for ${searchResult.year}.` 
                            : `⚠️ No public record found for "${searchQuery}".`}
                    </div>
                )}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">Compliance Rate</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.complianceRate}%</div>
                        <p className="text-xs text-muted-foreground">+2.5% from last year</p>
                    </CardContent>
                </Card>
                 <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">Total Declarations</CardTitle>
                        <FileText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.totalDeclarations.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Processed this fiscal year</p>
                    </CardContent>
                </Card>
                 <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">Assets Declared Value</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">${stats.assetsDeclared}</div>
                        <p className="text-xs text-muted-foreground">Cumulative declared value</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card className="col-span-1 bg-card">
                    <CardHeader>
                        <CardTitle className="text-foreground">Declarations over Time</CardTitle>
                        <CardDescription className="text-muted-foreground">Year-over-year submission trends</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.trends}>
                                <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => `${value}`} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(0,0,0,0.1)'}} 
                                    contentStyle={{ 
                                        borderRadius: '8px', 
                                        border: '1px solid hsl(var(--border))', 
                                        backgroundColor: 'hsl(var(--popover))',
                                        color: 'hsl(var(--popover-foreground))',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                                    }} 
                                />
                                <Bar dataKey="declarations" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                 </Card>

                 <Card className="col-span-1 bg-card">
                    <CardHeader>
                        <CardTitle className="text-foreground">Asset Composition</CardTitle>
                        <CardDescription className="text-muted-foreground">Breakdown of declared asset types</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.categories}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {stats.categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '8px', 
                                        border: '1px solid hsl(var(--border))', 
                                        backgroundColor: 'hsl(var(--popover))',
                                        color: 'hsl(var(--popover-foreground))',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                                    }} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 mt-4">
                            {stats.categories.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                 </Card>
            </div>

            {/* Charts Row 2 - NEW Compliance Chart */}
             <div className="grid grid-cols-1">
                 <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-foreground">Top Compliance by Institution</CardTitle>
                        <CardDescription className="text-muted-foreground">Leading MDAs by number of declarations filed</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.complianceByMda} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(0,0,0,0.1)'}} 
                                    contentStyle={{ 
                                        borderRadius: '8px', 
                                        border: '1px solid hsl(var(--border))', 
                                        backgroundColor: 'hsl(var(--popover))',
                                        color: 'hsl(var(--popover-foreground))',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                                    }} 
                                />
                                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                 </Card>
            </div>
       </main>
       
       <footer className="bg-card border-t border-border py-6 text-center text-sm text-muted-foreground">
            &copy; 2024 Asset Declaration System. Transparency for a better future.
       </footer>
    </div>
  );
}
