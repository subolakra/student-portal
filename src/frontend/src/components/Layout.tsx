import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { type ReactNode, useState } from "react";

interface LayoutProps {
  children: ReactNode;
  pageTitle: string;
  isAdmin?: boolean;
}

export function Layout({ children, pageTitle, isAdmin = false }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, identity } = useAuth();

  const principalText = identity?.getPrincipal().toText() ?? "";
  const displayName =
    principalText.length > 10
      ? `${principalText.slice(0, 5)}\u2026${principalText.slice(-3)}`
      : "Student";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isAdmin={isAdmin}
        userName={displayName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
        <Header
          pageTitle={pageTitle}
          userName={displayName}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
          onLogout={logout}
        />
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
          {children}
        </main>
        <footer className="border-t border-border bg-muted/40 px-6 py-3 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
