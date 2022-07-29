import React, { useEffect } from 'react';
import Img from 'next/image';
import { useFetchData } from '@/utils';
import { isUser } from '@/types/types';
import { useUser } from '@/contexts';

export default function UserAccount() {
  const { userData, setUserData } = useUser();

  const {
    loading: usersLoading,
    data: usersData,
    fetchData: usersFetchData,
  } = useFetchData({
    method: 'GET',
  });

  useEffect(() => {
    if (userData.login) return;
    async function fetchData() {
      await usersFetchData({
        endpoint: `/api/users`,
      });

      if (usersData && typeof usersData !== 'number' && isUser(usersData)) {
        setUserData({
          email: usersData.email,
          login: usersData.login,
          name: usersData.name,
          image: usersData.image,
          lastFetchRepositories: usersData.lastFetchRepositories,
        });
      }
    }
    fetchData();
  }, [usersData, usersLoading]);

  return (
    <div
      className={`flex flex-row gap-3 items-center lg:pt-6 ${
        !userData.name ? 'animate-pulse opacity-25' : ''
      }`}
    >
      {userData.name && (
        <>
          <div className="relative w-10 h-10 rounded-lg overflow-hidden">
            <Img src={userData.image} layout="fill" />
          </div>
          <div className="hidden xl:block">
            <p className="font-heading">{userData.name}</p>
            <p className="text-sm max-w-[130px] text-ellipsis overflow-hidden">
              {userData.login}
            </p>
          </div>
        </>
      )}

      {!userData.name && (
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
