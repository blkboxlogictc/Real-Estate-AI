import { useState } from "react";
import { useListLeads, useGetLeadStats, useUpdateLead } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Phone, Mail, User } from "lucide-react";
import { format } from "date-fns";

export default function Leads() {
  const [search, setSearch] = useState("");
  const { data: leads, isLoading } = useListLeads({ search });
  const { data: stats } = useGetLeadStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "contacted": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "qualified": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "converted": return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20";
      case "unqualified": return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20";
      default: return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">Manage and track your prospective clients.</p>
        </div>
        <Button>Add Lead</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats?.map((stat) => (
          <Card key={stat.status} className="shadow-sm">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{stat.count}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.status}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-border">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search leads..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Intent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading leads...
                </TableCell>
              </TableRow>
            ) : leads?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No leads found.
                </TableCell>
              </TableRow>
            ) : (
              leads?.map((lead) => (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-4 w-4" />
                      </div>
                      {lead.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm text-muted-foreground gap-1">
                      {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span>}
                      {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm capitalize">{lead.source || "Unknown"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {lead.intent || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}