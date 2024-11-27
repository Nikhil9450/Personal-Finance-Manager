import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Daily_expenses_chart = () => {
    const[data,setData]=useState([]);
    const Expense_data=useSelector((state)=>state.user.expenses)

    useEffect(() => {
      console.log("Expenses data updated ------------>", Expense_data);
  
      // Group expenses by date
      const expensesByDate = Expense_data.reduce((acc, expense) => {
        const date = expense.expenditure_date; // Extract the expenditure date
        if (!acc[date]) {
          acc[date] = []; // Initialize an array for this date if it doesn't exist
        }
        acc[date].push(expense); // Add the expense to the correct date group
        return acc;
      }, {});
  
      // Calculate total expense for each date
      const dateWiseTotalExpenseData = Object.entries(expensesByDate).map(
        ([date, expenseArray]) => {
          const totalAmt = expenseArray.reduce(
            (sum, item) => sum + Number(item.price),
            0
          );
          return {
            name: date, // Date as a name
            expense: totalAmt, // Total expense amount for this date
          };
        }
      );
  
      console.log("Date-wise total amounts:", dateWiseTotalExpenseData);
      setData(dateWiseTotalExpenseData); // Set the calculated data in state
      console.log("Expenses grouped by date:", expensesByDate);
    }, [Expense_data]);

// by year grouping---------------------
useEffect(() => {
  console.log("Expenses data updated ------------>", Expense_data);

  const expensesByYear = Expense_data.reduce((acc, expense) => {
    const [year, month, day] = expense.expenditure_date.split("-"); // Split the date
    const date = `${year}-${month}-${day}`; // Reconstruct the date in desired format

    if (!acc[year]) {
      acc[year] = {}; // Initialize the year if it doesn't exist
    }

    if (!acc[year][month]) {
      acc[year][month] = {
        accumulated: {}, // Temporary object to group by date
        allExpenses: [], // Flat array of all expenses for the month
      };
    }

    // Add to the flat array
    acc[year][month].allExpenses.push({
      name: date,
      expense: Number(expense.price),
    });

    // Add to accumulated expenses
    if (!acc[year][month].accumulated[date]) {
      acc[year][month].accumulated[date] = 0; // Initialize total for this date
    }
    acc[year][month].accumulated[date] += Number(expense.price);

    return acc;
  }, {});

  // Convert the accumulated object to an array of objects
  const formattedExpensesByYear = Object.keys(expensesByYear).reduce(
    (acc, year) => {
      acc[year] = Object.keys(expensesByYear[year]).reduce((yearAcc, month) => {
        const { accumulated, allExpenses } = expensesByYear[year][month];
        yearAcc[month] = {
          accumulated: Object.entries(accumulated).map(([name, expense]) => ({
            name,
            expense,
          })), // Convert accumulated object to array
          allExpenses, // Keep flat array as is
        };
        return yearAcc;
      }, {});
      return acc;
    },
    {}
  );

  console.log("Expenses grouped by year and month:", formattedExpensesByYear);
  // setData(formattedExpensesByYear); // Set the restructured data in state
}, [Expense_data]);
  


    const sample_data = [
  {
    name: "A",
    uv: 4000,
    // pv: 500,
    // amt: 2400,
  },
  {
    name: "B",
    uv: 3000,
    // pv: 50,
    // amt: 2210,
  },
  {
    name: "C",
    uv: 2000,
    // pv: 300,
    // amt: 2290,
  },
  {
    name: "D",
    uv: 2780,
    // pv: 90,
    // amt: 2000,
  },
  {
    name: "E",
    uv: 1890,
    // pv: 10,
    // amt: 2181,
  },
  {
    name: "F",
    uv: 2390,
    // pv: 200,
    // amt: 2500,
  },
  {
    name: "G",
    uv: 3490,
    // pv: 150,
    // amt: 2100,
  },
];
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        {/* <Line type="monotone" dataKey="amt" stroke="#32ca9d" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};


export default Daily_expenses_chart;
