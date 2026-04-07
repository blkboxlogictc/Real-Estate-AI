import { useState } from "react";
import { useListAppointments } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Appointments() {
  const [statusFilter, setStatusFilter] = useState<string>("upcoming");
  const { data: appointments, isLoading } = useListAppointments({ status: statusFilter });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming": return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0">Upcoming</Badge>;
      case "completed": return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">Completed</Badge>;
      case "cancelled": return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0">Cancelled</Badge>;
      case "no_show": return <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-0">No Show</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage scheduled showings and consultations.</p>
        </div>
        <Button>New Appointment</Button>
      </div>

      <Tabs defaultValue="upcoming" onValueChange={setStatusFilter} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="shadow-sm border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sync</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading appointments...
                </TableCell>
              </TableRow>
            ) : appointments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              appointments?.map((apt) => (
                <TableRow key={apt.id} className="hover:bg-accent/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      {format(new Date(apt.scheduledAt), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(apt.scheduledAt), 'h:mm a')}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{apt.leadName || "Unknown"}</TableCell>
                  <TableCell className="text-sm capitalize text-muted-foreground">{apt.type?.replace('_', ' ') || "General"}</TableCell>
                  <TableCell>
                    {getStatusBadge(apt.status)}
                  </TableCell>
                  <TableCell>
                    {apt.calendarSynced ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <LinkIcon className="h-4 w-4 text-green-500" />
                          </TooltipTrigger>
                          <TooltipContent>Synced to Calendar</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <LinkIcon className="h-4 w-4 text-muted-foreground/50" />
                          </TooltipTrigger>
                          <TooltipContent>Not Synced</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
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

