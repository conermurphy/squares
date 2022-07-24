import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { GoGitCommit, GoRepo } from 'react-icons/go';
import { SEO, Table } from '../components';
import { useRepository } from '../contexts';
import { handleAuthRedirect, useFetchData } from '../utils';

export default function Repositories() {
  const { repoData } = useRepository();

  const dataHelper = {
    commits: useFetchData({
      method: 'GET',
    }),
    prs: useFetchData({
      method: 'GET',
    }),
    languages: useFetchData({
      method: 'GET',
    }),
    repos: useFetchData({
      method: 'GET',
    }),
    contributors: useFetchData({
      method: 'GET',
    }),
  };

  useEffect(() => {
    if (!repoData.selectedRepoId) return;
    async function clickHandler() {
      await Promise.all([
        await dataHelper.languages.fetchData({
          endpoint: `/api/repositories/languages/${repoData.selectedRepoId}`,
        }),
        await dataHelper.contributors.fetchData({
          endpoint: `/api/repositories/contributors/${repoData.selectedRepoId}`,
        }),
        await dataHelper.prs.fetchData({
          endpoint: `/api/repositories/prs/${repoData.selectedRepoId}`,
        }),
      ]);
    }

    clickHandler();
  }, [repoData]);

  return (
    <>
      <SEO
        metaTitle="Repositories"
        metaDescription="See all your GitHub repositories easier than ever."
      />
      <h1 className="text-4xl font-heading mb-6">Your Repositories</h1>
      <Table
        headings={['Repo Name', 'Created', 'Last Updated', '🔗', '✅']}
        data={dataHelper.repos.data || null}
        tableHeaderData={{
          heading: 'Your Repositories',
          description: 'Overview of your repositories',
          icon: <GoRepo size="20px" />,
        }}
        dataFetch={dataHelper.repos.fetchData}
        type="repositories"
        loading={dataHelper.repos.loading}
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
        data={dataHelper.commits.data || null}
        tableHeaderData={{
          heading: 'Repository Commits Breakdown',
          description: 'The details behind this repositories commits',
          icon: <GoGitCommit size="25px" />,
        }}
        dataFetch={dataHelper.commits.fetchData}
        type="commits"
        loading={dataHelper.commits.loading}
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
