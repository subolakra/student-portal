import InternshipDetailPage from "@/pages/InternshipDetail";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/internships/$id",
  component: function InternshipDetailRoute() {
    const { id } = Route.useParams();
    return <InternshipDetailPage internshipId={BigInt(id)} />;
  },
});
