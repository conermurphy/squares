import React from 'react';
import { DataSectionHeaderProps } from '../../types/types';

export default function DataSectionHeader({
  heading,
  description,
  icon,
}: DataSectionHeaderProps): JSX.Element {
  return (
    <div className="flex flex-row items-center bg-tableAccent border border-tableBorder p-6 gap-4 rounded-t-2xl">
      <div className="bg-brand p-4 rounded-full">{icon}</div>
      <div>
        <h3 className="font-heading text-xl">{heading}</h3>
        <p className="opacity-75">{description}</p>
      </div>
    </div>
  );
}
