import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getLastFetchDate, getUserAuth } from '@/utils';
import { prisma } from '@/lib/prisma';

export default async function prs(req: NextApiRequest, res: NextApiResponse) {
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

        // Check if we should fetch new data from GitHub or return existing from Prisma/PlanetScale
        const { shouldFetchNewData, updateLastFetchDate } =
          await getLastFetchDate({
            repoId: id,
            fetchType: 'repositories',
            dataType: 'pullRequests',
          });

        // If shouldFetchNewData === false, return existing from Prisma
        if (shouldFetchNewData) {
          const repoData = await prisma?.repository.findUnique({
            where: {
              id: parseInt(id),
            },
            select: {
              name: true,
            },
          });

          // list PRs in a repo
          const transformedPrs = await octokit.paginate(
            octokit.rest.pulls.list,
            {
              repo: repoData?.name || '',
              state: 'all',
              owner: login,
              per_page: 100,
            },
            ({ data: responseData }) =>
              responseData.map((pr) => ({
                id: pr.id,
                nodeId: pr.node_id,
                url: pr.html_url,
                state: pr.state,
                title: pr.title,
                number: pr.number,
                repositoryId: parseInt(id),
              }))
          );

          await Promise.all(
            transformedPrs.map(async (pr) => {
              await prisma?.pullRequest.upsert({
                where: {
                  id: pr.id,
                },
                update: pr,
                create: pr,
              });
            })
          );

          await updateLastFetchDate;
        }

        const prData = await prisma.pullRequest.findMany({
          where: {
            repositoryId: parseInt(id),
          },
        });

        return res.status(200).json(prData);
      } catch (e) {
        return res.status(500).json({ error: 'Error fetching prs' });
      }
    default:
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .end({ error: `Method ${req.method ? req.method : ''} Not Allowed` });
  }
}
