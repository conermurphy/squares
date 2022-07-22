import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';
import { getUserAuth } from '../../../utils';

export default async function repos(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  }

  const { octokit, login, userId = '' } = await getUserAuth({ session });

  switch (req.method) {
    case 'GET':
      try {
        // Get all of a user's repos
        const { data } = await octokit.rest.repos.listForUser({
          username: login,
        });

        const transformedRepos = await Promise.all(
          data.map(async (repo) => {
            const {
              id,
              node_id: nodeId,
              name,
              html_url: url,
              watchers_count: watchersCount,
              forks_count: forksCount,
              created_at: createdAt,
              updated_at: updatedAt,
              pushed_at: pushedAt,
              stargazers_count: starsCount,
            } = repo;

            // Get lanaguges used in repository for breakdown
            const { data: languages } = await octokit.rest.repos.listLanguages({
              owner: login,
              repo: name,
            });

            return {
              id,
              nodeId,
              name,
              url,
              watchersCount,
              forksCount,
              createdAt: createdAt?.toString(),
              updatedAt: updatedAt?.toString(),
              pushedAt: pushedAt?.toString(),
              starsCount,
              languages,
              userId: userId || '',
            };
          })
        );

        try {
          await Promise.all(
            transformedRepos.map(async (repo) => {
              await prisma?.repository.update({
                where: {
                  id: repo.id,
                },
                data: repo,
              });
            })
          );
        } catch (e) {
          await prisma?.repository.createMany({
            data: transformedRepos,
          });
        }

        const repoData = await prisma?.repository.findMany({
          where: {
            userId,
          },
        });

        return res.status(200).json(repoData);
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
