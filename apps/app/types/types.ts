import { Contributor, PullRequest, Repository } from '@prisma/client';
import { ReactNode } from 'react';
import { CommitWithRepository } from '../lib/prisma-types';

export type RepoLanaguages = {
  [lang: string]: number;
};

export type ErrorMessage = {
  error: string;
};

export type UserSidebar = {
  name: string;
  image: string;
  email: string;
  login: string;
};

export interface DataSectionHeaderProps {
  heading: string;
  description: string;
  icon: ReactNode;
}

export type ReturnDataType =
  | Contributor[]
  | PullRequest[]
  | CommitWithRepository[]
  | Repository[]
  | ErrorMessage
  | UserSidebar;

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

export function isUserSidebar(data: ReturnDataType): data is UserSidebar {
  return (data as UserSidebar).image !== undefined;
}

export function isRowCommit(
  data: Repository | CommitWithRepository
): data is CommitWithRepository {
  return (data as CommitWithRepository).sha !== undefined;
}
