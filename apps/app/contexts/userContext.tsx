import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

type ProviderProps = { children: ReactNode };
type UserData = {
  name: string;
  image: string;
  login: string;
  email: string;
  lastFetchRepositories: string;
};

type ContextProps = {
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData>>;
};

const UserContext = createContext<ContextProps>({
  userData: {
    name: '',
    image: '',
    login: '',
    email: '',
    lastFetchRepositories: '',
  },
  setUserData() {},
});

function UserProvider({ children }: ProviderProps) {
  const [userData, setUserData] = useState({
    name: '',
    image: '',
    login: '',
    email: '',
    lastFetchRepositories: '',
  });

  const value = useMemo(
    () => ({
      userData,
      setUserData,
    }),
    [userData]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUser() {
  return useContext(UserContext);
}

export { UserProvider, useUser };
