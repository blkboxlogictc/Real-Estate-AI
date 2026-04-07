import { useState } from "react";
import { useListCalls, useGetCall } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneIncoming, PhoneMissed, PhoneForwarded, X, Download } from "lucide-react";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Calls() {
  const [outcomeFilter, setOutcomeFilter] = useState<string>("");
  const { data: calls, isLoading } = useListCalls(outcomeFilter ? { outcome: outcomeFilter } : {});
  const [selectedCallId, setSelectedCallId] = useState<number | null>(null);

  const { data: selectedCall } = useGetCall(selectedCallId!, { 
    query: { enabled: !!selectedCallId, queryKey: ['/api/calls', selectedCallId] } 
  });

  const getOutcomeBadge = (outcome: string | null | undefined) => {
    switch (outcome) {
      case "answered": return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0"><PhoneIncoming className="h-3 w-3 mr-1"/> Answered</Badge>;
      case "missed": return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0"><PhoneMissed className="h-3 w-3 mr-1"/> Missed</Badge>;
      case "voicemail": return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-0">Voicemail</Badge>;
      case "transferred": return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0"><PhoneForwarded className="h-3 w-3 mr-1"/> Transferred</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Call Log</h1>
        <p className="text-muted-foreground mt-1">Review conversations handled by your AI assistant.</p>
      </div>

      <div className="flex gap-2">
        <Badge 
          variant={outcomeFilter === "" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setOutcomeFilter("")}
        >
          All
        </Badge>
        <Badge 
          variant={outcomeFilter === "answered" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setOutcomeFilter("answered")}
        >
          Answered
        </Badge>
        <Badge 
          variant={outcomeFilter === "missed" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setOutcomeFilter("missed")}
        >
          Missed
        </Badge>
      </div>

      <Card className="shadow-sm border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Caller</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading calls...
                </TableCell>
              </TableRow>
            ) : calls?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No calls found.
                </TableCell>
              </TableRow>
            ) : (
              calls?.map((call) => (
                <TableRow 
                  key={call.id} 
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedCallId(call.id)}
                >
                  <TableCell>
                    <div className="font-medium">{call.callerName || "Unknown Caller"}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3" /> {call.callerPhone}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(call.calledAt), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {formatDuration(call.duration)}
                  </TableCell>
                  <TableCell>
                    {getOutcomeBadge(call.outcome)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                    {call.summary || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={!!selectedCallId} onOpenChange={(open) => !open && setSelectedCallId(null)}>
        <SheetContent className="sm:max-w-xl w-full border-border bg-card overflow-y-auto">
          <SheetHeader className="mb-6">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl">Call Details</SheetTitle>
            </div>
            {selectedCall && (
              <SheetDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {selectedCall.callerPhone}</span>
                <span>{format(new Date(selectedCall.calledAt), 'MMM d, yyyy h:mm a')}</span>
                {getOutcomeBadge(selectedCall.outcome)}
              </SheetDescription>
            )}
          </SheetHeader>

          {selectedCall ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Summary</h3>
                <div className="bg-accent/50 p-4 rounded-lg text-sm border border-border">
                  {selectedCall.summary || "No summary available."}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Transcript</h3>
                  <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs">
                    <Download className="h-3 w-3" /> Export
                  </Button>
                </div>
                <div className="bg-background border border-border p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {selectedCall.transcript || "No transcript available."}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">Loading details...</div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}