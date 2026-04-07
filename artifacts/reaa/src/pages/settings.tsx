import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, CreditCard, Users, Shield } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription, billing, and team access.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-2">
          <div className="flex flex-col gap-1">
            <Button variant="secondary" className="justify-start gap-3 w-full bg-accent/50">
              <SettingsIcon className="h-4 w-4" /> General
            </Button>
            <Button variant="ghost" className="justify-start gap-3 w-full text-muted-foreground hover:text-foreground">
              <CreditCard className="h-4 w-4" /> Billing & Plan
            </Button>
            <Button variant="ghost" className="justify-start gap-3 w-full text-muted-foreground hover:text-foreground">
              <Users className="h-4 w-4" /> Team Members
            </Button>
            <Button variant="ghost" className="justify-start gap-3 w-full text-muted-foreground hover:text-foreground">
              <Shield className="h-4 w-4" /> Security
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-xl">General Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>America/Los_Angeles (Pacific Time)</option>
                    <option>America/Denver (Mountain Time)</option>
                    <option>America/Chicago (Mountain Time)</option>
                    <option>America/New_York (Eastern Time)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}