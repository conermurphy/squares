import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';
import { getUserAuth } from '../../../../utils';

export default async function contributors(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  const { octokit, login } = await getUserAuth({ session });

  switch (req.method) {
    case 'GET':
      try {
        const { repoId: id } = req.query;

        if (Array.isArray(id) || id === undefined) {
          return res.status(500).json({
            error: 'Query parameter is not the expected type of "string"',
          });
        }

        const repoData = await prisma?.repository.findUnique({
          where: {
            id: parseInt(id),
          },
          select: {
            name: true,
          },
        });

        // Get a repos contributors
        const { data } = await octokit.rest.repos.listContributors({
          owner: login,
          repo: repoData?.name || '',
          per_page: 100,
        });

        const transformedContributors = data.map(
          ({
            id: contributorId = 0,
            node_id: nodeId = '',
            login: contributorLogin = '',
            avatar_url: imageUrl = '',
            html_url: url = '',
            contributions,
          }) => ({
            id: contributorId,
            nodeId,
            login: contributorLogin,
            imageUrl,
            contributions,
            url,
          })
        );

        await Promise.all(
          transformedContributors.map(async (contributor) => {
            await prisma.repository.update({
              where: {
                id: parseInt(id),
              },
              data: {
                contributors: {
                  connectOrCreate: {
                    where: {
                      id: contributor.id,
                    },
                    create: {
                      ...contributor,
                    },
                  },
                },
              },
              select: {
                contributors: true,
              },
            });
          })
        );

        const contributorsData = await prisma.repository.findUnique({
          where: {
            id: parseInt(id),
          },
          include: {
            contributors: true,
          },
        });

        return res.status(200).json(contributorsData?.contributors);
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
