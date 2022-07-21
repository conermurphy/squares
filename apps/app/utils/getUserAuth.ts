import { Session } from 'next-auth';
import { Octokit } from 'octokit';
import { prisma } from '../lib/prisma';

interface IProps {
  session: Session | null;
}

export default async function getUserAuth({ session }: IProps) {
  const data = await prisma?.user.findFirst({
    where: {
      email: session?.user?.email || '',
    },
    include: { accounts: true },
  });

  const octokit = new Octokit({
    auth: data?.accounts[0].access_token,
  });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  return { octokit, login, userId: data?.id };
}
