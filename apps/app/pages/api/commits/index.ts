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

  const sinceDate = getDaysFromDate({
    days: 7,
  });

  switch (req.method) {
    case 'GET':
      try {
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

        const maxTries = parseInt(process.env.API_MAX_RETRY);
        let count = 0;
        let commitData;

        while (!commitData || count < maxTries) {
          commitData = await prisma.commit.findMany({
            where: {
              commitDate: {
                gte: sinceDate,
              },
              commitAuthor: {
                login,
              },
            },
            orderBy: {
              commitDate: 'desc',
            },
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
