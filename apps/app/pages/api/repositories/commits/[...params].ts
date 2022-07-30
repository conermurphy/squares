import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import {
  fetchCommitData,
  getDaysFromDate,
  getLastFetchDate,
  getUserAuth,
} from '@/utils';
import { prisma } from '@/lib/prisma';

export default async function commits(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  const { octokit, login, userId = '' } = await getUserAuth({ session });

  const { params } = req.query;

  if (!Array.isArray(params) || params === undefined) {
    return res.status(500).json({
      error: 'Query parameter is not the expected type of "array"',
    });
  }

  const [id, pageNumber = '1'] = params;

  const sinceDate = getDaysFromDate({
    days: 21,
  });

  switch (req.method) {
    case 'GET':
      try {
        // Check if we should fetch new data from GitHub or return existing from Prisma/PlanetScale
        const { shouldFetchNewData, updateLastFetchDate } =
          await getLastFetchDate({
            repoId: id,
            fetchType: 'repositories',
            dataType: 'commits',
          });

        // If shouldFetchNewData === false, return existing from Prisma
        if (shouldFetchNewData) {
          await prisma?.repository
            .findUnique({
              where: {
                id: parseInt(id),
              },
              select: {
                name: true,
                lastFetchDates: {
                  where: {
                    repositoryId: parseInt(id),
                  },
                  select: {
                    commits: true,
                  },
                },
              },
            })
            .then(async (data) => {
              const commitData = await octokit.paginate(
                octokit.rest.repos.listCommits,
                {
                  owner: login,
                  repo: data?.name || '',
                  per_page: 100,
                  since: sinceDate.toISOString(),
                }
              );

              const commitsWithStats = await Promise.all(
                commitData.map(async (commit) => {
                  const { data: commitStatData } =
                    await octokit.rest.repos.getCommit({
                      owner: login,
                      repo: data?.name || '',
                      ref: commit.sha,
                    });

                  return {
                    id: commit.node_id,
                    sha: commit.sha,
                    message: commit.commit.message,
                    url: commit.html_url,
                    commitDate: commit.commit.author?.date || '',
                    repositoryId: parseInt(id),
                    userId,
                    additions: commitStatData.stats?.additions || 0,
                    deletions: commitStatData.stats?.deletions || 0,
                  };
                })
              );

              await Promise.all(
                commitsWithStats.map(async (commit) => {
                  await prisma.commit.upsert({
                    where: {
                      id: commit.id,
                    },
                    update: commit,
                    create: commit,
                  });
                })
              );
            });

          // Update the lastFetchData for the repo's commits
          await updateLastFetchDate;
        }

        const commitData = await prisma.commit.findMany({
          where: {
            repositoryId: parseInt(id),
            commitDate: {
              gte: sinceDate,
            },
          },
          orderBy: {
            commitDate: 'desc',
          },
          include: {
            repository: true,
          },
          skip:
            (parseInt(pageNumber) - 1) *
            parseInt(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
          take: parseInt(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
        });

        return res.status(200).json(commitData);
      } catch (e) {
        return res.status(500).json({ error: 'Error fetching commits' });
      }
    default:
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .end({ error: `Method ${req.method ? req.method : ''} Not Allowed` });
  }
}
