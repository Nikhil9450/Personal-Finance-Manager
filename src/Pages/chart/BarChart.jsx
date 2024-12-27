import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@mui/material';
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
        label: 'Total Expense',
        data: totals,
        backgroundColor: ['#4CAF50', '#FF9800', '#FF5722', '#2196F3', '#9C27B0'],
        borderWidth: 1,
      },
    ],
  };

  // Chart.js options
  const options = {
    indexAxis: 'y', // Horizontal bar chart
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expenses by Category',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    // <Card>
    //   <CardContent>
    //     <Typography variant="h6" gutterBottom>
    //       Expenses by Category
    //     </Typography>
    <>
        {categories.length > 0 && totals.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <Typography color="textSecondary">No data available to display the chart.</Typography>
        )}
    </>
    //   </CardContent>
    // </Card>
  );
};

export default BarChart;
