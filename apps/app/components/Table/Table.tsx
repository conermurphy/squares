import { Repository } from '@prisma/client';
import React, { Dispatch, SetStateAction } from 'react';
import {
  GoMarkGithub,
  GoDiffAdded,
  GoDiffRemoved,
  GoInfo,
} from 'react-icons/go';
import { CommitWithRepository } from '../../lib/prisma-types';
import { DataSectionHeaderProps, isRowCommit } from '../../types/types';
import DataSectionHeader from '../DataSectionHeader/DataSectionHeader';
import { TablePagination } from './components';

interface IProps {
  headings: string[];
  data: [number, Repository[]] | [number, CommitWithRepository[]] | null;
  tableHeaderData: DataSectionHeaderProps;
  dataFetch: ({ endpoint }: { endpoint: string }) => Promise<void>;
  type: 'repositories' | 'commits';
  loading: boolean;
  repoState: {
    selectedRepoId: number;
    setSelectedRepoId: Dispatch<SetStateAction<number>>;
  };
}

export default function Table({
  headings,
  data,
  tableHeaderData,
  dataFetch,
  type,
  loading = false,
  repoState,
}: IProps) {
  const borderClasses = 'border-b border-tableBorder';

  return (
    <section>
      <DataSectionHeader {...tableHeaderData} />
      <table className="table-fixed w-full border border-tableBorder">
        <thead
          className={`bg-tableAccent font-heading text-sm  ${borderClasses}`}
        >
          <tr>
            {!loading && !data && type === 'commits' ? (
              <th className="py-5 opacity-75 text-center">Awaiting Input</th>
            ) : null}
            {(data || loading) &&
              headings.map((heading, i, arr) => (
                <th
                  key={`${heading}-${i}`}
                  className={`text-left py-5 opacity-75  
                ${i === 0 ? 'pl-10 w-88' : ''} 
                ${i !== arr.length - 1 && i !== 0 ? 'w-72' : ''}
                ${i === arr.length - 1 && type === 'commits' ? 'w-24' : ''}
                ${i === arr.length - 1 && type === 'repositories' ? 'w-28' : ''}
                ${i === arr.length - 2 && type === 'repositories' ? 'w-36' : ''}
                `}
                >
                  {heading}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="h-[455px]">
          {!loading && !data && type === 'commits' ? (
            <tr>
              <td className="h-[455px] w-full">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="rounded-full bg-accent p-4">
                    <GoInfo size="40px" />
                  </div>
                  <p className="font-heading text-2xl">
                    Please select a repository to look up.
                  </p>
                </div>
              </td>
            </tr>
          ) : null}
          {!loading
            ? data &&
              data[1]?.map((row) => {
                const isCommit = isRowCommit(row);

                return (
                  <tr key={row.id}>
                    <td
                      className={`p-5 pl-10 font-body ${borderClasses} overflow-hidden text-ellipsis`}
                    >
                      {isCommit ? row.sha : row.name}
                    </td>
                    <td className={borderClasses}>
                      {isCommit
                        ? row.repository.name
                        : new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td className={borderClasses}>
                      {isCommit
                        ? new Date(row.commitDate).toLocaleDateString()
                        : new Date(row.pushedAt).toLocaleDateString()}
                    </td>
                    {isCommit ? (
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
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GoMarkGithub size="23px" />
                      </a>
                    </td>
                    {!isCommit ? (
                      <td className={borderClasses}>
                        <button
                          type="button"
                          className={`border border-text px-4 py-2 rounded text-xs ${
                            row.id === repoState.selectedRepoId
                              ? 'bg-accent'
                              : ''
                          }`}
                          onClick={() => repoState.setSelectedRepoId(row.id)}
                        >
                          Select
                        </button>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            : Array.from({
                length: parseInt(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
              }).map((_, i) => (
                <tr key={i} className="opacity-25 animate-pulse">
                  <td className={`p-5 pl-10 font-body ${borderClasses}`}>
                    {type === 'commits' ? 'Commit SHA' : 'Repository Name'}
                  </td>
                  <td className={borderClasses}>
                    {type === 'commits' ? 'Repository' : '01/01/1990'}
                  </td>
                  <td className={borderClasses}>01/01/1990</td>
                  {type === 'commits' ? (
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
                  <td className={borderClasses}>
                    <GoMarkGithub size="23px" />
                  </td>
                  {type !== 'commits' ? (
                    <td className={borderClasses}>
                      <button
                        type="button"
                        className="border border-text px-4 py-2 rounded text-xs"
                      >
                        Select
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
        </tbody>
      </table>
      <TablePagination
        dataFetch={dataFetch}
        dataLength={data ? data[0] : 0}
        type={type}
        repoState={repoState}
      />
    </section>
  );
}
