import { Route } from "@tanstack/react-router";
import HubPage from "../pages/hub"; // Assuming HubPage is in src/pages/hub.tsx
import { rootRoute } from "./root"; // Assuming rootRoute is defined in src/routes/root.ts

export const hubRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/hub",
  component: HubPage,
  validateSearch: (search: Record<string, unknown>) => {
    const s = (search.search as string) ?? "";
    const sort = (search.sort as string) ?? "featured";
    const category = (search.category as string) ?? "discover";
    return { search: s, sort, category };
  },
});
