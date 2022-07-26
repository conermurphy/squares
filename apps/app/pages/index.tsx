import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { handleAuthRedirect, useFetchData } from '@/utils';
import { CommitsGraph, Languages, RecentRepositories, SEO } from '@/components';
import { useEffect } from 'react';
import { isUserSidebar } from '@/types/types';
import { GoCode, GoGitCommit, GoRepo } from 'react-icons/go';

export default function Home() {
  const dataHelper = {
    commits: useFetchData({
      method: 'GET',
    }),
    user: useFetchData({
      method: 'GET',
    }),
    languages: useFetchData({
      method: 'GET',
    }),
    recentRepos: useFetchData({
      method: 'GET',
    }),
  };

  useEffect(() => {
    async function fetchData() {
      await dataHelper.user.fetchData({
        endpoint: `/api/users`,
      });
    }
    fetchData();
  }, []);

  const { data: usersData, loading: usersLoading } = dataHelper.user;

  return (
    <>
      <SEO
        metaTitle="Commits"
        metaDescription="All of your GitHub commits for the last 7 days"
      />
      <div className="flex flex-col gap-9 max-w-full">
        <h1 className="text-4xl font-heading mx-5 md:mx-10 lg:m-0">{`Welcome${
          !usersLoading &&
          usersData &&
          typeof usersData !== 'number' &&
          isUserSidebar(usersData)
            ? `, ${usersData?.name}`
            : ''
        }`}</h1>
        <CommitsGraph
          headerData={{
            heading: 'Your Commits',
            description: 'Track how your commits compare day to day',
            icon: <GoGitCommit size="25px" />,
          }}
          dataHelper={dataHelper.commits}
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
          <RecentRepositories
            headerData={{
              heading: 'Recent Repositories',
              description: 'Your recent pushed to repositories',
              icon: <GoRepo size="20px" />,
            }}
            dataHelper={dataHelper.recentRepos}
          />
        </div>
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
