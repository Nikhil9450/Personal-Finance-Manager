import React, { useEffect, useState ,useRef} from 'react';
import { useSelector } from 'react-redux';
// import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatePicker } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import classes from './daily_expenses_chart.module.css';
import moment from 'moment';
import My_modal from '../../My_modal';
import Update_expense from '../Dashboard/Components/Update_expense';
import { Avatar, List } from 'antd';
import { Button } from 'antd';
import Loader from '../../Loader';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useDispatch } from 'react-redux';
import { listenToUserExpenses,listenToUserProfile } from '../../Slices/UserSlice';
import Swal from 'sweetalert2';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { LineChart } from '@mui/x-charts/LineChart';
import { doc, collection, addDoc ,updateDoc ,deleteDoc} from "firebase/firestore";
import { db,auth } from '../../firebase';
import AddExpenses from '../Dashboard/Components/AddExpenses';




const Daily_expenses_chart = () => {
    const[data,setData]=useState([]);
    const Expense_data=useSelector((state)=>state.user.expenses)
    const [date, setDate] = useState(null);
    const [selectiveData,setSelectiveData]=useState(null);
    const [totalExpenses,setTotalExpenses]=useState(null)
    const [isChartReady, setIsChartReady] = useState(false);
    const [spent_amt, setSpent_amt]= useState(0);
    const [modal,setModal]=useState(false)
    const [year_month,setYear_month]=useState(moment().format('YYYY-MM'));
    const [deletingItem, setDeletingItem] = useState(null);
    const dispatch= useDispatch();
    const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.8); 
    const showModal = () => {
      setModal(true);
    };

  const handleCancel = () => {
      setModal(false);
    };  
    useEffect(() => {  
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
      }, [Expense_data]);

