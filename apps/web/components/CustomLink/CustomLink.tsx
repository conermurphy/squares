import Link from 'next/link';
import React, { ReactNode } from 'react';

interface IProps {
  href: string;
  children: ReactNode;
  isExternal?: boolean;
  isAccentBackground?: boolean;
  isSmall?: boolean;
}

export default function CustomLink({
  href,
  isExternal = true,
  isAccentBackground = false,
  isSmall = false,
  children,
}: IProps): JSX.Element {
  const classes = `
  ${isAccentBackground ? 'bg-accent' : 'bg-brand'} 
  ${isSmall ? 'py-3 md:py-4 md:text-xl' : 'py-6 text-xl md:text-2xl'}
     rounded-xl px-8
  `;

  return isExternal ? (
    <a
      href={href}
      className={classes}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ) : (
    <Link href={href} passHref>
      <a className={classes}>{children}</a>
    </Link>
  );
}
