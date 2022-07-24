import React, { useEffect, useState } from 'react';
import { useRepository } from '../../../../contexts';
import { DataHelper } from '../../../../types/types';
import { useDataLengths } from '../../../../utils';

interface IProps {
  dataFetch: DataHelper['fetchData'];
  type: 'repositories' | 'commits';
}

export default function TablePagination({
  dataFetch,
  type,
}: IProps): JSX.Element {
  const [pageNumber, setPageNumber] = useState(1);

  const { repoData } = useRepository();

  const { reposLength, commitsLength } = useDataLengths();

  const dataLength = type === 'repositories' ? reposLength : commitsLength;

  const totalPages = Math.round(
    dataLength / parseInt(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)
  );

  useEffect(() => {
    const fetchData = async () => {
      if (type === 'repositories') {
        await dataFetch({ endpoint: `/api/repositories/${pageNumber}` });
      }
    };

    fetchData();
  }, [pageNumber]);

  useEffect(() => {
    if (type === 'commits') {
      setPageNumber(1);
    }
  }, [repoData.selectedRepoId]);

  useEffect(() => {
    const fetchData = async () => {
      if (type === 'commits' && repoData.selectedRepoId) {
        await dataFetch({
          endpoint: `/api/repositories/commits/${repoData.selectedRepoId}/${pageNumber}`,
        });
      }
    };

    fetchData();
  }, [pageNumber, repoData.selectedRepoId]);

  const buttonStyles =
    'border border-text px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="flex flex-row items-center justify-between px-10 py-4 border border-tableBorder rounded-b-2xl bg-tableAccent">
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
      {(totalPages && type === 'commits') || type === 'repositories' ? (
        <p className="opacity-75">{`Page ${pageNumber} of ${totalPages}`}</p>
      ) : null}
      <button
        type="button"
        className={buttonStyles}
        disabled={pageNumber === totalPages || !dataLength}
        onClick={() => {
          setPageNumber(pageNumber + 1);
        }}
      >
        Next
      </button>
    </div>
  );
}
