import { createBrowserRouter, Navigate, useParams } from "react-router";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ExplorePage } from "./pages/ExplorePage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { MyCompetitions } from "./pages/MyCompetitions";
import { BookmarkPage } from "./pages/BookmarkPage";
import { CompetitionDetail } from "./pages/CompetitionDetail";
import { CompetitionRegistration } from "./pages/CompetitionRegistration";
import { UniversityProposal } from "./pages/UniversityProposal";
import { ReviewResult } from "./pages/ReviewResult";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { appPaths } from "./data/paths";

function LegacyCompetitionRedirect({ suffix = "" }: { suffix?: string }) {
  const { id } = useParams();
  return <Navigate to={`${appPaths.competition(id ?? "")}${suffix}`} replace />;
}

export const router = createBrowserRouter([
  {
    path: appPaths.home,
    Component: LandingPage,
  },
  {
    path: appPaths.login,
    Component: LoginPage,
  },
  {
    path: appPaths.register,
    Component: RegisterPage,
  },
  {
    path: appPaths.explore,
    Component: ExplorePage,
  },
  {
    path: appPaths.adminLogin,
    Component: AdminLoginPage,
  },
  {
    path: appPaths.adminDashboard,
    element: (
      <ProtectedRoute requireAdmin redirectTo={appPaths.adminLogin}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: appPaths.dashboard,
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: appPaths.myCompetitions,
    element: (
      <ProtectedRoute>
        <MyCompetitions />
      </ProtectedRoute>
    ),
  },
  {
    path: appPaths.bookmarks,
    element: (
      <ProtectedRoute>
        <BookmarkPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/competition/:id",
    Component: CompetitionDetail,
  },
  {
    path: "/competition/:id/university-proposal",
    element: (
      <ProtectedRoute>
        <UniversityProposal />
      </ProtectedRoute>
    ),
  },
  {
    path: "/competition/:id/register",
    element: (
      <ProtectedRoute>
        <CompetitionRegistration />
      </ProtectedRoute>
    ),
  },
  {
    path: "/competition/:id/review-result",
    element: (
      <ProtectedRoute>
        <ReviewResult />
      </ProtectedRoute>
    ),
  },
  {
    path: "/competition-details/:id",
    element: <LegacyCompetitionRedirect />,
  },
  {
    path: "/competition-registration/:id",
    element: <LegacyCompetitionRedirect suffix="/register" />,
  },
  {
    path: "/competition-proposal/:id",
    element: <LegacyCompetitionRedirect suffix="/university-proposal" />,
  },
  {
    path: "/competition-submission/:id",
    element: <LegacyCompetitionRedirect suffix="/register" />,
  },
  {
    path: "*",
    Component: LandingPage,
  },
]);
