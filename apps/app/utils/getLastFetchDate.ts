import { LastFetchDates } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface IProps {
  fetchType: 'repositories' | 'user';
  userId?: string;
  repoId?: string;
  dataType?: keyof LastFetchDates;
}

interface UpdateFetchDatesProps {
  type: 'repositories' | 'user';
  current: Date;
  dataKey?: keyof LastFetchDates;
}

function shouldFetchNewData({
  current,
  lastFetch,
}: {
  current: Date;
  lastFetch: number | '' | undefined | null;
}) {
  // Check if the date difference is more than 24 hours. If the lastFetch date is falsy, return true to fetch new data.
  return lastFetch
    ? Math.abs(lastFetch - current.getTime()) / (60 * 60 * 1000) > 24
    : true;
}

export default async function getLastFetchDate({
  repoId = '',
  userId = '',
  dataType,
  fetchType,
}: IProps) {
  // Function to update the last fetch date of the provided type, user or repository based dates
  async function updateLastFetchDate({
    type,
    current,
    dataKey,
  }: UpdateFetchDatesProps) {
    // If repositories based dates, update the provided keys, last fetch date to today.
    if (type === 'repositories' && dataKey) {
      await prisma.lastFetchDates.update({
        where: {
          repositoryId: parseInt(repoId),
        },
        data: {
          [dataKey]: current.toISOString(),
        },
      });
    }

    // If user type, update the user's last fetch date for getting their repos.
    if (type === 'user') {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          lastFetchRepositories: current.toISOString(),
        },
      });
    }
  }

  // Get todays's date.
  const current = new Date();

  // If repositories type, find the last fetch date and compare to see if more than 24 hours ago
  if (fetchType === 'repositories' && dataType) {
    const currentLastFetchDates = await prisma.lastFetchDates.findUnique({
      where: {
        repositoryId: parseInt(repoId),
      },
    });

    const lastFetch =
      currentLastFetchDates &&
      new Date(currentLastFetchDates[dataType]).getTime();

    const shouldRepoFetchNewData = shouldFetchNewData({
      current,
      lastFetch,
    });

    return {
      shouldFetchNewData: shouldRepoFetchNewData,
      updateLastFetchDate: updateLastFetchDate({
        type: 'repositories',
        current,
        dataKey: dataType,
      }),
    };
  }

  // If user type, fidn the last fetch date for the user's repos and compare to see if more than 24 hours ago.
  if (fetchType === 'user') {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        lastFetchRepositories: true,
      },
    });

    const lastFetch =
      data?.lastFetchRepositories &&
      new Date(data.lastFetchRepositories).getTime();

    const shouldUserFetchNewData = shouldFetchNewData({
      current,
      lastFetch,
    });

    return {
      shouldFetchNewData: shouldUserFetchNewData,
      updateLastFetchDate: updateLastFetchDate({
        type: 'user',
        current,
      }),
    };
  }

  return {
    shouldFetchNewData: undefined,
    updateLastFetchDate: undefined,
  };
}
