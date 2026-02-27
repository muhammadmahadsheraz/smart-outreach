"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BarChartProps = {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
};

export default function BarChart({ data, labels, height = 208, color = "#3373F5" }: BarChartProps) {
  const labelsArr = labels ?? data.map((_, i) => `${i + 1}`);

  const chartData = {
    labels: labelsArr,
    datasets: [
      {
        data,
        backgroundColor: color,
        borderRadius: 8,
        barThickness: 8,
        maxBarThickness: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
      },
      y: { display: false },
    },
    layout: {
      padding: 0,
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="w-full" style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
