import { Session } from 'next-auth';
import { Octokit } from 'octokit';
import { prisma } from '@/lib/prisma';

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

  if (
    data?.login === '' ||
    data?.lastFetchRepositories.substring(0, 10) !==
      new Date().toISOString().substring(0, 10)
  ) {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated();

    await prisma.user.update({
      where: {
        id: data?.id,
      },
      data: {
        login,
      },
    });
  }

  const userData = await prisma.user.findUnique({
    where: {
      id: data?.id,
    },
  });

  return {
    octokit,
    login: userData?.login || '',
    userId: data?.id,
  };
}
