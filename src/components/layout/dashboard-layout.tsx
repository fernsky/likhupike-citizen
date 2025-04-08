import { ReactNode } from "react";
import DashboardHeader from "./dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
import { Container } from "@/components/ui/container";
import AuthGuard from "@/components/auth/auth-guard";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 bg-slate-50 dark:bg-slate-900/50 min-h-screen">
            <Container className="py-6">{children}</Container>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
