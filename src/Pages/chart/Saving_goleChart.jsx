import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import classes from './Saving_goalChart.module.css'
ChartJS.register(ArcElement, Tooltip, Legend);

const SavingGoalChart = ({ savings, goal }) => {
  const percentage = useMemo(() => Math.min((savings / goal) * 100, 100).toFixed(1), [savings, goal]); // Cap percentage at 100
  const remaining = Math.max(goal - savings, 0);

  console.log("savings, goal, percentage ----->", savings, goal, percentage);

  const data = useMemo(
    () => ({
      labels: ['Achieved', 'Remaining'],
      datasets: [
        {
          data: [savings, remaining],
          backgroundColor: ['#4CAF50', '#FF5252'], // Colors for the chart
          hoverBackgroundColor: ['#45a049', '#e53935'],
          borderWidth: 1,
        },
      ],
    }),
    [savings, remaining]
  );

  const options = useMemo(
    () => ({
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
    }),
    []
  );

  // Custom plugin for center text
  const centerTextPlugin = useMemo(
    () => ({
      id: 'centerText',
      beforeDraw: (chart) => {
        const { ctx, width } = chart;
        const { top, bottom } = chart.chartArea;
        const centerY = (top + bottom) / 2;

        ctx.save();
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#4CAF50';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Use the latest percentage directly
        ctx.fillText(`${percentage}%`, width / 2, centerY);
        ctx.restore();
      },
    }),
    [percentage]
  );

  return (
    <div className={classes.chartContainer} >
    <div className={classes.doughnutContainer}>
      <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
    </div>
      <div className={classes.ContainerItem} >
        <div className={classes.labelContainer}>
          <label htmlFor="">Saving Goal</label>
          <div className={classes.textContainer} >
            <p>{goal}</p>
          </div>
        </div>
        <div>
        <label htmlFor="">Current Saving</label>
          <div className={classes.textContainer} >
            <p>{savings}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingGoalChart;
