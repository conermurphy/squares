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

  const { userId = '', octokit, login } = await getUserAuth({ session });

  const sinceDate = getDaysFromDate({
    days: 7,
  });

  switch (req.method) {
    case 'GET':
      try {
        const { pageNum } = req.query;

        if (Array.isArray(pageNum) || pageNum === undefined) {
          return res.status(500).json({
            error: 'Query parameter is not the expected type of "string"',
          });
        }

        const repoData = await prisma.repository.findMany({
          where: {
            pushedAt: {
              gte: sinceDate,
            },
            userId,
          },
        });

        await Promise.all([
          repoData.map(async (repo) => {
            const { shouldFetchNewData, updateLastFetchDate } =
              await getLastFetchDate({
                repoId: repo.id.toString(),
                userId,
                dataType: 'commits',
                fetchType: 'repositories',
              });

            if (shouldFetchNewData) {
              await fetchCommitData({
                octokit,
                login,
                repoId: repo.id.toString(),
                repoName: repo.name,
                userId,
                sinceDate: sinceDate.toISOString(),
              });

              await updateLastFetchDate;
            }
          }),
        ]);

        const commitData = await prisma.commit.findMany({
          where: {
            commitDate: {
              gte: sinceDate,
            },
            userId,
          },
          orderBy: {
            commitDate: 'desc',
          },
          include: {
            repository: true,
          },
          skip:
            (parseInt(pageNum) - 1) *
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
