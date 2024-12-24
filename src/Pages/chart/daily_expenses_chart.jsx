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
import { listenToUserExpenses,listenToUserProfile,data_tobe_render,updateUserExpenses,deleteExpense,createExpenses } from '../../Slices/UserSlice';
import Swal from 'sweetalert2';
// import { BarChart } from '@mui/x-charts/BarChart';
import BarChart from './BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { LineChart } from '@mui/x-charts/LineChart';
import AddExpenses from '../Dashboard/Components/AddExpenses';
import AreaChart from './AreaChart';
// import CategorizeExpenses from '../Dashboard/Components/CategorizeExpenses';


const Daily_expenses_chart = () => {
    const Expense_data=useSelector((state)=>state.user.expenses)
    const Monthly_total_data=useSelector((state)=>state.user.month_wise_totalExpense)
    const Chart_data=useSelector((state)=>state.user.chart_data_expense)
    const Total_spent_amt=useSelector((state)=>state.user.total_spent_data)
    // const [Expense_data,setExpense_data]=useState(Expense_data_from_redux);
    const [date, setDate] = useState(null);
    const [modal,setModal]=useState(false)
    const [year_month,setYear_month]=useState(moment().format('YYYY-MM'));
    const dispatch= useDispatch();
    // const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.8); 
    const error=useSelector((state)=>state.user.error)
    const status=useSelector((state)=>state.user.status)
    const [loadingItems, setLoadingItems] = useState({});
    const showModal = () => {
      setModal(true);
    };

  const handleCancel = () => {
      setModal(false);
    };  

useEffect(()=>{
  const currentMonth =(!date)? moment().format('YYYY-MM'):date;
  dispatch(data_tobe_render(currentMonth));
},[Expense_data])



const onChange = (date, dateString) => {
  setDate(dateString);
  setYear_month(dateString);
  dispatch(data_tobe_render(dateString));
  console.log(Monthly_total_data)

};





const deleteitem = async (itemId) => {
  console.log("loadingItems before:", loadingItems);

  // Display the SweetAlert confirmation dialog
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

  // Handle user response
  if (result.isConfirmed) {
    console.log("User confirmed deletion.");
    // Show loader for the specific item
    setLoadingItems((prev) => ({ ...prev, [itemId]: true }));

    try {
      // Dispatch the deletion action
      dispatch(deleteExpense(itemId));
      console.log("Expense deleted:", itemId);
    } catch (error) {
      console.error("Error while deleting the expense:", error);
    } 
  } else {
    console.log("User canceled deletion.");
  }
};

  return (
            <>
              {/* <CategorizeExpenses/> */}
              <AddExpenses  />
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
                  { (Chart_data.length > 0)? (
                    <div style={{ width: '100%' }}>
                      <div style={{display:'flex',justifyContent:'space-between'}}>
                        <p style={{fontSize:'12px',color:'grey'}}>Total spent amount : {Total_spent_amt}</p>
                        <p style={{color:'#127afb',cursor:'pointer' ,fontSize:'12px'}} onClick={showModal}>View expenses</p>
                      </div>
                      <div className={classes.chart_container}>
                          <AreaChart Chart_data={Chart_data} />
                          <BarChart Monthly_total_data={Monthly_total_data}/>
                      </div>
                    </div>
                    ) : (
                      <div className={classes.empty_graph_handler}>No expenses to display</div>
                    )}
                    <My_modal title={'Expenses ('+ year_month +')'}  isModalOpen={modal} handleCancel={handleCancel}>
                        <div className={classes.expense_list_container}>
                        {(Object.keys(Monthly_total_data).length > 0) ? (
                            <List
                              itemLayout="horizontal"
                              dataSource={Monthly_total_data.allExpenses}
                              renderItem={(item, index) => {
                                const date = new Date(item.name);
                                const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
                                const day = date.getDate();

                                return (
                                  <List.Item>
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
                                      <Update_expense itemId={item.id} />
                                      {loadingItems[item.id] ? (
                                          <Loader size={20} />
                                        ) : (
                                          <img
                                            src="/Icons/delete.png"
                                            onClick={() => deleteitem(item.id)}
                                            alt="Delete"
                                            style={{ height: "1.4rem", cursor: "pointer" }}
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
