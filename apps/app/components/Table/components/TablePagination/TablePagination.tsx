import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface IProps {
  dataFetch: ({ endpoint }: { endpoint: string }) => Promise<void>;
  dataLength: number;
  type: 'repositories' | 'commits';
  repoState: {
    selectedRepoId: number;
    setSelectedRepoId: Dispatch<SetStateAction<number>>;
  };
}

export default function TablePagination({
  dataFetch,
  dataLength,
  type,
  repoState,
}: IProps): JSX.Element {
  const [pageNumber, setPageNumber] = useState(1);

  const totalPages = Math.round(
    dataLength / parseInt(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)
  );

  useEffect(() => {
    const fetchData = async () => {
      if (type === 'repositories') {
        await dataFetch({ endpoint: `/api/repositories/${pageNumber}` });
      }

      if (type === 'commits' && repoState.selectedRepoId) {
        await dataFetch({
          endpoint: `/api/repositories/commits/${repoState.selectedRepoId}/${pageNumber}`,
        });
      }
    };

    fetchData();
  }, [pageNumber]);

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
      <p className="opacity-75">{`Page ${pageNumber} of ${totalPages}`}</p>
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
