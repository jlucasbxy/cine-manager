import type { UserDTO } from "@repo/dtos";
import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useState } from "react";
import { clearAccessToken, setAccessToken } from "@/lib/api-client";
import * as authService from "@/services/auth.service";

interface AuthContextValue {
  user: UserDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: {
    name?: string;
    password?: string;
    avatarUrl?: string | null;
  }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUser(): UserDTO | null {
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UserDTO;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(true);

  const saveUser = useCallback((userData: UserDTO | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function restoreSession() {
      try {
        const result = await authService.refreshTokens();
        if (!cancelled) {
          setAccessToken(result.accessToken, result.expiresIn);
          const userData = await authService.getMe();
          saveUser(userData);
        }
      } catch {
        if (!cancelled) {
          clearAccessToken();
          saveUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    restoreSession();
    return () => {
      cancelled = true;
    };
  }, [saveUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authService.login(email, password);
      setAccessToken(result.accessToken, result.expiresIn);
      const userData = await authService.getMe();
      saveUser(userData);
    },
    [saveUser]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const userData = await authService.register({
        name,
        email,
        password
      });
      const result = await authService.login(email, password);
      setAccessToken(result.accessToken, result.expiresIn);
      saveUser(userData);
    },
    [saveUser]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    }
    clearAccessToken();
    saveUser(null);
  }, [saveUser]);

  const updateUser = useCallback(
    async (data: {
      name?: string;
      password?: string;
      avatarUrl?: string | null;
    }) => {
      const updatedUser = await authService.updateUser(data);
      saveUser(updatedUser);
    },
    [saveUser]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !isLoading,
        isLoading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
