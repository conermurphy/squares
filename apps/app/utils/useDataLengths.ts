import { useEffect } from 'react';
import { useRepository } from '@/contexts';
import useFetchData from './useFetchData';

export default function useDataLengths() {
  const { repoData } = useRepository();

  const dataHelper = {
    commits: useFetchData({
      method: 'GET',
    }),
    repos: useFetchData({
      method: 'GET',
    }),
  };

  useEffect(() => {
    async function fetchData() {
      await Promise.all([
        await dataHelper.repos.fetchData({
          endpoint: `/api/repositories/count`,
        }),
        await dataHelper.commits.fetchData({
          endpoint: `/api/repositories/commits/count/${repoData.selectedRepoId}`,
        }),
      ]);
    }

    fetchData();
  }, [repoData.selectedRepoId]);

  return {
    reposLength:
      typeof dataHelper.repos.data === 'number' ? dataHelper.repos.data : 0,
    commitsLength:
      typeof dataHelper.commits.data === 'number' ? dataHelper.commits.data : 0,
  };
}
