import { AuthProvider } from "./_components/AuthProvider";
import AppShell from "./_components/AppShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
