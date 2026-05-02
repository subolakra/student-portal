import { LoginPage } from "@/components/LoginPage";
import { useAuth } from "@/hooks/useAuth";
import { Outlet, createRootRoute } from "@tanstack/react-router";

function RootComponent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        data-ocid="root.loading_state"
        className="min-h-screen flex items-center justify-center bg-background"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">
            Connecting\u2026
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Outlet />;
}

export const Route = createRootRoute({
  component: RootComponent,
});
