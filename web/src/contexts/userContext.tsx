import { useCallback, useState, useEffect, createContext } from 'react';
import { User } from '../api/users/user';
import { getCurrentUser } from '../api/users/users.api';
import { RegisterError, loginWithEmail, logoutUser, registerWithEmail } from '../api/auth/auth.api';

export interface UserContextInterface {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<number>;
  register: (email: string, username: string, password: string) => Promise<null | [number, RegisterError]>;
  logout: () => void;
}

export const UserContext = createContext<UserContextInterface>({
  user: null,
  isLoading: true,
  login: async (email: string, password: string) => {
    return await loginWithEmail(email, password);
  },
  register: async (email: string, username: string, password: string) => {
    return await registerWithEmail(email, username, password);
  },
  logout: async () => {
    await logoutUser();
  }
});

export function UserProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    })();
    setIsLoading(false);
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const status = await loginWithEmail(email, password);
    setUser(await getCurrentUser());
    return status
  }, []);

  // TODO: Consider the case of Google auth
  const register = useCallback(async (email: string, username: string, password: string) => {
    return await registerWithEmail(email, username, password);
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return (<UserContext.Provider
    value={{
      user,
      isLoading,
      login,
      register,
      logout
    }}>
    {children}
  </UserContext.Provider >)
}