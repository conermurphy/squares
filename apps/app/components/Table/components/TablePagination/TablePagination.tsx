import React, { useEffect } from 'react';
import { useRepository } from '@/contexts';
import { DataHelper } from '@/types/types';

interface IProps {
  dataHelper: DataHelper;
  type: 'repositories' | 'commits' | 'userCommits';
  pageState: {
    pageNumber: number;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  };
}

export default function TablePagination({
  dataHelper,
  type,
  pageState,
}: IProps): JSX.Element {
  const { pageNumber, setPageNumber } = pageState;

  const { repoData, setRepoData } = useRepository();

  const { fetchData: dataFetch, data } = dataHelper;

  const dataLength =
    (data && typeof data !== 'number' && Array.isArray(data) && data.length) ||
    0;

  const totalPages = Math.ceil(
    dataLength / parseInt(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)
  );

  useEffect(() => {
    const fetchData = async () => {
      if (type === 'repositories') {
        await dataFetch({ endpoint: `/api/repositories` });
        setRepoData({
          ...repoData,
          totalRepos: dataLength,
        });
      }
    };

    fetchData();
  }, [pageNumber]);

  useEffect(() => {
    if (type === 'commits') {
      setPageNumber(1);
    }
  }, [repoData.selectedRepoId, type]);

  useEffect(() => {
    const fetchData = async () => {
      if (type === 'commits' && repoData.selectedRepoId) {
        if (pageNumber === 1) {
          setRepoData({
            ...repoData,
            repoCommitsLoading: true,
          });
        }
        await dataFetch({
          endpoint: `/api/repositories/commits/${repoData.selectedRepoId}`,
        }).then(() => {
          setRepoData({
            ...repoData,
            repoCommitsLoading: false,
          });
        });
      }
      if (type === 'userCommits') {
        await dataFetch({
          endpoint: `/api/commits`,
        });
      }
    };

    fetchData();
  }, [pageNumber, repoData.selectedRepoId]);

  const buttonStyles =
    'border border-text px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="sticky left-0 bottom-0 flex flex-row items-center justify-between px-10 py-4 border border-tableBorder rounded-b-2xl bg-tableAccent">
      <button
        type="button"
        className={buttonStyles}
        disabled={pageNumber === 1 || !dataLength}
        onClick={() => {
          setPageNumber(pageNumber - 1);
        }}
      >
        Previous
      </button>
      {totalPages ? (
        <p className="hidden md:flex opacity-75">{`Page ${pageNumber} of ${totalPages}`}</p>
      ) : null}
      <button
        type="button"
        className={buttonStyles}
        disabled={pageNumber === totalPages || !dataLength || totalPages <= 1}
        onClick={() => {
          setPageNumber(pageNumber + 1);
        }}
      >
        Next
      </button>
    </div>
  );
}
