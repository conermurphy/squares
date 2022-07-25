import React from "react";
import { GoInfo } from "react-icons/go";

interface IProps {
  message: string;
}

export default function NoDataFound({ message }: IProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <div className="rounded-full bg-accent p-4">
        <GoInfo size="35px" />
      </div>
      <p className="font-heading text-2xl text-center">{message}</p>
    </div>
  );
}
