import { getApp } from "./app-context";

type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshTokenCookie: string;
};

type UserOverrides = {
  name?: string;
  email?: string;
  password?: string;
};

export const registerUser = async (
  overrides: UserOverrides = {}
): Promise<RegisteredUser> => {
  const app = getApp();
  const name = overrides.name ?? "E2E User";
  const email = overrides.email ?? `e2e-${Date.now()}@example.com`;
  const password = overrides.password ?? "Str0ng!Pass#2024";

  const registerRes = await app.inject({
    method: "POST",
    url: "/api/v1/users",
    payload: { name, email, password }
  });

  if (registerRes.statusCode !== 201) {
    throw new Error(
      `Failed to register user: ${registerRes.statusCode} ${registerRes.body}`
    );
  }

  const user = registerRes.json();

  const loginRes = await app.inject({
    method: "POST",
    url: "/api/v1/auth/login",
    payload: { email, password }
  });

  if (loginRes.statusCode !== 200) {
    throw new Error(
      `Failed to login user: ${loginRes.statusCode} ${loginRes.body}`
    );
  }

  const { accessToken } = loginRes.json();
  const setCookie = loginRes.headers["set-cookie"] as string;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    accessToken,
    refreshTokenCookie: setCookie
  };
};

export const authHeaders = (
  token: string
): Record<string, string> => ({
  authorization: `Bearer ${token}`
});
