import React, { useEffect } from "react";
import Img from "next/image";
import { useFetchData } from "@/utils";
import { isUserSidebar } from "@/types/types";

export default function UserAccount() {
  // language data fetching
  const {
    error: usersError,
    loading: usersLoading,
    data: usersData,
    message: usersMessage,
    fetchData: usersFetchData,
  } = useFetchData({
    method: "GET",
  });

  useEffect(() => {
    async function fetchData() {
      await usersFetchData({
        endpoint: `/api/users`,
      });
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-row gap-3 items-center lg:pt-6">
      {usersData && typeof usersData !== "number" && isUserSidebar(usersData) && (
        <>
          <div className="relative w-10 h-10 rounded-lg overflow-hidden">
            <Img src={usersData.image} layout="fill" />
          </div>
          <div className="hidden xl:block">
            <p className="font-heading">{usersData.name}</p>
            <p className="text-sm max-w-[130px] text-ellipsis overflow-hidden">
              {usersData.login}
            </p>
          </div>
        </>
      )}

      {usersLoading && (
        <>
          <div className="w-10 h-10 bg-text rounded-lg" />
          <div>
            <p className="hidden lg:block font-heading">Name</p>
            <p className="hidden lg:block text-sm max-w-[130px] text-ellipsis overflow-hidden">
              Username
            </p>
          </div>
        </>
      )}
    </div>
  );
}
