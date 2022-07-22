import { LastFetchDates } from '@prisma/client';
import { prisma } from '../lib/prisma';

interface IProps {
  userId: string;
  dataType: keyof LastFetchDates;
}

export default async function getLastFetchDate({ userId, dataType }: IProps) {
  const currentLastFetchDates = await prisma.lastFetchDates.findUnique({
    where: {
      userId,
    },
  });

  const current = new Date();
  const lastFetch =
    currentLastFetchDates &&
    new Date(currentLastFetchDates[dataType]).getTime();

  const shouldFetchNewData = lastFetch
    ? Math.abs(lastFetch - current.getTime()) / (60 * 60 * 1000) > 24
    : true;

  async function updateLastFetchDate() {
    await prisma.lastFetchDates.update({
      where: {
        userId,
      },
      data: {
        [dataType]: current.toISOString(),
      },
    });
  }

  return {
    shouldFetchNewData,
    updateLastFetchDate,
  };
}
