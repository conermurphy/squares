import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { handleAuthRedirect, useFetchData } from '@/utils';
import { CommitsGraph, Languages, RecentRepositories, SEO } from '@/components';
import { useEffect } from 'react';
import { GoCode, GoGitCommit, GoRepo } from 'react-icons/go';
import { useUser } from '@/contexts';

export default function User() {
  const { userData } = useUser();

  const dataHelper = {
    commits: useFetchData({
      method: 'GET',
    }),
    languages: useFetchData({
      method: 'GET',
    }),
    repositories: useFetchData({
      method: 'GET',
    }),
    recentRepos: useFetchData({
      method: 'GET',
    }),
  };

  useEffect(() => {
    async function fetchData() {
      await dataHelper.languages.fetchData({
        endpoint: `/api/repositories/languages`,
      });
    }
    fetchData();
  }, []);

  return (
    <>
      <SEO
        metaTitle="User"
        metaDescription="A breakdown of your commits, languages and recent repositories"
      />
      <div className="flex flex-col gap-9 max-w-full">
        <h1 className="text-4xl font-heading mx-5 md:mx-10 lg:m-0">{`Welcome${
          userData.name ? `, ${userData?.name}` : ''
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
              heading: 'Your Languages',
              description:
                'Your favourite languages across all your repositories',
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
