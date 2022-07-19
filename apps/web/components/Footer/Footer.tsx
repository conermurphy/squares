import Link from 'next/link';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="flex justify-center bg-backgroundAccent w-full text-text">
      <div className="flex flex-col gap-y-16 sm:flex-row items-start sm:items-center justify-between max-w-screen-xl px-20 py-28 w-full">
        <div>
          <Link href="/" passHref>
            <a className="font-heading text-text text-3xl">Squares</a>
          </Link>
          <p className="opacity-75">
            © Copyright 2022 Squares. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-0.5">
          <a
            href="https://github.com/conermurphy/squares"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size="24px" title="Repository GitHub Link" />
          </a>
          <p className="opacity-75 text-left sm:text-right">
            Built for the PlanetScale & Hashnode Hackathon.
          </p>
        </div>
      </div>
    </footer>
  );
}
