import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getUserAuth } from '@/utils';
import { prisma } from '@/lib/prisma';

export default async function users(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  // If no valid session found, return an error saying "permission denied"
  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  const { login } = await getUserAuth({ session });

  switch (req.method) {
    case 'GET':
      try {
        const data = await prisma?.user.findFirst({
          where: {
            email: session?.user?.email || '',
          },
          select: {
            image: true,
            name: true,
            email: true,
          },
        });

        return res.status(200).json({ ...data, login });
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
