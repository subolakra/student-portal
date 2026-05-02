import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Route as rootRoute } from "./routes/__root";
import { Route as adminRoute } from "./routes/admin";
import { Route as adminInternshipsRoute } from "./routes/admin-internships";
import { Route as adminNotesRoute } from "./routes/admin-notes";
import { Route as adminPlacementsRoute } from "./routes/admin-placements";
import { Route as indexRoute } from "./routes/index";
import { Route as noteDetailRoute } from "./routes/note-detail";
import { Route as notesRoute } from "./routes/notes";
import { Route as placementDetailRoute } from "./routes/placement-detail";
import { Route as placementsRoute } from "./routes/placements";
import { Route as profileRoute } from "./routes/profile";

const routeTree = rootRoute.addChildren([
  indexRoute,
  notesRoute,
  noteDetailRoute,
  placementsRoute,
  placementDetailRoute,
  profileRoute,
  adminRoute,
  adminNotesRoute,
  adminPlacementsRoute,
  adminInternshipsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
