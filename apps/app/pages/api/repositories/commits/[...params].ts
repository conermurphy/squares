import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getDaysFromDate, getLastFetchDate, getUserAuth } from '@/utils';
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

  switch (req.method) {
    case 'GET':
      try {
        const { params } = req.query;

        if (!Array.isArray(params) || params === undefined) {
          return res.status(500).json({
            error: 'Query parameter is not the expected type of "array"',
          });
        }

        const [id, pageNumber = '1'] = params;

        // Check if we should fetch new data from GitHub or return existing from Prisma/PlanetScale
        const { shouldFetchNewData, updateLastFetchDate } =
          await getLastFetchDate({
            repoId: id,
            fetchType: 'repositories',
            dataType: 'commits',
          });

        // If shouldFetchNewData === false, return existing from Prisma
        if (shouldFetchNewData) {
          const repoData = await prisma?.repository.findUnique({
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
          });

          const commitFetchDate = getDaysFromDate({
            date: repoData?.lastFetchDates[0].commits,
            days: 21,
          });

          // list commits in a repo
          const transformedCommits = await octokit.paginate(
            octokit.rest.repos.listCommits,
            {
              owner: login,
              repo: repoData?.name || '',
              per_page: 100,
              since: commitFetchDate.toISOString(),
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

          const commitsWithStats = await Promise.all(
            transformedCommits.map(async (commit) => {
              const { data } = await octokit.rest.repos.getCommit({
                owner: login,
                repo: repoData?.name || '',
                ref: commit.sha,
              });

              return {
                id: commit.id,
                sha: commit.sha,
                message: commit.message,
                url: commit.url,
                commitDate: commit.commitDate,
                repositoryId: parseInt(id),
                userId,
                commitAuthorId: commit.author?.id,
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

          await Promise.all(
            transformedCommits.map(async (commit) => {
              await prisma.commit.update({
                where: {
                  id: commit.id,
                },
                data: {
                  commitAuthor: {
                    connectOrCreate: {
                      where: {
                        id: commit.author.id,
                      },
                      create: { ...commit.author },
                    },
                  },
                },
              });
            })
          );
        }

        const sinceDate = getDaysFromDate({
          days: 21,
        });

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

        // Update the lastFetchData for the repo's commits
        await updateLastFetchDate;

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
