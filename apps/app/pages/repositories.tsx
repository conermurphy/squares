import { Repository } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { isCommit, isContributor, isPullRequest, isRepo } from '../types/types';
import { getUserAuth, handleAuthRedirect, useFetchData } from '../utils';

interface IProps {
  githubLogin: string;
}

export default function Repositories({ githubLogin }: IProps) {
  // language data fetching
  const {
    error: reposError,
    loading: reposLoading,
    data: reposData,
    message: reposMessage,
    fetchData: reposFetchData,
  } = useFetchData({
    method: 'GET',
  });

  // language data fetching
  const {
    error: languagesError,
    loading: languagesLoading,
    data: languagesData,
    message: languagesMessage,
    fetchData: languagesFetchData,
  } = useFetchData({
    method: 'GET',
  });

  // contributors data fetching
  const {
    error: contributorsError,
    loading: contributorsLoading,
    data: contributorsData,
    message: contributorsMessage,
    fetchData: contributorsFetchData,
  } = useFetchData({
    method: 'GET',
  });

  // PRs data fetching
  const {
    error: prsError,
    loading: prsLoading,
    data: prsData,
    message: prsMessage,
    fetchData: prsFetchData,
  } = useFetchData({
    method: 'GET',
  });

  // Commits data fetching
  const {
    error: commitsError,
    loading: commitsLoading,
    data: commitsData,
    message: commitsMessage,
    fetchData: commitsFetchData,
  } = useFetchData({
    method: 'GET',
  });

  useEffect(() => {
    async function fetchData() {
      await reposFetchData({
        endpoint: `/api/repositories`,
      });
    }
    fetchData();
  }, []);

  async function clickHandler({ id }: { id: number }) {
    await Promise.all([
      await languagesFetchData({
        endpoint: `/api/repositories/languages/${id}`,
      }),
      await contributorsFetchData({
        endpoint: `/api/repositories/contributors/${id}`,
      }),
      await prsFetchData({
        endpoint: `/api/repositories/prs/${id}`,
      }),
      await commitsFetchData({
        endpoint: `/api/repositories/commits/${id}`,
      }),
    ]);
  }

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold underline text-brand">
        Your Repositories
      </h1>
      {reposData &&
        isRepo(reposData) &&
        reposData.map(({ name, createdAt, pushedAt, url, id }: Repository) => (
          <button
            key={name}
            className="flex flex-row gap-8"
            type="button"
            onClick={() => clickHandler({ id })}
          >
            <p>{id}</p>
            <p>{name}</p>
            <p>{createdAt}</p>
            <p>{pushedAt}</p>
            <a href={url}>GitHub Link</a>
          </button>
        ))}

      <h2 className="text-2xl font-heading font-bold underline text-brand">
        Contributions
      </h2>
      {contributorsData && isContributor(contributorsData)
        ? contributorsData.map((contributor) => (
            <p key={contributor.id}>{contributor.login}</p>
          ))
        : null}

      <h2 className="text-2xl font-heading font-bold underline text-brand">
        Languages
      </h2>
      {languagesData
        ? Object.entries(languagesData).map(([lang, val]: [string, number]) => (
            <p key={lang}>
              {lang}: {val}
            </p>
          ))
        : null}

      <h2 className="text-2xl font-heading font-bold underline text-brand">
        Pull Requests
      </h2>
      {prsData && Object.keys(prsData)?.length && isPullRequest(prsData)
        ? prsData.slice(0, 10).map((pr) => <p key={pr.id}>{pr.title}</p>)
        : null}

      <h2 className="text-2xl font-heading font-bold underline text-brand">
        Commits
      </h2>
      {commitsData && Object.keys(commitsData)?.length && isCommit(commitsData)
        ? commitsData
            .slice(0, 10)
            .map((commit) => <p key={commit.id}>{commit.sha}</p>)
        : null}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { session, redirect } = await handleAuthRedirect({
    context,
    path: context?.resolvedUrl,
  });

  if (redirect?.destination) {
    return { redirect };
  }

  const { login } = await getUserAuth({ session });

  return {
    props: { githubLogin: login },
  };
};
