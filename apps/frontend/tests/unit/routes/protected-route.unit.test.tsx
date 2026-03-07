import { render, screen } from "@testing-library/react";
import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "@/routes/protected-route";
import { useAuth } from "@/hooks/use-auth";
import { createAuthState, defaultUser } from "../../utils/auth-helpers";

vi.mock("@/hooks/use-auth", () => ({
  useAuth: vi.fn()
}));

function renderProtectedRoute() {
  const router = createMemoryRouter(
    [
      { path: "/login", element: <div>Login Page</div> },
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [{ index: true, element: <div>Private Content</div> }]
      }
    ],
    { initialEntries: ["/"] }
  );

  return render(<RouterProvider router={router} />);
}

describe("ProtectedRoute", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading spinner while auth state is loading", () => {
    vi.mocked(useAuth).mockReturnValue(
      createAuthState({
        isLoading: true
      })
    );

    const { container } = renderProtectedRoute();

    expect(container.querySelector(".animate-spin")).not.toBeNull();
    expect(screen.queryByText("Private Content")).toBeNull();
    expect(screen.queryByText("Login Page")).toBeNull();
  });

  it("redirects unauthenticated users to login", async () => {
    vi.mocked(useAuth).mockReturnValue(createAuthState());

    renderProtectedRoute();

    await screen.findByText("Login Page");
    expect(screen.queryByText("Private Content")).toBeNull();
  });

  it("renders child routes for authenticated users", async () => {
    vi.mocked(useAuth).mockReturnValue(
      createAuthState({
        user: defaultUser,
        isAuthenticated: true
      })
    );

    renderProtectedRoute();

    await screen.findByText("Private Content");
    expect(screen.queryByText("Login Page")).toBeNull();
  });
});
