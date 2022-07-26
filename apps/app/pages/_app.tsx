import React from 'react';
import '../styles/global.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { MobileNavBar } from '@/components/Sidebar/components';
import { useRouter } from 'next/router';
import { Sidebar } from '../components';

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { pathname } = useRouter();

  return (
    <SessionProvider session={session}>
      <main className="flex flex-row min-h-screen bg-background text-text font-body">
        {pathname !== '/auth/signin' ? (
          <>
            <Sidebar />
            <div className="flex flex-col items-center my-5 md:mx-10 lg:mx-20 lg:my-10 w-full mb-32 overflow-x-hidden">
              <div className="max-w-7xl w-full">
                <Component {...pageProps} />
              </div>
            </div>
            <MobileNavBar />
          </>
        ) : (
          <Component {...pageProps} />
        )}
      </main>
    </SessionProvider>
  );
}
