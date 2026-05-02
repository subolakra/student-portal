import PlacementDetailPage from "@/pages/PlacementDetail";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/placements/$jobId",
  component: function PlacementDetailRoute() {
    const { jobId } = Route.useParams();
    return <PlacementDetailPage jobId={BigInt(jobId)} />;
  },
});
