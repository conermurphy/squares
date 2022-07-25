import React from 'react';
import { BiLineChart } from 'react-icons/bi';
import { GoGitCommit, GoRepo, GoSettings } from 'react-icons/go';
import NavLink from '../NavLink/NavLink';
import UserAccount from '../UserAccount/UserAccount';

export default function MobileNavBar() {
  return (
    <aside className="lg:hidden fixed bottom-0 flex flex-row items-center w-screen py-4 px-4 sm:px-10 border-t border-text bg-background">
      <div className="flex flex-row items-center justify-between gap-4 w-full">
        <nav className="flex flex-row items-start gap-4 h-full">
          <NavLink
            text="Dashboard"
            href="/"
            icon={<BiLineChart size="20px" />}
          />
          <NavLink
            text="Repositories"
            href="/repositories"
            icon={<GoRepo size="20px" />}
          />
          <div className="grow">
            <NavLink
              text="Commits"
              href="/commits"
              icon={<GoGitCommit size="25px" />}
            />
          </div>
          <NavLink
            text="Settings"
            href="/settings"
            icon={<GoSettings size="20px" />}
          />
        </nav>
        <UserAccount />
      </div>
    </aside>
  );
}
