import { Repository } from '@prisma/client';
import { Octokit } from 'octokit';
import { prisma } from '../../lib/prisma';

interface IProps {
  octokit: Octokit;
  login: string;
  userId?: string;
}

export default async function fetchRepositories({
  octokit,
  login,
  userId,
}: IProps): Promise<Repository[] | undefined> {
  // Get all of a user's repos
  const { data } = await octokit.rest.repos.listForUser({
    username: login,
  });

  const transformedRepos = await Promise.all(
    data.map(async (repo) => {
      const {
        id,
        node_id: nodeId,
        name,
        html_url: url,
        watchers_count: watchersCount,
        forks_count: forksCount,
        created_at: createdAt,
        updated_at: updatedAt,
        pushed_at: pushedAt,
        stargazers_count: starsCount,
      } = repo;

      // Get lanaguges used in repository for breakdown
      const { data: languages } = await octokit.rest.repos.listLanguages({
        owner: login,
        repo: name,
      });

      // Get all commits within a repository
      // const commits = await octokit.paginate(
      //   octokit.rest.repos.listCommits,
      //   {
      //     owner: login,
      //     repo: name,
      //     per_page: 100,
      //   },
      //   (response) =>
      //     response.data.map((commit) => ({
      //       id: commit.node_id,
      //       sha: commit.sha,
      //       message: commit.commit.message,
      //       url: commit.html_url,
      //       commitData: commit.commit.author?.date,
      //       repositoryId: id,
      //     }))
      // );

      // list PRs in a repo
      // const { data: prs } = await octokit.rest.pulls.list({
      //   repo: name,
      //   state: 'all',
      //   owner: login,
      //   per_page: 100,
      // });

      return {
        id,
        nodeId,
        name,
        url,
        watchersCount,
        forksCount,
        createdAt: createdAt?.toString(),
        updatedAt: updatedAt?.toString(),
        pushedAt: pushedAt?.toString(),
        starsCount,
        languages,
        userId: userId || '',
      };
    })
  );

  try {
    await Promise.all(
      transformedRepos.map(async (repo) => {
        await prisma?.repository.update({
          where: {
            id: repo.id,
          },
          data: repo,
        });
      })
    );
  } catch (e) {
    await prisma?.repository.createMany({
      data: transformedRepos,
    });
  }

  const repoData = await prisma?.repository.findMany();

  return repoData;
}
