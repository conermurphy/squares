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

  async function fetchCommitLength() {
    await dataHelper.commits.fetchData({
      endpoint: `/api/repositories/commits/count/${repoData.selectedRepoId}`,
    });
  }

  async function fetchRepoLength() {
    await dataHelper.repos.fetchData({
      endpoint: `/api/repositories/count`,
    });
  }

  useEffect(() => {
    async function fetchData() {
      if (type !== 'userCommits') {
        await Promise.all([fetchRepoLength(), fetchCommitLength()]);
      } else {
        await dataHelper.userCommits.fetchData({
          endpoint: `/api/commits/count/`,
        });
      }
    }

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
    dataFetchers: {
      fetchCommitLength,
      fetchRepoLength,
    },
  };
}
