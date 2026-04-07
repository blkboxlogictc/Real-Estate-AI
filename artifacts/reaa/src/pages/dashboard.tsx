import { useGetDashboardSummary, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PhoneCall, Calendar, Home, Activity, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: activity, isLoading: isActivityLoading } = useGetRecentActivity();

  if (isSummaryLoading || isActivityLoading) {
    return <div className="p-8 text-muted-foreground">Loading dashboard...</div>;
  }

  const statCards = [
    { title: "Total Leads", value: summary?.totalLeads ?? 0, desc: `+${summary?.newLeadsThisWeek ?? 0} this week`, icon: Users },
    { title: "Total Calls", value: summary?.totalCalls ?? 0, desc: `${summary?.callsThisWeek ?? 0} this week`, icon: PhoneCall },
    { title: "Upcoming Appts", value: summary?.upcomingAppointments ?? 0, desc: "Next 7 days", icon: Calendar },
    { title: "Active Listings", value: summary?.activeListings ?? 0, desc: "Synced from MLS", icon: Home },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your AI assistant and business metrics.</p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="flex flex-row items-center gap-3 py-2 px-4 shadow-none border-primary/20 bg-primary/5">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Agent Status</span>
              <span className="text-sm font-semibold text-primary capitalize">{summary?.assistantStatus || "Active"}</span>
            </div>
          </Card>
        </div>
      </div>

      {summary && !summary.onboardingComplete && (
        <Card className="border-blue-500/30 bg-blue-500/5 shadow-none">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-full text-blue-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-100">Finish setting up your agent</h3>
                <p className="text-blue-200/70 text-sm">You are on step {summary.onboardingStep} of 7. Complete onboarding to activate your number.</p>
              </div>
            </div>
            <a href="/onboarding" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
              Continue Onboarding
            </a>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activity && activity.length > 0 ? (
                activity.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-accent text-accent-foreground mt-0.5">
                      {item.type === 'call' && <PhoneCall className="h-4 w-4" />}
                      {item.type === 'lead' && <Users className="h-4 w-4" />}
                      {item.type === 'appointment' && <Calendar className="h-4 w-4" />}
                      {item.type === 'listing' && <Home className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                <div className="flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-sm">Connected Phone</span>
                </div>
                <Badge variant={summary?.connectedPhone ? "default" : "secondary"}>
                  {summary?.connectedPhone || "Not Configured"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-sm">Calendar Sync</span>
                </div>
                <Badge variant="default" className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-sm">MLS / IDX Connection</span>
                </div>
                <Badge variant="secondary">Pending Setup</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
