import { Contributor, Repository } from '@prisma/client';
import { GetServerSideProps } from 'next';
import {
  fetchRepositories,
  getUserAuth,
  handleAuthRedirect,
  useFetchData,
} from '../utils';

interface IProps {
  repos: Repository[];
  githubLogin: string;
}

export default function Repositories({ repos, githubLogin }: IProps) {
  // language data fetching
  const {
    error: languagesError,
    loading: languagesLoading,
    data: langaugeData,
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

  async function clickHandler({ id }: { id: number }) {
    await languagesFetchData({
      endpoint: `/api/repositories/languages/${id}`,
    });

    await contributorsFetchData({
      endpoint: `/api/repositories/contributors/${id}`,
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold underline text-brand">
        Your Repositories
      </h1>
      {repos.map(({ name, createdAt, pushedAt, url, id }: Repository) => (
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

  const { octokit, login, ...props } = await getUserAuth({ session });

  const repos = await fetchRepositories({
    octokit,
    login,
    userId: props?.userId,
  });

  return {
    props: { repos, githubLogin: login },
  };
};
