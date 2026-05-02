import AdminInternships from "@/pages/admin/AdminInternships";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/internships",
  component: AdminInternships,
});
