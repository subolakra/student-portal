import InternshipsPage from "@/pages/Internships";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/internships",
  component: InternshipsPage,
});
