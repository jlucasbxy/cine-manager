import { render, screen } from "@testing-library/react";
import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/hooks/use-auth";
import { PublicOnlyRoute } from "@/routes/public-only-route";
import { createAuthState, defaultUser } from "../../utils/auth-helpers";

vi.mock("@/hooks/use-auth", () => ({
  useAuth: vi.fn()
}));

function renderPublicOnlyRoute() {
  const router = createMemoryRouter(
    [
      { path: "/movies", element: <div>Movies Page</div> },
      {
        path: "/",
        element: <PublicOnlyRoute />,
        children: [{ index: true, element: <div>Public Content</div> }]
      }
    ],
    { initialEntries: ["/"] }
  );

  return render(<RouterProvider router={router} />);
}

describe("PublicOnlyRoute", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading spinner while auth state is loading", () => {
    vi.mocked(useAuth).mockReturnValue(
      createAuthState({
        isLoading: true
      })
    );

    const { container } = renderPublicOnlyRoute();

    expect(container.querySelector(".animate-spin")).not.toBeNull();
    expect(screen.queryByText("Public Content")).toBeNull();
    expect(screen.queryByText("Movies Page")).toBeNull();
  });

  it("redirects authenticated users to movies", async () => {
    vi.mocked(useAuth).mockReturnValue(
      createAuthState({
        user: defaultUser,
        isAuthenticated: true
      })
    );

    renderPublicOnlyRoute();

    await screen.findByText("Movies Page");
    expect(screen.queryByText("Public Content")).toBeNull();
  });

  it("renders child routes for unauthenticated users", async () => {
    vi.mocked(useAuth).mockReturnValue(createAuthState());

    renderPublicOnlyRoute();

    await screen.findByText("Public Content");
    expect(screen.queryByText("Movies Page")).toBeNull();
  });
});
