import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = () => {
  // Sample category summary data (replace this with your actual data)
  const categorySummary = [
    { category: "Electronics", total: 5020 },
    { category: "Food", total: 1000 },
    { category: "Personal Expenses", total: 500 },
    // Add more categories here...
  ];

  // Extract category names and total expenses from the data
  const categories = categorySummary.map(item => item.category);
  const totals = categorySummary.map(item => item.total);

  // Chart options and data
  const chartOptions = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: categories, // Use category names on the x-axis
    },
    title: {
      text: 'Expenses by Category',
      align: 'center',
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#4CAF50', '#FF9800', '#FF5722'], // Customize the bar colors
  };

  const chartData = [
    {
      name: 'Total Expense',
      data: totals, // Total expenses corresponding to each category
    },
  ];

  return (
    <div className="chart-container">
      <Chart options={chartOptions} series={chartData} type="bar" height={350} />
    </div>
  );
};

export default BarChart;
