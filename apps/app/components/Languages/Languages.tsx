import React, { useEffect } from 'react';
import { GoInfo } from 'react-icons/go';
import { useRepository } from '../../contexts';
import { DataHelper, DataSectionHeaderProps } from '../../types/types';
import DataSectionHeader from '../DataSectionHeader/DataSectionHeader';
import languageColours from '../../assets/languageColours.json';

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

function round(value: number, precision: number) {
  const multiplier = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function percentageMaker({ data }: IPercentageMakerProps): [string, number][] {
  const total = Object.values(data).reduce((acc, cur) => acc + cur, 0);

  return Object.entries(data).map(([key, value]) => [
    key,
    round((value / total) * 100, 2),
  ]);
}

export default function Languages({ dataHelper, headerData }: IProps) {
  const {
    repoData: { selectedRepoId },
  } = useRepository();

  const { loading, data, fetchData } = dataHelper;

  const languagesData = data as unknown as { [key: string]: number };

  useEffect(() => {
    if (!selectedRepoId) return;
    async function dataLoad() {
      await fetchData({
        endpoint: `/api/repositories/languages/${selectedRepoId}`,
      });
    }

    dataLoad();
  }, [selectedRepoId]);

  const skeletonData = {
    CSS: 6841,
    Shell: 150,
    JavaScript: 13580,
    TypeScript: 181084,
    HTML: 1245,
    Java: 7894,
  };

  return (
    <section className={!selectedRepoId ? 'opacity-50' : ''}>
      <DataSectionHeader {...headerData} />
      <div
        className={`flex flex-col gap-3 w-full border border-tableBorder rounded-b-2xl border-t-0 px-10 py-7 min-h-[429px] ${
          !selectedRepoId ? 'items-center justify-center' : ''
        }`}
      >
        {/* If data is not loading and no repository is selected, prompt the user to select one */}
        {!selectedRepoId ? (
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <div className="rounded-full bg-accent p-4">
              <GoInfo size="35px" />
            </div>
            <p className="font-heading text-2xl">
              Please select a repository to look up.
            </p>
          </div>
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

        {/* If data is loading in, show a loading skeleton */}
        {languagesData && !loading
          ? percentageMaker({ data: languagesData }).map(([key, value], i) => {
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
                    <span className="font-heading text-sm">{percentValue}</span>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </section>
  );
}
