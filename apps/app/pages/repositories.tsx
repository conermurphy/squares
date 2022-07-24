import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { GoCode, GoGitCommit, GoOrganization, GoRepo } from 'react-icons/go';
import { Contributors, Languages, SEO, Table } from '../components';
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
      <div className="flex flex-col gap-9">
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
        <div className="grid grid-cols-2 gap-9">
          <Languages
            headerData={{
              heading: 'Language Breakdown',
              description: 'This  repositories languages breakdown',
              icon: <GoCode size="20px" />,
            }}
            dataHelper={dataHelper.languages}
          />
          <div className="grid grid-cols-1">
            <Contributors
              headerData={{
                heading: 'Contributers',
                description: 'Everyone who’s contributed to this repo',
                icon: <GoOrganization size="20px" />,
              }}
              dataHelper={dataHelper.contributors}
            />
          </div>
        </div>

        {/* {prsData && Object.keys(prsData)?.length && isPullRequest(prsData)
        ? prsData.slice(0, 10).map((pr) => <p key={pr.id}>{pr.title}</p>)
        : null}  */}

        <Table
          headings={[
            'Commit SHA',
            'Repository',
            'Commit Date',
            'Changes',
            '🔗',
          ]}
          data={dataHelper.commits.data || null}
          tableHeaderData={{
            heading: 'Repository Commits Breakdown',
            description:
              'The details behind this repositories commits over the last 21 days',
            icon: <GoGitCommit size="25px" />,
          }}
          dataFetch={dataHelper.commits.fetchData}
          type="commits"
          loading={dataHelper.commits.loading}
        />
      </div>
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
