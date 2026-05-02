import PlacementsPage from "@/pages/Placements";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/placements",
  component: PlacementsPage,
});
