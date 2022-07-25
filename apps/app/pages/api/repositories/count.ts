import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getUserAuth } from '@/utils';
import { prisma } from '@/lib/prisma';

export default async function reposCount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  // If no valid session found, return an error saying "permission denied"
  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  // Get data about the user and octokit to query GitHub.
  const { userId = '' } = await getUserAuth({ session });

  switch (req.method) {
    case 'GET':
      try {
        // Return all of the repo data from Prisma for the user
        const repoLength = await prisma?.repository.count({
          where: {
            userId,
          },
        });

        return res.status(200).json(repoLength);
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
