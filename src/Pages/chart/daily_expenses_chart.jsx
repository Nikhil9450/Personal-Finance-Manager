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
import { DatePicker } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import classes from './daily_expenses_chart.module.css';
import moment from 'moment';

const Daily_expenses_chart = () => {
    const[data,setData]=useState([]);
    const Expense_data=useSelector((state)=>state.user.expenses)
    const [date, setDate] = useState(null);
    const [selectiveData,setSelectiveData]=useState(null);

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
      // setData(dateWiseTotalExpenseData); // Set the calculated data in state
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
  setData(formattedExpensesByYear); // Set the restructured data in state
  // onChange(moment(), moment().format('YYYY-MM'));
}, [Expense_data]);

// const onChange = (date, dateString) => {
//   setDate(dateString); // Set the string representation (e.g., "2024-11")
//   console.log("Selected Month (Moment Object):", date); // Moment.js object
//   console.log("Selected Month (String):", dateString); // String representation
//   console.log("split date-------->", dateString.split('-'));
//   const year=dateString.split('-')[0]
//   const month=dateString.split('-')[1]
//   console.log("output--------->",data[year][month]) 
//   setSelectiveData((data[year][month]).accumulated);
// };
const onChange = (date, dateString) => {
  alert("inside on change");
  setDate(dateString); // Set the string representation (e.g., "2024-11")
  console.log("Selected Month (Moment Object):", date); // Moment.js object
  console.log("Selected Month (String):", dateString); // String representation

  const [year, month] = dateString.split('-'); // Extract year and month
  console.log("Year:", year, "Month:", month);

  if (data[year] && data[year][month]) {
    console.log("Filtered Data for Year and Month:", data[year][month]);

    // Transform the accumulated data to extract day and sort by day
    const transformedAccumulated = data[year][month].accumulated
      .map((item) => {
        const day = item.name.split('-')[2]; // Extract day from 'YYYY-MM-DD'
        return {
          name: day, // Replace with the day
          expense: item.expense, // Retain the expense
        };
      })
      .sort((a, b) => Number(a.name) - Number(b.name)); // Sort by day numerically

    console.log("Transformed and Sorted Accumulated Data:", transformedAccumulated);

    setSelectiveData(transformedAccumulated); // Update state with transformed data
  } else {
    console.log(`No data found for year ${year} and month ${month}`);
    setSelectiveData([]); // Reset state to an empty array if no data is found
  }
};




  return (
    <ResponsiveContainer width={"100%"} height={300}>
                 <div className="" style={{display:'flex',justifyContent:'end'}}>
                  <style>
                    {`.ant-picker-header-view{
                        display:flex;
                    }
                      .ant-picker-dropdown .ant-picker-header {
                          /* Adjust these properties as needed */
                          width: 50% !important;         /* Ensures the header fits the dropdown width */
                          padding: 8px;        /* Adjust padding if needed */
                          display: flex;
                          {/* justify-content: center; /* Centers header content */ */}
                      }
                    `}
                  </style>
                  <DatePicker style={{ width: '10rem', height:'2.5rem', padding: '0 8px', textAlign: 'center' ,borderRadius:'1rem',color:'lightgrey'}} onChange={onChange}  className="customDropdown" picker="month" />
                  <div className={classes.search_icon_container}>
                    <SearchIcon fontSize='1rem' style={{cursor:'pointer'}}/>
                  </div>
              </div>
      <LineChart data={selectiveData}>
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
      </LineChart>
    </ResponsiveContainer>
  );
};


export default Daily_expenses_chart;
