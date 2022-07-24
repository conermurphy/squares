import React from 'react';
import '../styles/global.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Sidebar } from '../components';

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <main className="flex flex-row min-h-screen bg-background text-text font-body">
        <Sidebar />
        <div className="flex flex-col items-center mx-20 my-10 w-full">
          <div className="max-w-7xl">
            <Component {...pageProps} />
          </div>
        </div>
      </main>
    </SessionProvider>
  );
}
