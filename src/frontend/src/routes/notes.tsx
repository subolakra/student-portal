import NotesPage from "@/pages/Notes";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notes",
  component: NotesPage,
});
