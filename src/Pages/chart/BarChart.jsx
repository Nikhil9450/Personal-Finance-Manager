import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Flex } from 'antd';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ Monthly_total_data }) => {
  // Validate input data
  const categorizedExpenses = Array.isArray(Monthly_total_data?.allExpenses)
    ? Monthly_total_data.allExpenses
    : [];
  console.log("Monthly_total_data", categorizedExpenses);

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
          // '#FF6F61', // Coral
          // '#6B5B95', // Indigo
          // '#88B04B', // Greenery
          // '#F7CAC9', // Rose Quartz
          // '#92A8D1', // Serenity
          // '#955251', // Marsala
          // '#B565A7', // Radiant Orchid
          '#009B77', // Emerald
          // '#DD4124', // Tangerine Tango
          // '#45B8AC', // Mint
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
        barThickness: 30, // Set minimum bar height
        borderRadius: 2
      },
    },
    responsive: true,
    maintainAspectRatio: false, // Allow height adjustment
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'Expenses by Category',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Disable x-axis grid
        },
      },
      // y: {
      //   grid: {
      //     display: false, // Disable y-axis grid
      //   },
      // },
    },
  };

  return (
    <div style={{ height: `${chartHeight}px`, width: '100%' }}>
      {categories.length > 0 && totals.length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <div style={{display:'flex',justifyContent:'center', height:'100%', alignItems:'center'}}>
          <p>No expense to display</p>
        </div>
      )}
    </div>
  );
};

export default BarChart;
