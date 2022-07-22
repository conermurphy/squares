import { Commit, Contributor, PullRequest, Repository } from '@prisma/client';

export type RepoLanaguages = {
  [lang: string]: number;
};

export type ErrorMessage = {
  error: string;
};

export type ReturnDataType =
  | Contributor[]
  | PullRequest[]
  | Commit[]
  | Repository[]
  | ErrorMessage;

export function isPullRequest(data: ReturnDataType): data is PullRequest[] {
  return (data as PullRequest[])[0].state !== undefined;
}

export function isContributor(data: ReturnDataType): data is Contributor[] {
  return (data as Contributor[])[0].contributions !== undefined;
}

export function isCommit(data: ReturnDataType): data is Commit[] {
  return (data as Commit[])[0].sha !== undefined;
}

export function isRepo(data: ReturnDataType): data is Repository[] {
  return (data as Repository[])[0].forksCount !== undefined;
}
