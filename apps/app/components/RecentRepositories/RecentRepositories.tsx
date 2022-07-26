import React, { useEffect } from 'react';
import { DataHelper, DataSectionHeaderProps, isRepo } from '@/types/types';
import { GoEye, GoRepoForked, GoStar } from 'react-icons/go';
import { Repository } from '@prisma/client';
import DataSectionHeader from '../DataSectionHeader/DataSectionHeader';

interface IProps {
  dataHelper: DataHelper;
  headerData: DataSectionHeaderProps;
}

function RepositoryCard({ data }: { data: Repository }) {
  return (
    <div className="flex flex-col gap-3 flex-wrap bg-accent rounded-xl px-5 py-4">
      <p className="font-heading text-xl" style={{ overflowWrap: 'anywhere' }}>
        {data.name}
      </p>
      <p>Last pushed: {new Date(data.pushedAt).toLocaleDateString()}</p>
      <div className="flex flex-row flex-wrap items-center gap-5">
        <div className="flex flex-row gap-2">
          <GoStar size="25px" />
          <p className="font-heading opacity-75">{data.starsCount}</p>
        </div>
        <div className="flex flex-row gap-2">
          <GoRepoForked size="25px" />
          <p className="font-heading opacity-75">{data.forksCount}</p>
        </div>
        <div className="flex flex-row gap-2">
          <GoEye size="25px" />
          <p className="font-heading opacity-75">{data.watchersCount}</p>
        </div>
      </div>
    </div>
  );
}

const skeletonData = {
  id: Math.random(),
  name: 'Repository Name',
  createdAt: new Date('2022-07-06T05:43:35.000Z'),
  pushedAt: new Date('2022-07-06T05:43:35.000Z'),
  updatedAt: new Date('2022-07-06T05:43:35.000Z'),
  starCount: 10,
  forksCount: 3,
  watchersCount: 7,
  starsCount: 0,
  nodeId: 'jfkdjfkj',
  userId: 'jfkdjfkj',
  url: '',
  languages: '',
};

export default function RecentRepositories({ dataHelper, headerData }: IProps) {
  const { loading, data, fetchData } = dataHelper;

  useEffect(() => {
    async function dataLoad() {
      await fetchData({
        endpoint: `/api/repositories/recent`,
      });
    }

    dataLoad();
  }, []);

  return (
    <section className={`mx-5 md:mx-10 lg:mx-0 ${loading ? 'opacity-50' : ''}`}>
      <DataSectionHeader {...headerData} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full border border-tableBorder rounded-b-2xl border-t-0 px-10 py-7 min-h-[508px]">
        {/* If data is loading in, show a loading skeleton */}
        {loading
          ? Array.from({
              length: 6,
            }).map((_, i) => <RepositoryCard data={skeletonData} key={i} />)
          : null}

        {/* If there is data and is an array, display the users in a grid */}
        {Array.isArray(data) && isRepo(data)
          ? data.map((repo) => <RepositoryCard data={repo} key={repo.id} />)
          : null}
      </div>
    </section>
  );
}
