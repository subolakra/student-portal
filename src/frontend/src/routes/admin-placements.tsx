import AdminPlacements from "@/pages/admin/AdminPlacements";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/placements",
  component: AdminPlacements,
});
