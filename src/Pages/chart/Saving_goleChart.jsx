import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SavingGoalChart = ({ savings, goal }) => {
  const percentage = Math.min((savings / goal) * 100, 100); // Cap percentage at 100
  const remaining = Math.max(goal - savings, 0);

  const data = {
    labels: ['Achieved', 'Remaining'],
    datasets: [
      {
        data: [savings, remaining],
        backgroundColor: ['#4CAF50', '#FF5252'], // Colors for the chart
        hoverBackgroundColor: ['#45a049', '#e53935'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12, // Legend font size
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const label = context.label;
            return `${label}: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '150px', margin: '0 auto',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'  }}>
      <h5 style={{ textAlign: 'center' }}>Savings Goal</h5>
      <Doughnut data={data} options={options} />
        {/* <p style={{ textAlign: 'center', marginTop: '10px' }}>
            Achieved: <strong>{percentage.toFixed(2)}%</strong>
        </p> */}
    </div>
  );
};

export default SavingGoalChart;
