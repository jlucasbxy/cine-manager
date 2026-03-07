import { render, screen } from "@testing-library/react";
import type { UserDTO } from "@repo/dtos";
import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/hooks/use-auth";
import { PublicOnlyRoute } from "@/routes/public-only-route";

vi.mock("@/hooks/use-auth", () => ({
  useAuth: vi.fn()
}));

type AuthState = ReturnType<typeof useAuth>;

const defaultUser: UserDTO = {
  id: "user-1",
  name: "Jane Doe",
  email: "jane@example.com",
  avatarUrl: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z"
};

function createAuthState(overrides: Partial<AuthState> = {}): AuthState {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(async () => undefined),
    register: vi.fn(async () => undefined),
    logout: vi.fn(async () => undefined),
    updateUser: vi.fn(async () => undefined),
    ...overrides
  };
}

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

    expect(await screen.findByText("Movies Page")).toBeTruthy();
    expect(screen.queryByText("Public Content")).toBeNull();
  });

  it("renders child routes for unauthenticated users", async () => {
    vi.mocked(useAuth).mockReturnValue(createAuthState());

    renderPublicOnlyRoute();

    expect(await screen.findByText("Public Content")).toBeTruthy();
    expect(screen.queryByText("Movies Page")).toBeNull();
  });
});
