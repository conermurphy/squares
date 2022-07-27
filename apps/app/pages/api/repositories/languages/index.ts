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
        // Fetch the language data for all repos
        const langData = await prisma?.repository.findMany({
          select: {
            languages: true,
          },
        });

        const transfromedData = langData.reduce<{ [key: string]: number }>(
          (acc, { languages }) => {
            if (!languages) return acc;

            Object.entries(languages).forEach(
              ([key, val]: [string, number]) => {
                // eslint-disable-next-line
                acc = {
                  ...acc,
                  [key]: acc[key] ? acc[key] + val : val,
                };
              }
            );

            return acc;
          },
          {}
        );

        return res.status(200).json(transfromedData);
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
