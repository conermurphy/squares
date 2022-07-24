import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';

export default async function stats(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const { repoId: id } = req.query;

        if (Array.isArray(id) || id === undefined) {
          return res.status(500).json({
            error: 'Query parameter is not the expected type of "string"',
          });
        }

        const [commits, pullRequests, contributors, repoData] =
          await prisma.$transaction([
            prisma?.commit.count({
              where: {
                repositoryId: parseInt(id),
              },
            }),
            prisma?.pullRequest.count({
              where: {
                repositoryId: parseInt(id),
              },
            }),
            prisma?.contributor.count({
              where: {
                repositories: {
                  some: {
                    id: parseInt(id),
                  },
                },
              },
            }),
            prisma?.repository.findUnique({
              where: {
                id: parseInt(id),
              },
              select: {
                forksCount: true,
                starsCount: true,
                watchersCount: true,
              },
            }),
          ]);

        return res.status(200).json({
          commits,
          pullRequests,
          contributors,
          forks: repoData?.forksCount,
          stars: repoData?.starsCount,
          watchers: repoData?.watchersCount,
        });
      } catch (e) {
        return res.status(500).json({ error: 'Error fetching contributors' });
      }
    default:
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .end({ error: `Method ${req.method ? req.method : ''} Not Allowed` });
  }
}
