import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ThreatChartProps {
  data: Record<string, number>;
  type: 'doughnut' | 'bar';
}

const severityColors = {
  critical: '#DC2626',
  high: '#EA580C',
  medium: '#D97706',
  low: '#65A30D',
};

const categoryColors = {
  malware: '#DC2626',
  phishing: '#EA580C',
  botnet: '#D97706',
  spam: '#65A30D',
  ddos: '#0891B2',
  bruteforce: '#7C3AED',
  other: '#6B7280',
};

const ThreatChart: React.FC<ThreatChartProps> = ({ data, type }) => {
  const labels = Object.keys(data);
  const values = Object.values(data);

  const getColors = (label: string) => {
    if (label in severityColors) {
      return severityColors[label as keyof typeof severityColors];
    }
    if (label in categoryColors) {
      return categoryColors[label as keyof typeof categoryColors];
    }
    return '#6B7280';
  };

  const backgroundColor = labels.map(getColors);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor,
        borderWidth: 2,
        borderColor: '#FFFFFF',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
    scales: type === 'bar' ? {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    } : undefined,
  };

  return (
    <div className="h-64">
      {type === 'doughnut' ? (
        <Doughnut data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default ThreatChart;