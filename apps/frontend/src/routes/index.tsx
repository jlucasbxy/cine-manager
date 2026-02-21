import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "@/components/layout/root-layout";
import { ListDetailPage } from "@/pages/lists/list-detail-page";
import { ListPage } from "@/pages/lists/list-page";
import { LoginPage } from "@/pages/login/login-page";
import { MovieFormPage } from "@/pages/movie-form/movie-form-page";
import { MovieDetailPage } from "@/pages/movies/movie-detail-page";
import { MovieListPage } from "@/pages/movies/movie-list-page";
import { PasswordResetPage } from "@/pages/password-reset/password-reset-page";
import { PasswordResetRequestPage } from "@/pages/password-reset-request/password-reset-request-page";
import { ProfilePage } from "@/pages/profile/profile-page";
import { RegisterPage } from "@/pages/register/register-page";
import { ProtectedRoute } from "@/routes/protected-route";
import { PublicOnlyRoute } from "@/routes/public-only-route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicOnlyRoute />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        path: "password-reset-request",
        element: <PasswordResetRequestPage />
      },
      { path: "password-reset", element: <PasswordResetPage /> }
    ]
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { path: "lists", element: <ListPage /> },
          { path: "lists/:id", element: <ListDetailPage /> },
          { path: "movies", element: <MovieListPage /> },
          { path: "movies/new", element: <MovieFormPage /> },
          { path: "movies/:id", element: <MovieDetailPage /> },
          { path: "movies/:id/edit", element: <MovieFormPage /> },
          { path: "profile", element: <ProfilePage /> }
        ]
      }
    ]
  }
]);
