import React from 'react';
import { DataHelper, DataSectionHeaderProps } from '@/types/types';
import { useRepository } from '@/contexts';
import { round } from '@/utils';
import { useRouter } from 'next/router';
import DataSectionHeader from '../DataSectionHeader/DataSectionHeader';
import languageColours from '../../assets/languageColours.json';
import SelectRepository from '../SkeletonComponents/SelectRepository';
import NoDataFound from '../SkeletonComponents/NoDataFound';

interface IProps {
  dataHelper: DataHelper;
  headerData: DataSectionHeaderProps;
}

interface IPercentageMakerProps {
  data: { [key: string]: number };
}

const languageColourData = languageColours as {
  [key: string]: { color: string | null; url: string };
};

function percentageMaker({ data }: IPercentageMakerProps): [string, number][] {
  const total = Object.values(data).reduce((acc, cur) => acc + cur, 0);

  return Object.entries(data).map(([key, value]) => [
    key,
    round((value / total) * 100, 2),
  ]);
}

export default function Languages({ dataHelper, headerData }: IProps) {
  const { pathname } = useRouter();

  const isDashboard = !['/repositories', '/commits', '/settings'].includes(
    pathname
  );

  const {
    repoData: { selectedRepoId },
  } = useRepository();

  const { loading, data } = dataHelper;

  const languagesData = data as unknown as { [key: string]: number };

  const skeletonData = {
    CSS: 6841,
    Shell: 150,
    JavaScript: 13580,
    TypeScript: 181084,
    HTML: 1245,
    Java: 7894,
  };

  return (
    <section
      className={`mx-5 md:mx-10 lg:mx-0 ${
        !selectedRepoId && loading ? 'opacity-50' : ''
      }`}
    >
      <DataSectionHeader {...headerData} />
      <div
        className={`flex flex-col gap-3 w-full border border-tableBorder rounded-b-2xl border-t-0 px-10 py-7 min-h-[489px] ${
          (!selectedRepoId && !isDashboard) ||
          (languagesData && !Object.keys(languagesData)?.length)
            ? 'items-center justify-center'
            : ''
        }`}
      >
        {/* If no repository is selected, prompt the user to select one */}
        {!selectedRepoId && !isDashboard ? <SelectRepository /> : null}

        {/* If selected repo and no data and not loading, inform the user */}
        {selectedRepoId &&
        !loading &&
        languagesData &&
        !Object.keys(languagesData)?.length ? (
          <NoDataFound message="No languages data found for this repository." />
        ) : null}

        {/* If data is loading in, show a loading skeleton */}
        {loading
          ? percentageMaker({ data: skeletonData }).map(([key, value], i) => {
              const percentValue = `${value}%`;

              return (
                <div
                  key={i}
                  className="flex flex-col gap-2 opacity-10 animate-pulse"
                >
                  <span>{key}</span>
                  <div className="flex flex-row items-center gap-4">
                    <div className="flex flex-row items-center w-full bg-text rounded-full">
                      <div
                        className="rounded-full p-1.5"
                        style={{
                          width: percentValue,
                          backgroundColor:
                            languageColourData[key]?.color || 'bg-brand',
                        }}
                      />
                    </div>
                    <span className="font-heading text-sm">{percentValue}</span>
                  </div>
                </div>
              );
            })
          : null}

        {/* If data has loaded, show the actual data */}
        {languagesData && !loading
          ? percentageMaker({ data: languagesData })
              .sort(([, aVal], [, bVal]) => (aVal < bVal ? 1 : -1))
              .map(([key, value], i) => {
                const percentValue = `${value}%`;

                return (
                  <div key={i} className="flex flex-col gap-2">
                    <span>{key}</span>
                    <div className="flex flex-row items-center gap-4">
                      <div className="flex flex-row items-center w-full bg-text rounded-full">
                        <div
                          className="rounded-full p-1.5"
                          style={{
                            width: percentValue,
                            backgroundColor:
                              languageColourData[key]?.color || 'bg-brand',
                          }}
                        />
                      </div>
                      <span className="font-heading text-sm">
                        {percentValue}
                      </span>
                    </div>
                  </div>
                );
              })
          : null}
      </div>
    </section>
  );
}
