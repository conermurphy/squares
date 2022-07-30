import { useUser } from '@/contexts';
import React from 'react';

export default function LastFetchDate() {
  const { userData } = useUser();
  return (
    <div className="opacity-75 flex flex-col gap-3 text-sm pt-6">
      <p>
        Data last fetched on:{' '}
        {userData?.lastFetchRepositories ? (
          <span className="font-heading">
            {new Date(userData?.lastFetchRepositories).toLocaleDateString(
              'en-US'
            )}{' '}
            {new Date(userData?.lastFetchRepositories).toLocaleTimeString(
              'en-US'
            )}
          </span>
        ) : null}
      </p>
      <p>
        Squares was built for the{' '}
        <a
          href="https://hashnode.com/?source=planetscale_hackathon_announcement"
          className="font-heading"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hashnode{' '}
        </a>
        and{' '}
        <a
          href="https://planetscale.com/?utm_source=hashnode&utm_medium=hackathon&utm_campaign=announcement_article"
          className="font-heading"
          target="_blank"
          rel="noopener noreferrer"
        >
          PlanetScale
        </a>{' '}
        Hackathon
      </p>
    </div>
  );
}
