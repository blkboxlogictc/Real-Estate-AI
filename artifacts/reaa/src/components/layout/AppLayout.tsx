import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  Calendar,
  Home,
  Network,
  Settings,
  UserCircle,
  LogOut,
  Bot
} from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Calls", href: "/calls", icon: PhoneCall },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Listings", href: "/listings", icon: Home },
    { name: "Voice Agent", href: "/voice-agent", icon: Bot },
    { name: "Integrations", href: "/integrations", icon: Network },
  ];

  const bottomNav = [
    { name: "Profile", href: "/profile", icon: UserCircle },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background dark text-foreground">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-card border-r border-border">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">Real Estate AI Assistant</span>
          </div>
          <div className="ml-auto">
            <span className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">
              Demo
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mt-auto border-t border-border">
            <nav className="space-y-1">
              {bottomNav.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={logout}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-muted-foreground group-hover:text-accent-foreground" />
                Log out
              </button>
            </nav>
            <div className="mt-4 px-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center border border-border">
                <span className="text-xs font-medium">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name || 'Demo User'}</span>
                <span className="text-xs text-muted-foreground truncate w-32">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1 w-full">
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-8 max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
