import {React,useEffect} from 'react'
import Navbar from '../../Navbar/Components/Navbar'
import classes from './Dashboard.module.css'
import Card from './Card'
import Grid from '@mui/material/Grid2';
import { motion } from "framer-motion"
import AddExpenses from './AddExpenses';
import AddSalary from './AddSalary';
import AddButton from '../../../My_button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { auth } from '../../../firebase';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from '../../../Slices/UserSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (auth.currentUser) {
      console.log('UID from auth.currentUser:', auth.currentUser.uid); // Log UID
      dispatch(fetchUserProfile(auth.currentUser.uid));
    } else {
      console.log('auth.currentUser is null');
    }
  }, [dispatch]);
  return (
    <div className={classes.dashboard}>
      <Navbar/>
      <AddExpenses/>

      <div className={classes.dashboard_content}>
        <Grid container rowSpacing={5} columnSpacing={5}>
          <Grid size={8}>
            <Card width="" height="200px">
              {/* Content goes here */}
            </Card>
          </Grid>
          
        </Grid>
      </div>

    </div>
  )
}

export default Dashboard