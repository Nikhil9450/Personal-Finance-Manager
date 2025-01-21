import React from 'react';
import classes from './BarChart.module.css';

const BarChart = ({ Monthly_total_data }) => {
  const categorizedExpenses = Array.isArray(Monthly_total_data?.allExpenses)
    ? Monthly_total_data.allExpenses
    : [];

  const categoryTotals = categorizedExpenses.reduce((acc, item) => {
    const { category, expense } = item || {};
    if (category && typeof expense === 'number') {
      acc[category] = (acc[category] || 0) + expense;
    }
    return acc;
  }, {});

  const categories = Object.keys(categoryTotals);
  const totals = Object.values(categoryTotals);
  const maxExpense = Math.max(...totals, 0);

  return (
    <div className={classes.chartContainer}>
      {categories.length > 0 && totals.length > 0 ? (
        <div>
          <h3 className={classes.chartTitle}>Expense Overview</h3>
          {categories.map((category, index) => (
            <div key={index} className={classes.barRow}>
              <span className={classes.categoryLabel}>{category}</span>
              <div className={classes.barWrapper}>
                <div
                  className={classes.bar}
                  style={{
                    width: `${(totals[index] / maxExpense) * 100}%`,
                    background: `linear-gradient(90deg, #FF6F61, #FF9671)`,
                  }}
                />
                <span className={classes.barValue}>₹{totals[index].toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.noDataMessage}>
          <p>No expense to display</p>
        </div>
      )}
    </div>
  );
};

export default BarChart;
