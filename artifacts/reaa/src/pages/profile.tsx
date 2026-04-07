import { useGetAgentProfile, useUpdateAgentProfile } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Building, Phone, Mail, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { data: profile, isLoading } = useGetAgentProfile();
  const updateProfile = useUpdateAgentProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    brokerage: "",
    bio: "",
    serviceAreas: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        brokerage: profile.brokerage || "",
        bio: profile.bio || "",
        serviceAreas: profile.serviceAreas || ""
      });
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Profile updated", description: "Your details have been saved." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
      }
    });
  };

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading profile...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal and business details.</p>
        </div>
        <Button onClick={handleSave} disabled={updateProfile.isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {updateProfile.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-9" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-9" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Brokerage</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-9" 
                  value={formData.brokerage} 
                  onChange={(e) => setFormData({...formData, brokerage: e.target.value})} 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Professional Bio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Bio / About Me</Label>
            <Textarea 
              rows={4} 
              value={formData.bio} 
              onChange={(e) => setFormData({...formData, bio: e.target.value})} 
              placeholder="Share your experience and expertise. Your AI assistant will use this to answer questions about you."
            />
          </div>
          <div className="space-y-2">
            <Label>Service Areas</Label>
            <Input 
              value={formData.serviceAreas} 
              onChange={(e) => setFormData({...formData, serviceAreas: e.target.value})} 
              placeholder="e.g. Downtown, Westside, Suburbs (comma separated)"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}