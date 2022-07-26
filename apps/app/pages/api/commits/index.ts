import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getDaysFromDate, getUserAuth } from '@/utils';
import { prisma } from '@/lib/prisma';

export default async function commits(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  const { login } = await getUserAuth({ session });

  switch (req.method) {
    case 'GET':
      try {
        const sinceDate = getDaysFromDate({
          days: 7,
        });

        const commitData = await prisma.commit.findMany({
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
