import React from 'react';
import Link from 'next/link';
import CustomLink from '../CustomLink/CustomLink';

export default function Header(): JSX.Element {
  return (
    <header className="w-full flex flex-row items-center justify-between py-8 md:px-20 max-w-screen-xl">
      <Link href="/" passHref>
        <a className="font-heading text-text text-2xl md:text-3xl">Squares</a>
      </Link>
      <CustomLink href="https://app.squares.so" isSmall isExternal>
        Get Started
      </CustomLink>
    </header>
  );
}
