import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getLastFetchDate, getUserAuth } from '@/utils';
import { prisma } from '@/lib/prisma';

export default async function repos(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  // If no valid session found, return an error saying "permission denied"
  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  // Get data about the user and octokit to query GitHub.
  const { octokit, login, userId = '' } = await getUserAuth({ session });

  // Check if we should fetch new data from GitHub or return existing from Prisma/PlanetScale
  const { shouldFetchNewData, updateLastFetchDate } = await getLastFetchDate({
    userId,
    fetchType: 'user',
  });

  switch (req.method) {
    case 'GET':
      try {
        if (shouldFetchNewData) {
          // Get all of the authenticated user's repos from GitHub
          const { data } = await octokit.rest.repos.listForUser({
            username: login,
          });

          // Transform the repo into the datashape we need and fetch the langauges for it.
          await Promise.all(
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
              const { data: languages } =
                await octokit.rest.repos.listLanguages({
                  owner: login,
                  repo: name,
                });

              const updatedRepo = {
                id,
                nodeId,
                name,
                url,
                watchersCount,
                forksCount,
                createdAt: createdAt?.toString() || '',
                updatedAt: updatedAt?.toString() || '',
                pushedAt: pushedAt?.toString() || '',
                starsCount,
                languages,
                userId: userId || '',
              };

              await prisma.repository.upsert({
                where: {
                  id: updatedRepo.id,
                },
                update: updatedRepo,
                create: {
                  ...updatedRepo,
                  lastFetchDates: {
                    connectOrCreate: {
                      where: {
                        repositoryId: repo.id,
                      },
                      create: {
                        commits: '',
                        contributors: '',
                        pullRequests: '',
                      },
                    },
                  },
                },
              });
            })
          );

          await updateLastFetchDate;
        }

        // Return all of the repo data from Prisma for the user
        const repoData = await prisma?.repository.findMany({
          where: {
            userId,
          },
          orderBy: {
            pushedAt: 'desc',
          },
        });

        return res.status(200).json(repoData);
      } catch (e) {
        return res.status(500).json({ error: 'Error fetching repos' });
      }
    default:
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .end({ error: `Method ${req.method ? req.method : ''} Not Allowed` });
  }
}
