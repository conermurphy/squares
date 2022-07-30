import React, { useEffect, useState } from 'react';
import { useDataLengths } from '@/utils';
import { useRepository } from '@/contexts';
import { DataHelper } from '@/types/types';

interface IProps {
  dataFetch: DataHelper['fetchData'];
  type: 'repositories' | 'commits' | 'userCommits';
}

export default function TablePagination({
  dataFetch,
  type,
}: IProps): JSX.Element {
  const [pageNumber, setPageNumber] = useState(1);

  const { repoData, setRepoData } = useRepository();

  const { reposLength, commitsLength, userCommitsLength } = useDataLengths({
    type,
  });

  let dataLength = 0;

  switch (type) {
    case 'repositories':
      dataLength = reposLength;
      break;
    case 'commits':
      dataLength = commitsLength;
      break;
    case 'userCommits':
      dataLength = userCommitsLength;
      break;
    default:
      break;
  }

  const totalPages = Math.ceil(
    dataLength / parseInt(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)
  );

  useEffect(() => {
    const fetchData = async () => {
      if (type === 'repositories') {
        await dataFetch({ endpoint: `/api/repositories/${pageNumber}` });
        setRepoData({
          ...repoData,
          totalRepos: reposLength,
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
          endpoint: `/api/repositories/commits/${repoData.selectedRepoId}/${pageNumber}`,
        }).then(() => {
          setRepoData({
            ...repoData,
            repoCommitsLoading: false,
          });
        });
      }
      if (type === 'userCommits') {
        await dataFetch({
          endpoint: `/api/commits/${pageNumber}`,
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
