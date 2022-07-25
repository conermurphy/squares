import { GetServerSideProps } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import React from 'react';
import { handleAuthRedirect } from '@/utils';

interface IProps {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

export default function SignIn({ providers }: IProps): JSX.Element {
  return (
    <>
      <h1>Sign In</h1>
      {providers &&
        Object.values(providers).map(({ name, id }) => (
          <button
            key={name}
            onClick={() => signIn(id, { callbackUrl: '/' })}
            type="button"
          >
            Sign in with {name}
          </button>
        ))}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();

  const { redirect, session } = await handleAuthRedirect({
    context,
    path: context?.resolvedUrl,
  });

  return redirect?.destination && session
    ? { redirect }
    : {
        props: { providers },
      };
};
