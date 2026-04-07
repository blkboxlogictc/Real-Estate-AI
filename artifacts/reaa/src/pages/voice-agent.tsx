import { useGetVoiceSettings, useUpdateVoiceSettings, useGetVapiAssistantStatus } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, PhoneCall, Bot, Zap, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function VoiceAgent() {
  const { data: settings, isLoading } = useGetVoiceSettings();
  const { data: vapiStatus } = useGetVapiAssistantStatus();
  const updateSettings = useUpdateVoiceSettings();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    isActive: false,
    selectedVoice: "",
    greeting: "",
    personality: "",
    escalationBehavior: ""
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        isActive: settings.isActive,
        selectedVoice: settings.selectedVoice || "",
        greeting: settings.greeting || "",
        personality: settings.personality || "",
        escalationBehavior: settings.escalationBehavior || ""
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Settings saved", description: "Voice agent configuration updated successfully." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
      }
    });
  };

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading voice settings...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voice Agent Config</h1>
          <p className="text-muted-foreground mt-1">Configure how your AI assistant sounds and behaves on calls.</p>
        </div>
        <Button onClick={handleSave} disabled={updateSettings.isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {updateSettings.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" /> Personality & Voice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Selected Voice</Label>
                <Select value={formData.selectedVoice} onValueChange={(val) => setFormData({...formData, selectedVoice: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jennifer">Jane (Professional Female)</SelectItem>
                    <SelectItem value="michael">Michael (Authoritative Male)</SelectItem>
                    <SelectItem value="sarah">Sarah (Friendly Female)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Greeting Message</Label>
                <Textarea 
                  rows={3} 
                  value={formData.greeting}
                  onChange={(e) => setFormData({...formData, greeting: e.target.value})}
                  placeholder="Hello, thanks for calling..."
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">This is the first thing the caller hears when they connect.</p>
              </div>

              <div className="space-y-2">
                <Label>Agent Personality Prompt</Label>
                <Textarea 
                  rows={5} 
                  value={formData.personality}
                  onChange={(e) => setFormData({...formData, personality: e.target.value})}
                  placeholder="You are a helpful real estate assistant..."
                />
                <p className="text-xs text-muted-foreground">Instructions for how the agent should behave and respond.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-primary" /> Routing & Escalation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>When to transfer calls</Label>
                <Select value={formData.escalationBehavior} onValueChange={(val) => setFormData({...formData, escalationBehavior: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select behavior" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Always transfer if I'm available</SelectItem>
                    <SelectItem value="high_intent">Only transfer high-intent buyer/seller leads</SelectItem>
                    <SelectItem value="never">Never transfer, just take a message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={`shadow-sm border ${formData.isActive ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center ${formData.isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Bot className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{formData.isActive ? "Agent is Active" : "Agent is Paused"}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.isActive ? "Taking calls on your linked number." : "Not answering calls."}
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label>Enable AI Answering</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Provider Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Vapi Status</span>
                <span className="font-mono text-xs bg-accent px-2 py-1 rounded">{vapiStatus?.status || "Unknown"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><PhoneCall className="h-4 w-4" /> Linked Phone</span>
                <span className="font-mono text-xs">{settings?.linkedPhone || "None"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}