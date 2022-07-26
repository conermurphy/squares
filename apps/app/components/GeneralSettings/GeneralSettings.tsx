import React from 'react';
import { DataSectionHeaderProps } from '@/types/types';
import { signOut } from 'next-auth/react';
import { IoExit } from 'react-icons/io5';
import DataSectionHeader from '../DataSectionHeader/DataSectionHeader';

interface IProps {
  headerData: DataSectionHeaderProps;
}

export default function GeneralSettings({ headerData }: IProps) {
  return (
    <section className="mx-5 md:mx-10 lg:mx-0">
      <DataSectionHeader {...headerData} />
      <div className="flex flex-row justify-between items-center w-full border border-tableBorder rounded-b-2xl border-t-0 px-10 py-7">
        <div>
          <p className="font-heading text-xl">Sign Out</p>
          <p>Make sure to come back soon.</p>
        </div>
        <button
          onClick={() => signOut()}
          type="button"
          className="bg-accent p-4 rounded-xl text-text"
        >
          <IoExit size="23px" />
        </button>
      </div>
    </section>
  );
}
