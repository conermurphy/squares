import React from 'react';
import '../styles/global.css';
import type { AppProps } from 'next/app';
import { Footer } from '../components';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
