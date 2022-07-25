import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function lanaguges(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  switch (req.method) {
    case 'GET':
      try {
        // Get the repoid from the query
        const { repoId: id } = req.query;

        // If the id is an array or undefined, return with an error
        if (Array.isArray(id) || id === undefined) {
          return res.status(500).json({
            error: 'Query parameter is not the expected type of "string"',
          });
        }

        // Fetch the language data from Prisma for the repo
        const langData = await prisma?.repository.findUnique({
          where: {
            id: parseInt(id),
          },
          select: {
            languages: true,
          },
        });

        return res.status(200).json(langData?.languages);
      } catch (e) {
        return res.status(500).json({ error: 'Error fetching languages' });
      }
    default:
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .end({ error: `Method ${req.method ? req.method : ''} Not Allowed` });
  }
}
