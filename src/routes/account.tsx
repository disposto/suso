import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import AccountPage from "../pages/account";

export const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountPage,
});