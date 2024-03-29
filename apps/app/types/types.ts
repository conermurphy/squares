import { Contributor, PullRequest, Repository } from '@prisma/client';
import { ReactNode } from 'react';
import { CommitWithRepository } from '@/lib/prisma-types';

export type RepoLanaguages = {
  [lang: string]: number;
};

export type ErrorMessage = {
  error: string;
};

export type User = {
  name: string;
  image: string;
  email: string;
  login: string;
  lastFetchRepositories: string;
};

export interface DataSectionHeaderProps {
  heading: string;
  description: string;
  icon: ReactNode;
}

export type DataHelper = {
  error: boolean | null | undefined;
  loading: boolean;
  data: number | ReturnDataType | null | undefined;
  message: string | null;
  fetchData: ({ endpoint }: { endpoint: string }) => Promise<void>;
};

export type StatTypes =
  | 'commits'
  | 'pullRequests'
  | 'contributors'
  | 'forks'
  | 'stars'
  | 'watchers';

export type Statistics = {
  [key in StatTypes]: number;
};

export interface StatGridProps {
  data: Statistics;
}

export type ReturnDataType =
  | Contributor[]
  | PullRequest[]
  | CommitWithRepository[]
  | Repository[]
  | Statistics
  | ErrorMessage
  | User;

export function isPullRequest(data: ReturnDataType): data is PullRequest[] {
  return (data as PullRequest[])[0].state !== undefined;
}

export function isContributor(data: ReturnDataType): data is Contributor[] {
  return (data as Contributor[])[0].contributions !== undefined;
}

export function isCommit(data: ReturnDataType): data is CommitWithRepository[] {
  return (data as CommitWithRepository[])[0].sha !== undefined;
}

export function isRepo(data: ReturnDataType): data is Repository[] {
  return (data as Repository[])[0].forksCount !== undefined;
}

export function isUser(data: ReturnDataType): data is User {
  return (data as User).image !== undefined;
}

export function isRowCommit(
  data: Repository | CommitWithRepository
): data is CommitWithRepository {
  return (data as CommitWithRepository).sha !== undefined;
}

export function isStatistics(
  data: ReturnDataType | number
): data is Statistics {
  return (data as Statistics).watchers !== undefined;
}
