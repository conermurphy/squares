import { DataHelper, DataSectionHeaderProps, isCommit } from '@/types/types';
import React, { useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
import { round } from '@/utils';
import DataSectionHeader from '../DataSectionHeader/DataSectionHeader';

interface IProps {
  dataHelper: DataHelper;
  headerData: DataSectionHeaderProps;
}

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export default function CommitsGraph({ dataHelper, headerData }: IProps) {
  const { loading, data, fetchData: commitsFetchData } = dataHelper;

  useEffect(() => {
    const fetchData = async () => {
      await commitsFetchData({
        endpoint: `/api/commits`,
      });
    };

    fetchData();
  }, []);

  const days = Array.from({ length: 8 })
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const stringDate = date.toISOString().substring(0, 10);

      return {
        date: stringDate,
        count: 0,
        average: 0,
      };
    })
    .reverse();

  const dataWithCount =
    Array.isArray(data) &&
    isCommit(data) &&
    data.reduce((acc, cur) => {
      const { commitDate } = cur;

      const date = new Date(commitDate).toISOString().substring(0, 10);

      const dayIndex = days.findIndex((day) => day.date === date);

      const dayData = acc[dayIndex];

      acc[dayIndex] = {
        ...dayData,
        count: dayData ? dayData.count + 1 : 1,
        average: 0,
      };

      return acc;
    }, days);

  const dataWithAverage =
    dataWithCount &&
    dataWithCount.reduce((acc, cur, i, arr) => {
      const currentCommitCount = arr
        .slice(0, i + 1)
        .reduce((countAcc, countCur) => countAcc + countCur.count, 0);

      acc[i] = {
        ...cur,
        average: round(currentCommitCount / (i + 1), 0),
      };

      return acc;
    }, dataWithCount);

  const finalData =
    dataWithAverage &&
    dataWithAverage.reduce<{
      labels: string[];
      counts: number[];
      averages: number[];
    }>(
      (acc, cur) => {
        const { date, count, average } = cur;

        acc.labels.push(date);
        acc.counts.push(count);
        acc.averages.push(average);

        return acc;
      },
      { labels: [], counts: [], averages: [] }
    );

  const skeletonData = {
    lables: Array.from({ length: 8 }).map((_, i) => `Day ${i}`),
    counts: Array.from({ length: 8 }).map((_) => round(Math.random() * 10, 0)),
  };

  const chartData = {
    labels: finalData ? finalData.labels : skeletonData.lables,
    datasets: [
      {
        type: 'line' as const,
        label: 'Avg Commits / Day',
        borderColor: 'hsla(138, 25%, 56%, 1)',
        borderWidth: 5,
        fill: false,
        data: finalData ? finalData?.averages : [],
        radius: 1,
        borderCapStyle: 'round' as const,
        tension: 0.25,
      },
      {
        type: 'bar' as const,
        label: 'Commits / Day',
        backgroundColor: 'hsla(238, 14%, 53%, 1)',
        data: finalData ? finalData.counts : skeletonData.counts,
        borderWidth: 0,
        borderRadius: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
  };

  return (
    <section
      className={`mx-5 md:mx-10 lg:mx-0 ${
        loading ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <DataSectionHeader {...headerData} />
      <div className={loading ? 'animate-pulse' : ''}>
        <div className="relative w-auto border border-tableBorder rounded-b-2xl border-t-0 px-2 md:px-4 lg:px-10 py-7 h-[clamp(500px, 40vw, 700px)]">
          <Chart type="bar" data={chartData} options={options} />
        </div>
      </div>
    </section>
  );
}
