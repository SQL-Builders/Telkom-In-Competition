import { createBrowserRouter } from "react-router";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ExplorePage } from "./pages/ExplorePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/explore",
    Component: ExplorePage,
  },
  // fallback
  {
    path: "*",
    Component: LandingPage,
  },
]);