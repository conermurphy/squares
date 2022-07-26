import { DataHelper, DataSectionHeaderProps } from '@/types/types';
import React from 'react';
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
  const { loading, data, fetchData } = dataHelper;

  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];

  const chartData = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Dataset 1',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        fill: false,
        data: [0, 10, 20, 0, 5, 24, 3],
      },
      {
        type: 'bar' as const,
        label: 'Dataset 2',
        backgroundColor: 'rgb(75, 192, 192)',
        data: [20, 2, 15, 20, 3, 5, 17],
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  return (
    <section className={`mx-5 md:mx-10 lg:mx-0 ${loading ? 'opacity-50' : ''}`}>
      <DataSectionHeader {...headerData} />
      <div className="flex flex-row flex-wrap gap-3 w-full border border-tableBorder rounded-b-2xl border-t-0 px-10 py-7">
        <Chart type="bar" data={chartData} />
      </div>
    </section>
  );
}
