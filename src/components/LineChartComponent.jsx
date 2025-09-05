import React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const ChartComponent = ({ data, datasets }) => {
  // Ensure we have valid datasets and labels
  if (!data || !datasets || datasets.length === 0) {
    return <p>No data available to display.</p>;
  }

  const chartData = {
    labels: data.map((item) => item.date),
    datasets: datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: false,
          text: 'Value',
        },
        min: 0,
        max: 10,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ChartComponent;
