import { Octokit } from 'octokit';

interface IProps {
  octokit: Octokit;
  login?: string;
  repoName?: string;
  sinceDate: string;
  userId: string;
  repoId: string;
}

export default async function fetchCommitData({
  octokit,
  login = '',
  repoName = '',
  sinceDate,
  userId,
  repoId,
}: IProps) {
  const transformedCommits = await octokit.paginate(
    octokit.rest.repos.listCommits,
    {
      owner: login,
      repo: repoName || '',
      per_page: 100,
      since: sinceDate,
    },
    (response) =>
      response.data.map((commit) => ({
        id: commit.node_id,
        sha: commit.sha,
        message: commit.commit.message,
        url: commit.html_url,
        commitDate: commit.commit.author?.date || '',
        repositoryId: parseInt(repoId),
        userId,
        commitAuthorId: commit.author?.id,
        author: {
          id: commit.author?.id || 0,
          nodeId: commit.author?.node_id,
          login: commit.author?.login,
          imageUrl: commit.author?.avatar_url,
          url: commit.author?.html_url,
        },
      }))
  );

  await Promise.all(
    transformedCommits.map(async (commit) => {
      const { data } = await octokit.rest.repos.getCommit({
        owner: login,
        repo: repoName || '',
        ref: commit.sha,
      });

      const updatedCommit = {
        id: commit.id,
        sha: commit.sha,
        message: commit.message,
        url: commit.url,
        commitDate: commit.commitDate,
        repositoryId: parseInt(repoId),
        userId,
        commitAuthorId: commit.author?.id,
        additions: data.stats?.additions || 0,
        deletions: data.stats?.deletions || 0,
      };

      await prisma.commit.upsert({
        where: {
          id: updatedCommit.id,
        },
        update: updatedCommit,
        create: updatedCommit,
      });
    })
  );
}
