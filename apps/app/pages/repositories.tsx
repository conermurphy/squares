import { GetServerSideProps } from 'next';
import {
  GoCode,
  GoGitCommit,
  GoGraph,
  GoOrganization,
  GoRepo,
} from 'react-icons/go';
import { handleAuthRedirect, useFetchData } from '@/utils';
import { RepositoryProvider } from '@/contexts';
import { Contributors, Languages, SEO, Statistics, Table } from '../components';

export default function Repositories() {
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
    statistics: useFetchData({
      method: 'GET',
    }),
  };

  return (
    <RepositoryProvider>
      <SEO
        metaTitle="Repositories"
        metaDescription="See all your GitHub repositories easier than ever."
      />
      <div className="flex flex-col gap-9 max-w-full">
        <h1 className="text-4xl font-heading mx-5 md:mx-10 lg:m-0">
          Your Repositories
        </h1>
        <Table
          headings={['Repo Name', 'Created', 'Last Updated', '🔗', '✅']}
          dataHelper={dataHelper.repos}
          tableHeaderData={{
            heading: 'Your Repositories',
            description: 'Overview of your repositories',
            icon: <GoRepo size="20px" />,
          }}
          type="repositories"
        />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-9">
          <Languages
            headerData={{
              heading: 'Language Breakdown',
              description: 'This repositories languages breakdown',
              icon: <GoCode size="20px" />,
            }}
            dataHelper={dataHelper.languages}
          />
          <div className="grid grid-cols-1 gap-9 content-center">
            <Statistics
              headerData={{
                heading: 'Statistics',
                description: 'This repo in numbers',
                icon: <GoGraph size="20px" />,
              }}
              dataHelper={[dataHelper.statistics, dataHelper.prs]}
            />
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
        <Table
          headings={[
            'Commit SHA',
            'Repository',
            'Commit Date',
            'Changes',
            '🔗',
          ]}
          dataHelper={dataHelper.commits}
          tableHeaderData={{
            heading: 'Repository Commits Breakdown',
            description:
              'The details behind this repositories commits over the last 21 days',
            icon: <GoGitCommit size="25px" />,
          }}
          type="commits"
        />
      </div>
    </RepositoryProvider>
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
