import React from "react";
import { GoInfo } from "react-icons/go";

interface IProps {
  isSmall?: boolean;
}

export default function SelectRepository({ isSmall = false }: IProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <div className={`rounded-full bg-accent ${isSmall ? "p-3" : "p-4"}`}>
        <GoInfo size={isSmall ? "25px" : "35px"} />
      </div>
      <p
        className={`font-heading ${
          isSmall ? "text-xl" : "text-xl sm:text-2xl"
        } text-center`}
      >
        Please select a repository to look up.
      </p>
    </div>
  );
}
