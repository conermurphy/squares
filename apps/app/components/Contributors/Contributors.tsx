import React, { useEffect } from 'react';
import Img from 'next/image';
import {
  DataHelper,
  DataSectionHeaderProps,
  isContributor,
} from '@/types/types';
import { useRepository } from '@/contexts';
import { GoInfo } from 'react-icons/go';
import DataSectionHeader from '../DataSectionHeader/DataSectionHeader';
import SelectRepository from '../SkeletonComponents/SelectRepository';

interface IProps {
  dataHelper: DataHelper;
  headerData: DataSectionHeaderProps;
}

export default function Contributors({ dataHelper, headerData }: IProps) {
  const {
    repoData: { selectedRepoId },
  } = useRepository();

  const { loading, data, fetchData } = dataHelper;

  useEffect(() => {
    if (!selectedRepoId) return;
    async function dataLoad() {
      await fetchData({
        endpoint: `/api/repositories/contributors/${selectedRepoId}`,
      });
    }

    dataLoad();
  }, [selectedRepoId]);

  return (
    <section
      className={`mx-5 md:mx-10 lg:mx-0 ${!selectedRepoId ? 'opacity-50' : ''}`}
    >
      <DataSectionHeader {...headerData} />
      <div className="flex flex-row flex-wrap gap-3 w-full border border-tableBorder rounded-b-2xl border-t-0 px-10 py-7 min-h-[150px]">
        {/* If data is not loading and no repository is selected, prompt the user to select one */}
        {!selectedRepoId ? <SelectRepository isSmall /> : null}
        {/* If data is loading in, show a loading skeleton */}
        {loading
          ? Array.from({
              length: 20,
            }).map((_, i) => (
              <div
                key={i}
                className="w-10 h-10 bg-text rounded-full opacity-10 animate-pulse"
              />
            ))
          : null}

        {/* If there is data and is an array, display the users in a grid */}
        {Array.isArray(data) && data?.length && isContributor(data)
          ? data.map((contributor) => (
              <div
                key={contributor.id}
                className="relative w-10 h-10 rounded-full overflow-hidden"
              >
                <a
                  href={contributor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Img src={contributor.imageUrl} layout="fill" />
                </a>
              </div>
            ))
          : null}

        {Array.isArray(data) && !data?.length && !loading ? (
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <div className="rounded-full bg-accent p-4">
              <GoInfo size="25px" />
            </div>
            <p className="font-heading text-xl text-center">
              No contributor data could be found for this repository.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
