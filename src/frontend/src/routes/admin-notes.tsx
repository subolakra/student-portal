import AdminNotes from "@/pages/admin/AdminNotes";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/notes",
  component: AdminNotes,
});
