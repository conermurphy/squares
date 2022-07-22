import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';
import { getUserAuth } from '../../../../utils';

export default async function commits(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  const { octokit, login, userId = '' } = await getUserAuth({ session });

  switch (req.method) {
    case 'GET':
      try {
        const { repoId: id } = req.query;

        if (Array.isArray(id) || id === undefined) {
          return res.status(500).json({
            error: 'Query parameter is not the expected type of "string"',
          });
        }

        const repoData = await prisma?.repository.findUnique({
          where: {
            id: parseInt(id),
          },
          select: {
            name: true,
          },
        });

        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - 21);

        // list commits in a repo
        const transformedCommits = await octokit.paginate(
          octokit.rest.repos.listCommits,
          {
            owner: login,
            repo: repoData?.name || '',
            per_page: 100,
            since: sinceDate.toISOString(),
          },
          (response) =>
            response.data.map((commit) => ({
              id: commit.node_id,
              sha: commit.sha,
              message: commit.commit.message,
              url: commit.html_url,
              commitDate: commit.commit.author?.date || '',
              repositoryId: parseInt(id),
              userId,
            }))
        );

        const commitsWithStats = await Promise.all(
          transformedCommits.map(async (commit) => {
            const { data } = await octokit.rest.repos.getCommit({
              owner: login,
              repo: repoData?.name || '',
              ref: commit.sha,
            });

            return {
              ...commit,
              additions: data.stats?.additions || 0,
              deletions: data.stats?.deletions || 0,
            };
          })
        );

        await Promise.all(
          commitsWithStats.map(async (commit) => {
            await prisma?.commit.upsert({
              where: {
                id: commit.id,
              },
              update: commit,
              create: commit,
            });
          })
        );

        const commitData = await prisma.commit.findMany({
          where: {
            repositoryId: parseInt(id),
          },
          orderBy: {
            commitDate: 'desc',
          },
        });

        return res.status(200).json(commitData);
      } catch (e) {
        return res.status(500).json({ error: 'Error fetching languages' });
      }
    default:
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .end({ error: `Method ${req.method ? req.method : ''} Not Allowed` });
  }
}
