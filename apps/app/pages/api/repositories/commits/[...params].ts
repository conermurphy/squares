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

          await fetchCommitData({
            octokit,
            login,
            repoName: repoData?.name,
            repoId: id,
            sinceDate: sinceDate.toISOString(),
            userId,
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