// by year grouping---------------------
useEffect(() => {
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
      discription:expense.description,
      expense: Number(expense.price),
      id:expense.id,
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

const onChange = (date,dateString) => {
  setDate(dateString); // Set the string representation (e.g., "2024-11")
  console.log("Selected Month (Moment Object):", date); // Moment.js object
  console.log("Selected Month (String):", dateString); // String representation
  setYear_month(dateString);

  const [year, month] = dateString.split('-'); // Extract year and month
  // console.log("Year:", year, "Month:", month);

  if (data[year] && data[year][month]) {
    // console.log("Filtered Data for Year and Month:", data[year][month]);

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

    // console.log("Transformed and Sorted Accumulated Data:", transformedAccumulated);
    
    setTotalExpenses(data[year][month].allExpenses) ;
    console.log("total expenses------------------->",data[year][month].allExpenses)
    setSelectiveData(transformedAccumulated); 
    const totalSum = transformedAccumulated.reduce((sum, item) => {
      return sum + Number(item.expense); // Convert expense to a number and add to sum
    }, 0); // Start with an initial sum of 0
    
    // console.log("Total sum -------->", totalSum);
    
    // Set the total sum in state
    setSpent_amt(totalSum); 
    // Update state with transformed data
  } else {
    // console.log(`No data found for year ${year} and month ${month}`);
    setSelectiveData([]);
    setSpent_amt(0); // Reset state to an empty array if no data is found
    setTotalExpenses(null)
  }
};



const deleteExpense = async (itemId, day, expense_price) => {
  if (!auth.currentUser) {
    console.error("No user is logged in.");
    return;
  }
  console.log("before updating selectiveData",selectiveData)
  console.log("before updating spent_amt",spent_amt)
  const result = await Swal.fire({
    text: "Are you sure you want to delete this expense?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    customClass: {
      popup: "custom-swal-popup",
    },
  });

  if (!result.isConfirmed) return;

  setDeletingItem(itemId);

  try {
    const user = auth.currentUser;
    const itemDoc = doc(db, "users", user.uid, "items", itemId);

    await deleteDoc(itemDoc);

    // Update `totalExpenses` state by filtering out the deleted item
    const updatedExpenses = totalExpenses.filter((item) => item.id !== itemId);
    setTotalExpenses(updatedExpenses);
    
    // Update `selectiveData` state
    const updatedSelectiveData = selectiveData.map((item) => {
      if (item.name == day) {
        const updatedExpense = Number(item.expense) - Number(expense_price);
        return { ...item, expense: updatedExpense };
      }
      return item;
    }).filter(item => item.expense > 0); // Remove days with no expenses

    setSelectiveData(updatedSelectiveData);

    

    // Recalculate the total sum
    const totalSum = updatedSelectiveData.reduce((sum, item) => sum + Number(item.expense), 0);
    setSpent_amt(totalSum);
    console.log("after updating selectiveData",updatedSelectiveData)
    console.log("after updating spent_amt",totalSum)
    Swal.fire({
      text: "Expense deleted successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error during deletion:", error);

    Swal.fire({
      text: "Failed to delete expense. Please try again.",
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    });
  } finally {
    setDeletingItem(null);

    // Optionally refresh user data
    dispatch(listenToUserProfile(auth.currentUser.uid));
    dispatch(listenToUserExpenses(auth.currentUser.uid));
  }
};

const handleDataUpdate = (updated_total_expenses,updated_selective_data,updated_total_sum) => {
  // console.log("updated amount before----------->",totalExpenses);
  // console.log("updated amount after----------->",updated_total_expenses);
  // console.log("selectiveData after----------->",selectiveData);
  // console.log("updated_selective_data after----------->",updated_selective_data);
  // console.log("total sum before", spent_amt);
  // console.log("total sum after", updated_total_sum)
  setSelectiveData(updated_selective_data);
  setTotalExpenses(updated_total_expenses);
  setSpent_amt(updated_total_sum);
};

useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth * 0.8); // Adjust width on window resize.
    };

    handleResize(); // Set width on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
            <>
            <AddExpenses  initial_total_expenses={totalExpenses} initial_selective_data={selectiveData} initial_spent_amt={spent_amt}  onAddData={handleDataUpdate} />
                 <div className="" style={{display:'flex',justifyContent:'end', marginBottom:'5px'}}>
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
                  </div>
                  {/* {totalExpenses && totalExpenses.length > 0 ?
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <p style={{fontSize:'12px',color:'grey', marginLeft: '5rem'}}>Total spent amount : {spent_amt}</p>
                      <p style={{color:'#127afb',cursor:'pointer' ,fontSize:'12px',marginRight:'2rem'}} onClick={showModal}>View expenses</p>
                    </div>:
                    <div></div>} */}
                  {totalExpenses && totalExpenses.length > 0 ? (
                    <div style={{ width: '100%' }}>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <p style={{fontSize:'12px',color:'grey'}}>Total spent amount : {spent_amt}</p>
                      <p style={{color:'#127afb',cursor:'pointer' ,fontSize:'12px'}} onClick={showModal}>View expenses</p>
                    </div>
                    <div className={classes.chart_container}>
                        <LineChart
                          width={chartWidth}
                          height={300}
                          dataset={selectiveData}
                          series={[{ dataKey: "expense", label: "Expenses" }]}
                          xAxis={[{ scaleType: "point", dataKey: "name" }]}
                        />
                    </div>
                  </div>

                    ) : (
                      <div className={classes.empty_graph_handler}>No expenses to display</div>
                    )}

              <My_modal title={'Expenses ('+ year_month +')'}  isModalOpen={modal} handleCancel={handleCancel}>
                  <div className={classes.expense_list_container}>
                  {totalExpenses && totalExpenses.length > 0 ? (
                      <List
                        itemLayout="horizontal"
                        dataSource={totalExpenses}
                        renderItem={(item, index) => {
                          const date = new Date(item.name);
                          const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
                          const day = date.getDate();

                          return (
                            <List.Item
                            // actions={<a key="list-loadmore-edit">edit</a>}
                            >
                              <List.Item.Meta
                                avatar={
                                  <div className={classes.list_avatar}>
                                    <h4>{month}</h4>
                                    <p>{day}</p>
                                  </div>
                                }
                                title={<h5>{item.discription}</h5>}
                                description={<p>{item.expense}</p>}
                              />
                              {/* <a onClick={() => edit_expense(item.id)}>edit</a> */}
                              <Update_expense itemId={item.id} date={day} initial_total_expenses={totalExpenses} initial_selective_data={selectiveData} initial_spent_amt={spent_amt}  onUpdateData={handleDataUpdate} />
                                {deletingItem === item.id ? (
                                  <Loader size={20} /> // Replace the icon with a loader
                                ) : (
                                  <img
                                    src="/Icons/delete.png"
                                    onClick={() => deleteExpense(item.id,day,item.expense)}
                                    alt="Delete"
                                    style={{ height: '1.4rem', cursor: 'pointer' }}
                                  />
                                )}                           
                              </List.Item>
                          );
                        }}
                      />
                    ) : (
                      <div className={classes.empty_list_handler}>No expenses to display</div>
                    )}
                  </div>
              </My_modal>
            </>
   
  );
};


export default Daily_expenses_chart;
