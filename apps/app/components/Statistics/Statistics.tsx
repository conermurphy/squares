import React, { useEffect } from 'react';
import {
  GoEye,
  GoGitCommit,
  GoGitPullRequest,
  GoOrganization,
  GoRepoForked,
  GoStar,
} from 'react-icons/go';
import {
  DataHelper,
  DataSectionHeaderProps,
  isStatistics,
  StatGridProps,
} from '@/types/types';
import { useRepository } from '@/contexts';
import DataSectionHeader from '../DataSectionHeader/DataSectionHeader';
import SelectRepository from '../SkeletonComponents/SelectRepository';

interface IProps {
  dataHelper: DataHelper[];
  headerData: DataSectionHeaderProps;
}

type StatHelper = { [key: string]: { title: string; icon: JSX.Element } };

const statHelper: StatHelper = {
  watchers: {
    title: 'Watchers',
    icon: <GoEye size="23px" />,
  },
  stars: {
    title: 'Stars',
    icon: <GoStar size="23px" />,
  },
  forks: {
    title: 'Forks',
    icon: <GoRepoForked size="23px" />,
  },
  contributors: {
    title: 'Contributors',
    icon: <GoOrganization size="23px" />,
  },
  pullRequests: {
    title: 'Pull Requests',
    icon: <GoGitPullRequest size="23px" />,
  },
  commits: {
    title: 'Commits*',
    icon: <GoGitCommit size="23px" />,
  },
};

const skeletonData = {
  commits: 0,
  pullRequests: 0,
  contributors: 0,
  forks: 0,
  stars: 0,
  watchers: 0,
};

function StatGrid({ data }: StatGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-6">
      {data &&
        Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-2">
            <p className="font-heading text-lg">{statHelper[key].title}</p>
            <div className="flex flex-row gap-2 opacity-75">
              {statHelper[key].icon}
              <span className="font-heading">{value}</span>
            </div>
          </div>
        ))}
    </div>
  );
}

export default function Statistics({ dataHelper, headerData }: IProps) {
  const {
    repoData: { selectedRepoId, repoCommitsLoading },
  } = useRepository();

  const { loading, data, fetchData } = dataHelper[0];
  const { loading: prsLoading, fetchData: prsFetchData } = dataHelper[1];

  useEffect(() => {
    if (!selectedRepoId && !repoCommitsLoading) return;
    async function dataLoad() {
      await Promise.all([
        await prsFetchData({
          endpoint: `/api/repositories/prs/${selectedRepoId}`,
        }),
        await fetchData({
          endpoint: `/api/repositories/statistics/${selectedRepoId}`,
        }),
      ]);
    }

    dataLoad();
  }, [selectedRepoId, repoCommitsLoading]);

  return (
    <section
      className={`mx-5 md:mx-10 lg:mx-0 ${!selectedRepoId ? 'opacity-50' : ''}`}
    >
      <DataSectionHeader {...headerData} />
      <div className="flex flex-row flex-wrap gap-3 w-full border border-tableBorder rounded-b-2xl border-t-0 px-10 py-7 min-h-[200px]">
        {/* If data is not loading and no repository is selected, prompt the user to select one */}
        {!selectedRepoId ? <SelectRepository isSmall /> : null}

        {/* If data is loading in, show a loading skeleton */}
        {loading || repoCommitsLoading || prsLoading ? (
          <div className="opacity-10 animate-pulse w-full">
            <StatGrid data={skeletonData} />
          </div>
        ) : null}

        {/* Insert actual data rendering here */}
        {!repoCommitsLoading &&
        !prsLoading &&
        selectedRepoId &&
        data &&
        isStatistics(data) ? (
          <StatGrid data={data} />
        ) : null}
      </div>
    </section>
  );
}
