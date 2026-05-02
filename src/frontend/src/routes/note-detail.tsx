import NoteDetailPage from "@/pages/NoteDetail";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notes/$noteId",
  component: function NoteDetailRoute() {
    const { noteId } = Route.useParams();
    return <NoteDetailPage noteId={noteId} />;
  },
});
