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
import Img from 'next/image';
import { SEO } from '@/components';

interface IProps {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

export default function SignIn({ providers }: IProps): JSX.Element {
  return (
    <>
      <SEO metaTitle="Sign In" metaDescription="Sign into Squares" />
      <div className="flex flex-col lg:flex-row items-center w-full h-screen overflow-hidden">
        <section className="flex flex-row items-center justify-center w-full h-1/2 md:h-screen lg:w-5/12 p-14 md:p-20">
          <div className="flex flex-col gap-4 md:gap-6 max-w-xs">
            <div className="relative md:w-20 md:h-20 w-16 h-16">
              <Img src="/logo.svg" layout="fill" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-heading text-4xl md:text-5xl">Squares</h1>
              <p className="text-xl md:text-2xl font-body">
                The GitHub analytics app you didn’t know you needed.
              </p>
            </div>
            {providers &&
              Object.values(providers).map(({ name, id }) => (
                <button
                  key={name}
                  onClick={() => signIn(id, { callbackUrl: '/' })}
                  type="button"
                  className="bg-text text-background px-3 md:px-10 py-3 font-heading text-xl md:text-2xl rounded-lg"
                >
                  Sign in with {name}
                </button>
              ))}
          </div>
        </section>
        <div className="flex flex-row items-center justify-center bg-text w-full h-1/2 lg:w-7/12 rounded-t-[80px] lg:rounded-tr-none lg:rounded-l-[80px] overflow-hidden md:h-screen border border-tableBorder border-r-0">
          <div className="grid grid-cols-12 gap-y-8 gap-x-48 rotate-45">
            {Array.from({
              length: 200,
            }).map((_, i) => (
              <div
                key={i}
                className={`h-40 w-40 rounded-2xl ${
                  Math.round(Math.random()) === 0
                    ? 'bg-brand'
                    : 'bg-tableAccent'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
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
