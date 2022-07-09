import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

interface IProps {
  context: GetServerSidePropsContext;
  path: string;
}

export default async function handleAuthRedirect({ context, path }: IProps) {
  const session = await getSession(context);

  if (session && path.includes('auth')) {
    return {
      session,
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  if (!session) {
    return {
      session,
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    session,
    redirect: {
      destination: null,
      permanent: false,
    },
  };
}
