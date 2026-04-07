import { useListIntegrations } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, ExternalLink, Key, CheckCircle2, AlertCircle } from "lucide-react";

export default function Integrations() {
  const { data: integrations, isLoading } = useListIntegrations();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground mt-1">Connect your tools to automate your workflow.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">Loading integrations...</div>
        ) : integrations?.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">No integrations available.</div>
        ) : (
          integrations?.map((integration) => (
            <Card key={integration.id} className={`shadow-sm transition-colors ${integration.status === 'connected' ? 'border-primary/20 bg-primary/5' : 'border-border'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center border border-border">
                    <Network className="h-5 w-5 text-foreground" />
                  </div>
                  {integration.status === 'connected' ? (
                    <Badge variant="default" className="bg-green-500/20 text-green-500 hover:bg-green-500/30 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Connected
                    </Badge>
                  ) : integration.status === 'pending' ? (
                    <Badge variant="secondary" className="gap-1">
                      <AlertCircle className="h-3 w-3" /> Pending
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">Disconnected</Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{integration.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {integration.configuredAt ? `Configured ${new Date(integration.configuredAt).toLocaleDateString()}` : "Not configured yet"}
                  </span>
                  <Button variant={integration.status === 'connected' ? "outline" : "default"} size="sm" className="gap-2">
                    {integration.status === 'connected' ? <><Key className="h-3 w-3" /> Manage</> : <><ExternalLink className="h-3 w-3" /> Connect</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}