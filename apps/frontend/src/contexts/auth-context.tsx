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

let restoreSessionPromise: Promise<UserDTO | null> | null = null;

function getStoredUser(): UserDTO | null {
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UserDTO;
  } catch {
    return null;
  }
}

async function restoreAuthSession(): Promise<UserDTO | null> {
  if (restoreSessionPromise) {
    return restoreSessionPromise;
  }

  restoreSessionPromise = (async () => {
    try {
      const result = await authService.refreshTokens();
      setAccessToken(result.accessToken, result.expiresIn);
      return await authService.getMe();
    } catch {
      clearAccessToken();
      return null;
    } finally {
      restoreSessionPromise = null;
    }
  })();

  return restoreSessionPromise;
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
    let isActive = true;
    async function initializeAuth() {
      const restoredUser = await restoreAuthSession();
      if (!isActive) return;
      saveUser(restoredUser);
      setIsLoading(false);
    }
    void initializeAuth();
    return () => {
      isActive = false;
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
