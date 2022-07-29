import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getDaysFromDate, getUserAuth } from '@/utils';
import { prisma } from '@/lib/prisma';

export default async function userCommitsCount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  // If no valid session found, return an error saying "permission denied"
  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  // Get data about the user and octokit to query GitHub.
  const { login } = await getUserAuth({ session });

  const sinceDate = getDaysFromDate({
    days: 7,
  });

  switch (req.method) {
    case 'GET':
      try {
        const maxTries = parseInt(process.env.API_MAX_RETRY);
        let count = 0;
        let userCommitsLength;

        while (!userCommitsLength || count < maxTries) {
          userCommitsLength = await prisma.commit.count({
            where: {
              commitDate: {
                gte: sinceDate,
              },
              commitAuthor: {
                login,
              },
            },
          });

          count += 1;
        }

        return res.status(200).json(userCommitsLength);
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
