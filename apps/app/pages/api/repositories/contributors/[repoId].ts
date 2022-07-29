import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getLastFetchDate, getUserAuth } from '@/utils';
import { prisma } from '@/lib/prisma';

export default async function contributors(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  const { octokit, login } = await getUserAuth({ session });

  const { repoId: id } = req.query;

  if (Array.isArray(id) || id === undefined) {
    return res.status(500).json({
      error: 'Query parameter is not the expected type of "string"',
    });
  }

  switch (req.method) {
    case 'GET':
      try {
        // Check if we should fetch new data from GitHub or return existing from Prisma/PlanetScale
        const { shouldFetchNewData, updateLastFetchDate } =
          await getLastFetchDate({
            repoId: id,
            fetchType: 'repositories',
            dataType: 'contributors',
          });

        // If shouldFetchNewData === false, return existing from Prisma
        if (shouldFetchNewData) {
          const repoData = await prisma?.repository.findUnique({
            where: {
              id: parseInt(id),
            },
            select: {
              name: true,
            },
          });

          const transformedContributors = await octokit.paginate(
            octokit.rest.repos.listContributors,
            {
              owner: login,
              repo: repoData?.name || '',
              per_page: 100,
            },
            (response) =>
              response.data.map((contributor) => ({
                id: contributor.id || 0,
                nodeId: contributor.node_id || '',
                login: contributor.login || '',
                imageUrl: contributor.avatar_url || '',
                contributions: contributor.contributions,
                url: contributor.html_url || '',
              }))
          );

          await Promise.all(
            transformedContributors.map(async (contributor) => {
              await prisma.repository.update({
                where: {
                  id: parseInt(id),
                },
                data: {
                  contributors: {
                    connectOrCreate: {
                      where: {
                        id: contributor.id,
                      },
                      create: {
                        ...contributor,
                      },
                    },
                  },
                },
                select: {
                  contributors: true,
                },
              });
            })
          );

          await updateLastFetchDate;

          return res.status(200).json(transformedContributors);
        }

        const contributorsData = await prisma.repository.findUnique({
          where: {
            id: parseInt(id),
          },
          include: {
            contributors: true,
          },
        });

        return res.status(200).json(contributorsData?.contributors);
      } catch (e) {
        try {
          const contributorsData = await prisma.repository.findUnique({
            where: {
              id: parseInt(id),
            },
            include: {
              contributors: true,
            },
          });

          return res.status(200).json(contributorsData?.contributors);
        } catch (err) {
          return res.status(500).json({ error: 'Error fetching contributors' });
        }
      }
    default:
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .end({ error: `Method ${req.method ? req.method : ''} Not Allowed` });
  }
}
