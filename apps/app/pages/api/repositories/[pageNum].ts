import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';
import { getLastFetchDate, getUserAuth } from '../../../utils';

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
        const { pageNum = '1' } = req.query;

        if (Array.isArray(pageNum) || pageNum === undefined) {
          return res.status(500).json({
            error: 'Query parameter is not the expected type of "number"',
          });
        }

        if (shouldFetchNewData) {
          // Get all of the authenticated user's repos from GitHub
          const { data } = await octokit.rest.repos.listForUser({
            username: login,
          });

          // Transform the repo into the datashape we need and fetch the langauges for it.
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
              const { data: languages } =
                await octokit.rest.repos.listLanguages({
                  owner: login,
                  repo: name,
                });

              return {
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
            })
          );

          // Try and update the repo with new data, if the id doesn't exist, create a new entry
          await Promise.all(
            transformedRepos.map(async (repo) => {
              await prisma?.repository.upsert({
                where: {
                  id: repo.id,
                },
                update: repo,
                create: repo,
              });
            })
          );
        }

        // Return all of the repo data from Prisma for the user
        const repoData = await prisma?.repository.findMany({
          where: {
            userId,
          },
          orderBy: {
            pushedAt: 'desc',
          },
          skip:
            (parseInt(pageNum) - 1) *
            parseInt(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
          take: parseInt(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
        });

        // Update the lastFetchData for the user's repositories
        await updateLastFetchDate;

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
