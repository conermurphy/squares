import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { handleAuthRedirect, useFetchData } from '@/utils';
import { CommitsGraph, SEO, Table } from '@/components';
import { GoGitCommit } from 'react-icons/go';
import { useEffect } from 'react';
import { isRepo } from '@/types/types';

export default function Commits() {
  const dataHelper = {
    repoCommits: useFetchData({
      method: 'GET',
    }),
    repos: useFetchData({
      method: 'GET',
    }),
    commits: useFetchData({
      method: 'GET',
    }),
  };

  // Data helper for fetching all repos for the user authenticated
  const { data: reposData, fetchData: reposFetchData } = dataHelper.repos;
  // Data helper for fetching all commits for the repos for the user
  const { fetchData: repoCommitsFetchData } = dataHelper.repoCommits;

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        // Fetch all repos for the user that have been pushed to in the 7 last days
        await reposFetchData({
          endpoint: `/api/commits/repositories`,
        }),
        // Map over all repos returned above and fetch new commits for them if not been fetched today already.
        await Promise.all([
          Array.isArray(reposData) &&
            isRepo(reposData) &&
            reposData.map(async ({ id }) => {
              await repoCommitsFetchData({
                endpoint: `/api/repositories/commits/${id}/1`,
              });
            }),
        ]),
      ]);
    };

    fetchData();
  }, []);

  return (
    <>
      <SEO
        metaTitle="Commits"
        metaDescription="All of your GitHub commits for the last 7 days"
      />
      <div className="flex flex-col gap-9 max-w-full">
        <h1 className="text-4xl font-heading mx-5 md:mx-10 lg:m-0">
          Your Commits
        </h1>
        <CommitsGraph
          headerData={{
            heading: 'Your Commits',
            description: 'Track how your commits compare day to day',
            icon: <GoGitCommit size="25px" />,
          }}
          dataHelper={dataHelper.repoCommits}
        />
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
            heading: 'Commits Breakdown',
            description:
              'See the details behind your commits for the last 7 days',
            icon: <GoGitCommit size="25px" />,
          }}
          type="userCommits"
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (context) => {
  const { redirect, session } = await handleAuthRedirect({
    context,
    path: context?.resolvedUrl,
  });

  return redirect?.destination
    ? { redirect }
    : {
        props: { session },
      };
};
