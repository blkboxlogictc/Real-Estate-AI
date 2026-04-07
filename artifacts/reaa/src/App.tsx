import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { AppLayout } from "@/components/layout/AppLayout";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Leads from "@/pages/leads";
import Calls from "@/pages/calls";
import Appointments from "@/pages/appointments";
import Listings from "@/pages/listings";
import Integrations from "@/pages/integrations";
import VoiceAgent from "@/pages/voice-agent";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import Onboarding from "@/pages/onboarding";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: any }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/onboarding" component={Onboarding} /> {/* Outside layout intentionally, or inside? Usually wizard is full screen */}
      
      {/* Protected Routes */}
      <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
      <Route path="/leads"><ProtectedRoute component={Leads} /></Route>
      <Route path="/calls"><ProtectedRoute component={Calls} /></Route>
      <Route path="/appointments"><ProtectedRoute component={Appointments} /></Route>
      <Route path="/listings"><ProtectedRoute component={Listings} /></Route>
      <Route path="/integrations"><ProtectedRoute component={Integrations} /></Route>
      <Route path="/voice-agent"><ProtectedRoute component={VoiceAgent} /></Route>
      <Route path="/profile"><ProtectedRoute component={Profile} /></Route>
      <Route path="/settings"><ProtectedRoute component={Settings} /></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
