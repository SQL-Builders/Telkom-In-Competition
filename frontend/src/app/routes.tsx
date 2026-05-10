import { createBrowserRouter } from "react-router";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ExplorePage } from "./pages/ExplorePage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";

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
  {
    path: "/admin-login",
    Component: AdminLoginPage,
  },
  {
    path: "/admin-dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/dashboard",
    Component: UserDashboard,
  },
  {
    path: "/my-competitions",
    Component: UserDashboard,
  },
  {
    path: "/bookmarks",
    Component: UserDashboard,
  },
  {
    path: "/competition-details/:id",
    Component: UserDashboard,
  },
  {
    path: "/competition-registration/:id",
    Component: UserDashboard,
  },
  {
    path: "/competition-proposal/:id",
    Component: UserDashboard,
  },
  {
    path: "/competition-submission/:id",
    Component: UserDashboard,
  }
]);
