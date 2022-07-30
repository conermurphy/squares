import { useEffect } from 'react';
import { useRepository } from '@/contexts';
import useFetchData from './useFetchData';

interface IProps {
  type: 'repositories' | 'commits' | 'userCommits';
}

export default function useDataLengths({ type }: IProps) {
  const { repoData } = useRepository();

  const dataHelper = {
    userCommits: useFetchData({
      method: 'GET',
    }),
    commits: useFetchData({
      method: 'GET',
    }),
    repos: useFetchData({
      method: 'GET',
    }),
  };

  async function fetchData() {
    if (type !== 'userCommits') {
      await Promise.all([
        await dataHelper.repos.fetchData({
          endpoint: `/api/repositories/count`,
        }),
        await dataHelper.commits.fetchData({
          endpoint: `/api/repositories/commits/count/${repoData.selectedRepoId}`,
        }),
      ]);
    } else {
      await dataHelper.userCommits.fetchData({
        endpoint: `/api/commits/count/`,
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, [repoData.selectedRepoId]);

  return {
    reposLength:
      typeof dataHelper.repos.data === 'number' ? dataHelper.repos.data : 0,
    commitsLength:
      typeof dataHelper.commits.data === 'number' ? dataHelper.commits.data : 0,
    userCommitsLength:
      typeof dataHelper.userCommits.data === 'number'
        ? dataHelper.userCommits.data
        : 0,
    refetchData: fetchData,
  };
}
