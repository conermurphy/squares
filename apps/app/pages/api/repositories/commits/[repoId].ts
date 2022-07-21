import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';

export default async function commits(
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
        const commitsData = await prisma?.commit.findMany();
        return res.status(200).json(commitsData);
      } catch (e) {
        return res.status(500).json({ error: 'Error fetching posts' });
      }
    default:
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .end(`Method ${req.method ? req.method : ''} Not Allowed`);
  }
}
