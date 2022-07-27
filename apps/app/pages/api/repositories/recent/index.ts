import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import { getUserAuth } from '@/utils';

export default async function stats(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  const { userId } = await getUserAuth({ session });

  switch (req.method) {
    case 'GET':
      try {
        const data = await prisma.repository.findMany({
          where: {
            userId,
          },
          orderBy: {
            pushedAt: 'desc',
          },
          take: 6,
        });

        return res.status(200).json(data);
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
