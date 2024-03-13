import { useCallback, useContext, useState, useEffect, createContext } from 'react';
import { User } from '../api/users/user';
import { getCurrentUser } from '../api/users/users.api';
import { loginWithEmail, logoutUser, registerWithEmail } from '../api/auth/auth.api';

export interface UserContextInterface {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextInterface>({
  user: null,
  isLoading: true,
  login: async (email: string, password: string) => {
    await loginWithEmail(email, password);
  },
  register: async (username: string, email: string, password: string) => {
    await registerWithEmail(email, username, password);
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
    await loginWithEmail(email, password);
    console.log('hi')
    setUser(await getCurrentUser());
    console.log(await getCurrentUser());
  }, []);

  // TODO: Consider the case of Google auth
  const register = useCallback(async (email: string, username: string, password: string) => {
    await registerWithEmail(email, username, password);
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

export const useUserContext = () => useContext(UserContext);