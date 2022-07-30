import React, { useState } from 'react';
import { GoMarkGithub, GoDiffAdded, GoDiffRemoved } from 'react-icons/go';
import {
  DataHelper,
  DataSectionHeaderProps,
  isCommit,
  isRepo,
  isRowCommit,
} from '@/types/types';
import { useRepository } from '@/contexts';
import DataSectionHeader from '../DataSectionHeader/DataSectionHeader';
import { TablePagination } from './components';
import SelectRepository from '../SkeletonComponents/SelectRepository';
import NoDataFound from '../SkeletonComponents/NoDataFound';

interface IProps {
  headings: string[];
  tableHeaderData: DataSectionHeaderProps;
  type: 'repositories' | 'commits' | 'userCommits';
  dataHelper: DataHelper;
}

export default function Table({
  headings,
  tableHeaderData,
  dataHelper,
  type,
}: IProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const pageState = { pageNumber, setPageNumber };

  const borderClasses = 'border-b border-tableBorder';

  const { setRepoData, repoData } = useRepository();

  const { loading, data } = dataHelper;

  const isTypeCommit = ['userCommits', 'commits'].includes(type);

  return (
    <div className="relative max-w-[100vw] px-5 md:px-10 lg:px-0">
      <section
        className={
          (!repoData.selectedRepoId && type === 'commits') || loading
            ? 'opacity-50 pointer-events-none'
            : ''
        }
      >
        <div className="relative overflow-scroll md:overflow-hidden">
          <div className="sticky top-0 left-0">
            <DataSectionHeader {...tableHeaderData} />
          </div>
          <table className="table-auto 2xl:table-fixed w-max md:w-full border border-tableBorder min-w-full">
            <thead
              className={`bg-tableAccent font-heading text-sm  ${borderClasses}`}
            >
              <tr>
                {/* If not loading, there is data but is empty and commits type, show a message saying there is no commits */}
                {!loading &&
                Array.isArray(data) &&
                !data?.length &&
                isTypeCommit ? (
                  <th className="py-5 opacity-75 text-center">
                    No Commits Found
                  </th>
                ) : null}

                {/* If not loading, no data and commits type, show a message to select a repository */}
                {!loading && !data && isTypeCommit ? (
                  <th className="py-5 opacity-75 text-center">
                    Awaiting Input
                  </th>
                ) : null}

                {/* If loading or there is data, show the headings passed in */}
                {(data && Array.isArray(data) && data?.length) || loading
                  ? headings.map((heading, i, arr) => (
                      <th
                        key={`${heading}-${i}`}
                        className={`text-left py-5 opacity-75  
                ${i === 0 ? 'pl-10 w-88' : ''} 
                ${i !== arr.length - 1 && i !== 0 ? 'w-72' : ''}
                ${i === arr.length - 1 && isTypeCommit ? 'w-24' : ''}
                ${i === arr.length - 1 && type === 'repositories' ? 'w-28' : ''}
                ${i === arr.length - 2 && type === 'repositories' ? 'w-36' : ''}
                `}
                      >
                        {heading}
                      </th>
                    ))
                  : null}
              </tr>
            </thead>
            <tbody className="h-[455px]">
              {/* If not loading, no data and commits type, show a message to select a repository */}
              {!loading && !data && isTypeCommit ? (
                <tr>
                  <td className="h-[455px] w-full">
                    <SelectRepository />
                  </td>
                </tr>
              ) : null}

              {/* If not loading, there is data but is empty and commits type, show a message saying there is no commits */}
              {(!loading || !repoData.repoCommitsLoading) &&
              Array.isArray(data) &&
              !data?.length &&
              isTypeCommit ? (
                <tr>
                  <td className="h-[455px] w-full p-8 text-center">
                    <NoDataFound
                      message="No commits found in the last 21 days, please select
                        another repository."
                    />
                  </td>
                </tr>
              ) : null}

              {/* If not loading, there is data, display the data in the table */}
              {!loading &&
                Array.isArray(data) &&
                Boolean(data?.length) &&
                (isCommit(data) || isRepo(data)) &&
                data
                  .slice(
                    parseInt(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) *
                      (pageNumber - 1),
                    parseInt(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) *
                      pageNumber
                  )
                  ?.map((row) => {
                    const isRowDataCommit = isRowCommit(row);

                    return (
                      <tr key={row.id}>
                        <td
                          className={`p-5 pl-10 font-body ${borderClasses} overflow-hidden text-ellipsis`}
                        >
                          {isRowDataCommit ? row.sha : row.name}
                        </td>
                        <td className={borderClasses}>
                          {isRowDataCommit
                            ? row.repository.name
                            : new Date(row.createdAt).toLocaleDateString()}
                        </td>
                        <td className={borderClasses}>
                          {isRowDataCommit
                            ? new Date(row.commitDate).toLocaleDateString()
                            : new Date(row.pushedAt).toLocaleDateString()}
                        </td>
                        {isRowDataCommit ? (
                          <td className={borderClasses}>
                            <div className="flex flex-row items-center gap-6">
                              <div className="flex flex-row items-center gap-1">
                                <GoDiffAdded size="18px" color="#3FB950" />
                                <span>{row.additions}</span>
                              </div>
                              <div className="flex flex-row items-center gap-1">
                                <GoDiffRemoved size="18px" color="#F85149" />
                                <span>{row.deletions}</span>
                              </div>
                            </div>
                          </td>
                        ) : null}
                        <td className={borderClasses}>
                          <div className="w-fit">
                            <a
                              href={row.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <GoMarkGithub size="23px" />
                            </a>
                          </div>
                        </td>
                        {!isRowDataCommit ? (
                          <td className={borderClasses}>
                            <button
                              type="button"
                              className={`border border-text px-4 py-2 rounded text-xs ${
                                row.id === repoData.selectedRepoId
                                  ? 'bg-accent'
                                  : ''
                              }`}
                              onClick={() =>
                                setRepoData({
                                  ...repoData,
                                  selectedRepoId: row.id,
                                  selectedRepoName: row.name,
                                })
                              }
                            >
                              Select
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}

              {/* If data is loading than display a skeleton of content to be replaced with actual data */}
              {loading &&
                Array.from({
                  length: parseInt(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
                }).map((_, i) => (
                  <tr key={i} className="opacity-25 animate-pulse">
                    <td className={`p-5 pl-10 font-body ${borderClasses}`}>
                      {['userCommits', 'commits'].includes(type)
                        ? 'Commit SHA'
                        : 'Repository Name'}
                    </td>
                    <td className={borderClasses}>
                      {['userCommits', 'commits'].includes(type)
                        ? 'Repository'
                        : '01/01/1990'}
                    </td>
                    <td className={borderClasses}>01/01/1990</td>
                    {['userCommits', 'commits'].includes(type) ? (
                      <td className={borderClasses}>
                        <div className="flex flex-row items-center gap-6">
                          <div className="flex flex-row items-center gap-1">
                            <GoDiffAdded size="18px" color="#3FB950" />
                            <span>000</span>
                          </div>
                          <div className="flex flex-row items-center gap-1">
                            <GoDiffRemoved size="18px" color="#F85149" />
                            <span>000</span>
                          </div>
                        </div>
                      </td>
                    ) : null}
                    {['userCommits', 'commits'].includes(type) ? (
                      <td className={borderClasses}>
                        <GoMarkGithub size="23px" />
                      </td>
                    ) : (
                      <>
                        <td className={borderClasses}>
                          <GoMarkGithub size="23px" />
                        </td>
                        <td className={borderClasses}>
                          <button
                            type="button"
                            className="border border-text px-4 py-2 rounded text-xs"
                          >
                            Select
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
          <TablePagination
            dataHelper={dataHelper}
            type={type}
            pageState={pageState}
          />
        </div>
      </section>
    </div>
  );
}
