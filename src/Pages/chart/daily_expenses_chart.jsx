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
    const [updated_expense, setUpdated_expense] = useState([]);
    
    // const [Expense_data,setExpense_data]=useState(Expense_data_from_redux);
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

useEffect(()=>{
  setUpdated_expense(Expense_data)
},[Expense_data])

useEffect(() => {
  // Simulate chart loading by setting a flag (or use a real condition if needed)
  const chartLoadDelay = setTimeout(() => {
    setIsChartReady(true);
  }, 3000); // Simulate delay of chart loading

  return () => clearTimeout(chartLoadDelay); // Cleanup the timeout on component unmount
}, []);

useEffect(() => {
  console.log("Updated expense state:", updated_expense);
  const currentMonth = moment().format('YYYY-MM');
  render_data(updated_expense, currentMonth);
  // console.log("selective data-------->",selectiveData);
  // console.log("spentamt--------->",spent_amt);
  // console.log("total expenses from use effect--------->",totalExpenses);
}, [updated_expense]);

useEffect(() => {
  if (isChartReady) {
    const currentMonth = moment().format('YYYY-MM');
    onChange(moment(), currentMonth); // Trigger data load for the current month
  }
}, [isChartReady]);

const onChange = (date, dateString) => {
  console.log("onChange triggered");
  console.log("Current Data:", data); // Ensure data is updated
  setDate(dateString);
  setYear_month(dateString);

  render_data(updated_expense ,dateString);
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
    totalExpenses.allExpenses = totalExpenses.allExpenses.filter((item) => item.id !== itemId);
    setTotalExpenses(totalExpenses);
    
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
  setSelectiveData(updated_selective_data);
  totalExpenses.allExpenses=updated_total_expenses
  // setTotalExpenses(updated_total_expenses);
  setSpent_amt(updated_total_sum);
};

const handleDataAdd = (newExpense) => {
  console.log("New expense added:", newExpense);

  // Combine the new expense with existing ones
  // const updatedExpenses = [...updated_expense, ...newExpense];
  
  // Update the main state
  setUpdated_expense(newExpense);

  // Re-render data with the updated expenses
  const currentMonth = moment().format('YYYY-MM');
  render_data(newExpense ,currentMonth);
};

const render_data = (expenseToRender, dateString) => {
  let spentamt=0;
  console.log("Render_data triggered",expenseToRender);

  // Skip if expense data hasn't changed
  if (!expenseToRender || !dateString) return;
  console.log("inside if---------");
  const expensesByYear = expenseToRender.reduce((acc, expense) => {
    const [year, month, day] = expense.expenditure_date.split("-");
    const date = `${year}-${month}-${day}`;
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = { accumulated: {}, allExpenses: [] };

    acc[year][month].allExpenses.push({
      name: date,
      description: expense.description,
      expense: Number(expense.price),
      id: expense.id,
    });

    if (!acc[year][month].accumulated[date]) acc[year][month].accumulated[date] = 0;
    acc[year][month].accumulated[date] += Number(expense.price);
    return acc;
  }, {});

  // Update state only if data has changed
  setData(expensesByYear);
  console.log("expense by year--------->",expensesByYear);
  // Handle current month data
  console.log("datestring--------->",dateString,dateString.split("-"));
  const [year, month] = dateString.split("-");
  if (expensesByYear[year] && expensesByYear[year][month]) {
    setTotalExpenses( expensesByYear[year][month]);
    console.log("total expenses--------->",expensesByYear[year][month]);

    console.log("inside inner if")

    const transformedAccumulated = Object.entries(expensesByYear[year][month].accumulated)
    .map(([date, expense]) => ({
      name: date.split("-")[2], // Extract the day
      expense,
    }))
    .sort((a, b) => Number(a.name) - Number(b.name)); 
    
    setSelectiveData(transformedAccumulated);

    console.log("selective data----->",transformedAccumulated)
    const totalSum = transformedAccumulated.reduce((sum, item) => sum + Number(item.expense), 0);
    console.log("total sum--------->",totalSum);
    setSpent_amt(totalSum);
    // console.log("total expenses length----------->",totalExpenses.length)
  } else {
    setSelectiveData([]);
    setSpent_amt(0);
  }
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
            <AddExpenses  onUpdateExpenses={handleDataAdd} />
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
                  {totalExpenses ? (
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
                  {totalExpenses ? (
                      <List
                        itemLayout="horizontal"
                        dataSource={totalExpenses.allExpenses}
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
                                title={<h5>{item.description}</h5>}
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
