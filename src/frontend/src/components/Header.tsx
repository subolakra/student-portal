import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";

interface HeaderProps {
  pageTitle: string;
  userName: string;
  onMenuToggle: () => void;
  onLogout: () => void;
}

export function Header({
  pageTitle,
  userName,
  onMenuToggle,
  onLogout,
}: HeaderProps) {
  return (
    <header
      data-ocid="header"
      className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-card px-4 shadow-xs"
    >
      <button
        type="button"
        data-ocid="header.menu_toggle"
        onClick={onMenuToggle}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth md:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="flex-1 font-display text-base font-semibold text-foreground min-w-0 truncate">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-muted-foreground">
          Hello,{" "}
          <span className="font-medium text-foreground">
            {userName || "Student"}
          </span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          data-ocid="header.logout_button"
          onClick={onLogout}
          className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
}
