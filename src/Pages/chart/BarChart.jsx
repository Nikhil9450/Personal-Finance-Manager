import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Typography } from '@mui/material';
import classes from './BarChart.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ Monthly_total_data }) => {
  // Validate input data
  const categorizedExpenses = Array.isArray(Monthly_total_data?.allExpenses)
    ? Monthly_total_data.allExpenses
    : [];
  
  // Calculate totals per category
  const categoryTotals = categorizedExpenses.reduce((acc, item) => {
    const { category, expense } = item || {}; // Safely destructure item
    if (category && typeof expense === "number") {
      acc[category] = (acc[category] || 0) + expense;
    }
    return acc;
  }, {});

  // Extract categories and totals
  const categories = Object.keys(categoryTotals);
  const totals = Object.values(categoryTotals);

  // Chart.js data
  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Expense',
        data: totals,
        backgroundColor: [
          '#FF6F61', // Coral
          '#6B5B95', // Indigo
          '#88B04B', // Greenery
          '#F7CAC9', // Rose Quartz
          '#92A8D1', // Serenity
          '#955251', // Marsala
          '#B565A7', // Radiant Orchid
          '#009B77', // Emerald
          '#DD4124', // Tangerine Tango
          '#45B8AC', // Mint
        ],
        borderWidth: 1,
      },
    ],
  };

  // Calculate dynamic chart height based on categories
  const chartHeight = Math.max(200, categories.length * 25);

  // Chart.js options
  const options = {
    indexAxis: 'y', // Horizontal bar chart
    elements: {
      bar: {
        borderWidth: 2,
        barThickness: 30, // Default bar thickness
        borderRadius: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Disable x-axis grid
        },
      },
    },
  };

  return (
    <div className={`${classes.chartContainer}`}>
      {categories.length > 0 && totals.length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <div className={classes.noDataMessage}>
          <p>No expense to display</p>
        </div>
      )}
    </div>
  );
};

export default BarChart;
