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
type RepoData = {
  totalRepos: number;
  selectedRepoId: number;
  selectedRepoName: string;
  totalRepoCommits: number;
  repoCommitsLoading: boolean;
};

type ContextProps = {
  repoData: RepoData;
  setRepoData: Dispatch<SetStateAction<RepoData>>;
};

const RepositoryContext = createContext<ContextProps>({
  repoData: {
    totalRepos: 0,
    selectedRepoId: 0,
    selectedRepoName: '',
    totalRepoCommits: 0,
    repoCommitsLoading: false,
  },
  setRepoData() {},
});

function RepositoryProvider({ children }: ProviderProps) {
  const [repoData, setRepoData] = useState({
    totalRepos: 0,
    selectedRepoId: 0,
    selectedRepoName: '',
    totalRepoCommits: 0,
    repoCommitsLoading: false,
  });

  const value = useMemo(
    () => ({
      repoData,
      setRepoData,
    }),
    [repoData]
  );

  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  );
}

function useRepository() {
  return useContext(RepositoryContext);
}

export { RepositoryProvider, useRepository };
