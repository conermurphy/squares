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

          const commitFetchDate = getDaysFromDate({
            date: repoData?.lastFetchDates[0].commits,
            days: 21,
          });

          await fetchCommitData({
            octokit,
            login,
            repoName: repoData?.name,
            repoId: id,
            sinceDate: commitFetchDate.toISOString(),
            userId,
          });

          // Update the lastFetchData for the repo's commits
          await updateLastFetchDate;
        }

        const sinceDate = getDaysFromDate({
          days: 21,
        });

        const maxTries = parseInt(process.env.API_MAX_RETRY);
        let count = 0;
        let commitData;

        while (!commitData || count < maxTries) {
          commitData = await prisma.commit.findMany({
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

          count += 1;
        }

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
