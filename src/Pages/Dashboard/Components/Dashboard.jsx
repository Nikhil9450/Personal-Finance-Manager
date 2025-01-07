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
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../../firebase';
import LoadingScreen from 'react-loading-screen';
import BarChart from '../../chart/BarChart';
import moment from 'moment';

const Dashboard = () => {
    const [date, setDate] = useState(null);
    const [year_month,setYear_month]=useState(moment().format('YYYY-MM'));

const onChange = (date, dateString) => {
  setDate(dateString);
  setYear_month(dateString);
  dispatch(data_tobe_render(dateString));
  console.log("testing------------->",Monthly_total_data)

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
             <Grid container size={8}>
                <Grid size={6}>
                  <Card width="" height="6rem" >
                     
                  </Card>
                </Grid>
                <Grid size={6}>
                  <Card width="" height="6rem">

                  </Card>
                </Grid>
                <Grid size={12}>
                  <Card width="" height="">
                <Daily_expenses_chart date={date} year_month={year_month}/>
              </Card>
                </Grid>
             </Grid>
            <Grid container size={4}>
            <Grid  size={12}>
              <Card>
                <BarChart date={date} Monthly_total_data={Monthly_total_data}/>
              </Card>
            </Grid>
            <Grid  size={6}>
              <Card>
              </Card>
            </Grid>
            <Grid  size={6}>
              <Card>
              </Card>
            </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
      
  )
}

export default Dashboard