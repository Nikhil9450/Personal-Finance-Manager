import {React,useEffect, useState} from 'react'
import Navbar from '../../Navbar/Components/Navbar'
import classes from './Dashboard.module.css'
import Card from './Card'
import Grid from '@mui/material/Grid2';
import { motion } from "framer-motion"
import AddExpenses from './AddExpenses';
import { auth } from '../../../firebase';
import { useDispatch,useSelector } from 'react-redux';
import { listenToUserProfile, listenToUserExpenses, data_tobe_render } from '../../../Slices/UserSlice';
import { DatePicker } from 'antd';
import Daily_expenses_chart from '../../chart/daily_expenses_chart';
import { db } from '../../../firebase';
import LoadingScreen from 'react-loading-screen';
import BarChart from '../../chart/BarChart';
import moment from 'moment';
import { doc, collection, onSnapshot, getDoc, updateDoc ,deleteDoc,addDoc,setDoc } from 'firebase/firestore';
const Dashboard = () => {
    const [date, setDate] = useState(null);
    const [year_month,setYear_month]=useState(moment().format('YYYY-MM'));
    const [salary,setSalary]=useState('');
    const currentUser = auth.currentUser;
    const total_spent_amt=useSelector((state)=>state.user.total_spent_data)
const onChange = (date, dateString) => {
  setDate(dateString);
  setYear_month(dateString);
  dispatch(data_tobe_render(dateString));
  fetch_salary(dateString) ;
  // console.log("testing------------->",Monthly_total_data)

};
  
const fetch_salary = (yearMonth = year_month) => {
  console.log("testing------------->",Monthly_total_data);
  try {
    if (!currentUser || !currentUser.uid) {
      console.error('User is not authenticated');
      return;
    }

    if (!year_month) {
      console.error('Year and month are not defined');
      setSalary('Year and month are not defined');
      return;
    }

    const userExpenseListRef = doc(
      db,
      'users',
      currentUser.uid,
      'salary_detail',
      yearMonth
    );

    onSnapshot(userExpenseListRef, (snapshot) => {
      if (snapshot.exists()) {
        const salary = snapshot.data(); // For document snapshot, use `.data()`
        console.log("salary----------->", salary);
        setSalary(salary.salary)
      } else {
        console.error('No salary details found');
        setSalary('No salary details found')
      }
    });
  } catch (error) {
    console.error('Error listening to salary details:', error.message);
  }
};

  const dispatch = useDispatch();
  const [exp_loader,set_expLoader]=useState(true);
  // const Chart_data=useSelector((state)=>state.user.chart_data_expense)
     const Monthly_total_data=useSelector((state)=>state.user.month_wise_totalExpense)
   
  useEffect(() => {
    if (auth.currentUser) {
      console.log('UID from auth.currentUser:', auth.currentUser.uid); // Log UID
      dispatch(listenToUserProfile(auth.currentUser.uid));
      dispatch(listenToUserExpenses(auth.currentUser.uid));
      fetch_salary(year_month);
      console.log("year_month----------->",year_month);
    } else {
      console.log('auth.currentUser is null');
    }
  }, [dispatch]);

  useEffect(()=>{
   setTimeout(()=>{
    set_expLoader(false);
   },5000)
  })


  return (
    (exp_loader)?
    <LoadingScreen
      loading={true}
      bgColor="rgba(255,255,255,0.8)"
      spinnerColor="#9ee5f8"
      textColor="#676767"
      logoSrc=""
      text=""
    >
      {" "}
    </LoadingScreen>
    :
      <div className={classes.dashboard}>
        <Navbar/>
        {/* <AddExpenses/> */}

        <div className={classes.dashboard_content}>
        <div className={classes.date_picker_container}>
          <DatePicker style={{ width: '10rem', height:'2.5rem', padding: '0 15px', textAlign: 'center' ,borderRadius:'2rem',color:'grey'}} onChange={onChange}  className="customDropdown" picker="month" />
        </div>
          <Grid container rowSpacing={3} columnSpacing={3}>
             <Grid container rowSpacing={3} columnSpacing={3} size={8}>
                <Grid size={6}>
                  <Card width="" height="6rem" >
                    <div className={classes.flex_div}>
                    <p className={classes.styled_text} style={{color:"#c88fd0"}}>{salary}</p> 
                    </div>
                  </Card>
                </Grid>
                <Grid size={6}>
                  <Card width="" height="6rem">
                      <div className={classes.flex_div}>
                        <p className={classes.styled_text}>{total_spent_amt}</p>
                      </div>
                  </Card>
                </Grid>
                <Grid size={12}>
                  <Card width="" height="">
                <Daily_expenses_chart date={date} year_month={year_month}/>
              </Card>
                </Grid>
             </Grid>
            <Grid container rowSpacing={3} columnSpacing={3} size={4}>
            <Grid  size={12}>
              <Card>
                <BarChart date={date} Monthly_total_data={Monthly_total_data}/>
              </Card>
            </Grid>
            <Grid  size={6}>
              <Card height='12rem'>
              </Card>
            </Grid>
            <Grid  size={6}>
              <Card height='12rem'>
              </Card>
            </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
      
  )
}

export default Dashboard