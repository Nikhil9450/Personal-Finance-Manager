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
import Daily_expenses_chart from '../../chart/daily_expenses_chart';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../../firebase';
const Dashboard = () => {
  const dispatch = useDispatch();

  const fetch_expense_list = async () => {
    const uid = auth.currentUser.uid;
    console.log("Fetching user profile for UID:", uid); // Log the UID
  
    // Reference the 'items' subcollection inside the 'users' collection
    const itemsCollectionRef = collection(db, "users", uid, "items");
  
    try {
      // Fetch all documents from the 'items' subcollection
      const querySnapshot = await getDocs(itemsCollectionRef);
      querySnapshot.forEach((doc) => {
        console.log("Document data:", doc.data());
      });
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  
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
          <Grid size={12}>
            <Card width="" height="">
            <Daily_expenses_chart/>
            </Card>
          </Grid>
           <Grid size={6}>
            <Card>
              <button onClick={fetch_expense_list}>Fetch data</button>
            </Card>
           </Grid>
        </Grid>
      </div>

    </div>
  )
}

export default Dashboard