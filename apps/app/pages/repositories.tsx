import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { GoGitCommit, GoRepo } from 'react-icons/go';
import { SEO, Table } from '../components';
import { isCommit, isContributor, isPullRequest, isRepo } from '../types/types';
import { getUserAuth, handleAuthRedirect, useFetchData } from '../utils';

export default function Repositories() {
  const [selectedRepoId, setSelectedRepoId] = useState(0);
  const repoState = { selectedRepoId, setSelectedRepoId };

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
    if (!selectedRepoId) return;
    async function clickHandler() {
      await Promise.all([
        await languagesFetchData({
          endpoint: `/api/repositories/languages/${selectedRepoId}`,
        }),
        await contributorsFetchData({
          endpoint: `/api/repositories/contributors/${selectedRepoId}`,
        }),
        await prsFetchData({
          endpoint: `/api/repositories/prs/${selectedRepoId}`,
        }),
        await commitsFetchData({
          endpoint: `/api/repositories/commits/${selectedRepoId}/1`,
        }),
      ]);
    }

    clickHandler();
  }, [selectedRepoId]);

  return (
    <>
      <SEO
        metaTitle="Repositories"
        metaDescription="See all your GitHub repositories easier than ever."
      />
      <h1 className="text-4xl font-heading mb-6">Your Repositories</h1>
      <Table
        headings={['Repo Name', 'Created', 'Last Updated', '🔗', 'Select']}
        data={reposData && isRepo(reposData) ? reposData : null}
        tableHeaderData={{
          heading: 'Your Repositories',
          description: 'Overview of your repositories',
          icon: <GoRepo size="20px" />,
        }}
        dataFetch={reposFetchData}
        type="repositories"
        loading={reposLoading}
        repoState={repoState}
      />
      {/* <h2 className="text-2xl font-heading font-bold underline text-brand">
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
        : null} */}

      <Table
        headings={['Commit SHA', 'Repository', 'Commit Date', 'Changes', '🔗']}
        data={commitsData && isCommit(commitsData) ? commitsData : null}
        tableHeaderData={{
          heading: 'Repository Commits Breakdown',
          description: 'The details behind this repositories commits',
          icon: <GoGitCommit size="25px" />,
        }}
        dataFetch={commitsFetchData}
        type="commits"
        loading={commitsLoading}
        repoState={repoState}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { redirect } = await handleAuthRedirect({
    context,
    path: context?.resolvedUrl,
  });

  if (redirect?.destination) {
    return { redirect };
  }

  return {
    props: {},
  };
};
