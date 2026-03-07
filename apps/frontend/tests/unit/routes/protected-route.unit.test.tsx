import { render, screen } from "@testing-library/react";
import type { UserDTO } from "@repo/dtos";
import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "@/routes/protected-route";
import { useAuth } from "@/hooks/use-auth";

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

    expect(await screen.findByText("Login Page")).toBeTruthy();
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

    expect(await screen.findByText("Private Content")).toBeTruthy();
    expect(screen.queryByText("Login Page")).toBeNull();
  });
});
