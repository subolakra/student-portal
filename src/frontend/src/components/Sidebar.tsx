import { cn } from "@/lib/utils";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  LayoutDashboard,
  Settings,
  User,
  X,
} from "lucide-react";

interface SidebarProps {
  isAdmin: boolean;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, adminOnly: false },
  { label: "Notes", href: "/notes", icon: BookOpen, adminOnly: false },
  {
    label: "Placements",
    href: "/placements",
    icon: Briefcase,
    adminOnly: false,
  },
  {
    label: "Internships",
    href: "/internships",
    icon: GraduationCap,
    adminOnly: false,
  },
  { label: "Profile", href: "/profile", icon: User, adminOnly: false },
  { label: "Admin Panel", href: "/admin", icon: Settings, adminOnly: true },
];

export function Sidebar({ isAdmin, userName, isOpen, onClose }: SidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();

  const visibleLinks = navLinks.filter((l) => !l.adminOnly || isAdmin);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}

      <aside
        data-ocid="sidebar"
        className={cn(
          "fixed left-0 top-0 z-30 flex h-full w-60 flex-col bg-primary shadow-lg transition-smooth",
          "md:relative md:z-auto md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-primary-foreground/10">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/portal-logo.dim_120x120.png"
              alt="Student Portal"
              className="h-8 w-8 rounded-md object-contain bg-primary-foreground/10 p-0.5"
            />
            <div>
              <div className="font-display font-bold text-primary-foreground text-sm leading-tight">
                Student
              </div>
              <div className="font-display font-bold text-primary-foreground/70 text-xs leading-tight">
                Portal
              </div>
            </div>
          </div>
          <button
            type="button"
            className="md:hidden text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto py-4 px-3"
          aria-label="Main navigation"
        >
          <ul className="space-y-0.5">
            {visibleLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(link.href);
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-ocid={`sidebar.${link.label.toLowerCase().replace(/ /g, "_")}.link`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate({ to: link.href });
                      onClose();
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth cursor-pointer no-underline",
                      isActive
                        ? "bg-primary-foreground/15 text-primary-foreground"
                        : "text-primary-foreground/65 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                    )}
                  >
                    <Icon
                      className="h-4 w-4 shrink-0"
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {link.label}
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-primary-foreground/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground font-display font-semibold text-sm">
              {userName ? userName.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-primary-foreground">
                {userName || "Student"}
              </div>
              <div className="text-xs text-primary-foreground/50">
                {isAdmin ? "Administrator" : "Student"}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
