import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface NavLinkProps {
  icon: ReactNode;
  text: string;
  href: string;
  className?: string;
}

export default function NavLink({
  icon,
  text,
  href,
  className,
}: NavLinkProps): JSX.Element {
  const { pathname } = useRouter();

  const isActive =
    (pathname.includes(href) && href !== '/') ||
    (pathname.includes(href) && pathname.split('/')[1] === '');

  return (
    <Link href={href} passHref>
      <a className={`flex items-start justify-start  ${className || ''}`}>
        <div
          className={`flex flex-row items-center gap-4  p-4 rounded-xl w-full ${
            isActive ? 'bg-accent' : ''
          }`}
        >
          {icon}
          <span className="font-heading text-xl">{text}</span>
        </div>
      </a>
    </Link>
  );
}
