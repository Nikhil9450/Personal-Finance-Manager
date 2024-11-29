import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatePicker } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import classes from './daily_expenses_chart.module.css';
import moment from 'moment';
import My_modal from '../../My_modal';
import { Avatar, List } from 'antd';
import { Button } from 'antd';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
const Daily_expenses_chart = () => {
    const[data,setData]=useState([]);
    const Expense_data=useSelector((state)=>state.user.expenses)
    const [date, setDate] = useState(null);
    const [selectiveData,setSelectiveData]=useState(null);
    const [totalExpenses,setTotalExpenses]=useState(null)
    const [isChartReady, setIsChartReady] = useState(false);
    const [spent_amt, setSpent_amt]= useState(0);
    const [modal,setModal]=useState(false)

    const showModal = () => {
      console.log("opening modal");
      setModal(true);
    };

  const handleCancel = () => {
      console.log("closing modal");
      setModal(false);
    };  
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

useEffect(() => {
  // Simulate chart loading by setting a flag (or use a real condition if needed)
  const chartLoadDelay = setTimeout(() => {
    setIsChartReady(true);
  }, 3000); // Simulate delay of chart loading

  return () => clearTimeout(chartLoadDelay); // Cleanup the timeout on component unmount
}, []);
useEffect(() => {
  if (isChartReady) {
    // Trigger the onChange function after the chart is ready
    onChange(moment(), moment().format('YYYY-MM')); // Pass the current moment and formatted string
  }
}, [isChartReady]);

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
    
    setTotalExpenses(data[year][month].allExpenses) ;

    setSelectiveData(transformedAccumulated); 
    const totalSum = transformedAccumulated.reduce((sum, item) => {
      return sum + Number(item.expense); // Convert expense to a number and add to sum
    }, 0); // Start with an initial sum of 0
    
    console.log("Total sum -------->", totalSum);
    
    // Set the total sum in state
    setSpent_amt(totalSum); 
    // Update state with transformed data
  } else {
    console.log(`No data found for year ${year} and month ${month}`);
    setSelectiveData([]);
    setSpent_amt(0); // Reset state to an empty array if no data is found
  }
};




  return (
    <ResponsiveContainer width={"100%"} height={300}>
                 <div>
                  <p style={{fontSize:'15px',color:'grey'}}>TOTAL SPENT AMT: {spent_amt}</p>
                 </div>
                 <div>
                 <Button type="primary" shape="round" icon={<FormatListBulletedIcon />} size={'large'} onClick={showModal}>
                    VIEW EXPENSE LIST
                </Button>
                 </div>
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
                  {/* <div className={classes.search_icon_container}>
                    <SearchIcon fontSize='1rem' style={{cursor:'pointer'}}/>
                  </div> */}
              </div>

              <BarChart
                width={500}
                height={300}
                data={selectiveData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 40,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="expense" fill="#8884d8" activeBar={<Rectangle fill="green" stroke="green" />} />
              </BarChart>
              <My_modal title="" button_name="Add Expenses" isModalOpen={modal} handleCancel={handleCancel}>
                <List
                    size="small"
                    footer={
                      <div>
                      </div>
                    }
                    bordered
                  >
                    <List.Item>
                    </List.Item>
                    <List.Item>
                    </List.Item>
                  </List>
              </My_modal>
    </ResponsiveContainer>
  );
};


export default Daily_expenses_chart;
