import {React,useEffect} from 'react'
import Navbar from '../../Navbar/Components/Navbar'
import classes from './Dashboard.module.css'
import Card from './Card'
import Grid from '@mui/material/Grid2';
import { motion } from "framer-motion"
import AddExpenses from './AddExpenses';
import { auth } from '../../../firebase';
import { useDispatch,useSelector } from 'react-redux';
import { listenToUserProfile, listenToUserExpenses } from '../../../Slices/UserSlice';

import Daily_expenses_chart from '../../chart/daily_expenses_chart';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../../firebase';
import LoadingScreen from 'react-loading-screen';
const Dashboard = () => {
  const dispatch = useDispatch();
  const exp_loader=useSelector((state)=>state.user.loader)
  // const Chart_data=useSelector((state)=>state.user.chart_data_expense)
   
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
          <Grid container rowSpacing={5} columnSpacing={5}>
            <Grid size={8}>
              <Card width="" height="">
              {/* <div syle={{height:'300px'}}> */}
                <Daily_expenses_chart/>
              {/* </div> */}
              </Card>
            </Grid>
            <Grid size={4}>
              <Card>
              </Card>
            </Grid>
          </Grid>
        </div>

      </div>
      
  )
}

export default Dashboard