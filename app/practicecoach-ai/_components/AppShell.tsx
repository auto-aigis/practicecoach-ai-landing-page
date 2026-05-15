"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Home, Settings, CreditCard } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/practicecoach-ai", icon: Home },
  { label: "Analyze", href: "/practicecoach-ai/analyze", icon: null },
  { label: "Pricing", href: "/practicecoach-ai/pricing", icon: CreditCard },
  { label: "Settings", href: "/practicecoach-ai/settings", icon: Settings },
];

export default function AppShell({ children }: AppShellProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage =
    pathname?.endsWith("/login") ||
    pathname?.endsWith("/register") ||
    pathname?.endsWith("/verify-email") ||
    pathname?.endsWith("/reset-password");

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user && !isAuthPage && pathname !== "/practicecoach-ai") {
      router.push("/practicecoach-ai/login");
    }
  }, [loading, user, isAuthPage, router, pathname]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-white mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/practicecoach-ai/login");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-gray-950">
      <aside className="hidden w-64 border-r border-gray-800 bg-gray-950 flex-col md:flex">
        <div className="border-b border-gray-800 p-6">
          <h1 className="text-lg font-semibold text-white">PracticeCoach AI</h1>
          <p className="text-xs text-gray-400 mt-1">{user.email}</p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-800 p-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col md:hidden">
        <div className="h-14 border-b border-gray-800 bg-gray-950 flex items-center px-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-300">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <h1 className="flex-1 text-center text-sm font-semibold text-white">PracticeCoach AI</h1>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
            <div className="w-64 h-screen bg-gray-950 border-r border-gray-800 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="border-b border-gray-800 p-6">
                <h1 className="text-lg font-semibold text-white">PracticeCoach AI</h1>
                <p className="text-xs text-gray-400 mt-1">{user.email}</p>
              </div>

              <nav className="space-y-2 p-4">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        router.push(item.href);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-gray-800 p-4 mt-auto">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <main className="hidden md:flex flex-1 flex-col overflow-auto">{children}</main>
    </div>
  );
}
