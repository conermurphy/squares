import React, { useEffect } from 'react';
import { DataHelper, DataSectionHeaderProps, isRepo } from '@/types/types';
import { GoEye, GoRepoForked, GoStar } from 'react-icons/go';
import { Repository } from '@prisma/client';
import Link from 'next/link';
import DataSectionHeader from '../DataSectionHeader/DataSectionHeader';

interface IProps {
  dataHelper: DataHelper;
  headerData: DataSectionHeaderProps;
}

function RepositoryCard({ data }: { data: Repository }) {
  return (
    <Link href={data.url} passHref>
      <a className="flex flex-col gap-3 flex-wrap bg-accent rounded-xl px-5 py-4">
        <p
          className="font-heading text-xl"
          style={{ overflowWrap: 'anywhere' }}
        >
          {data.name}
        </p>
        <p>
          Last pushed: {new Date(data.pushedAt).toLocaleDateString('en-US')}
        </p>
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
      </a>
    </Link>
  );
}

const skeletonData = {
  id: Math.random(),
  name: 'Repository Name',
  createdAt: '2022-07-06T05:43:35.000Z' as unknown as Date,
  pushedAt: '2022-07-06T05:43:35.000Z' as unknown as Date,
  updatedAt: '2022-07-06T05:43:35.000Z' as unknown as Date,
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
    <section
      className={`mx-5 md:mx-10 lg:mx-0 ${
        loading ? 'opacity-50 animate-pulse pointer-events-none' : ''
      }`}
    >
      <DataSectionHeader {...headerData} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full border border-tableBorder rounded-b-2xl border-t-0 px-10 py-7 min-h-[508px]">
        {/* If data is loading in, show a loading skeleton */}
        {loading || !data
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
