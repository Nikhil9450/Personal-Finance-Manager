import {React,useEffect} from 'react'
import Navbar from '../../Navbar/Components/Navbar'
import classes from './Dashboard.module.css'
import Card from './Card'
import Grid from '@mui/material/Grid2';
import { motion } from "framer-motion"
import AddExpenses from './AddExpenses';
import { auth } from '../../../firebase';
import { useDispatch,useSelector } from 'react-redux';
import { fetchUserProfile,fetch_expenses_list } from '../../../Slices/UserSlice';
import Daily_expenses_chart from '../../chart/daily_expenses_chart';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../../firebase';
const Dashboard = () => {
  const dispatch = useDispatch();
  const Expense_data=useSelector((state)=>state.user.expenses)
  // const fetch_expense_list = async () => {
  //   const uid = auth.currentUser.uid;
  //   console.log("Fetching user profile for UID:", uid); // Log the UID
  
  //   // Reference the 'items' subcollection inside the 'users' collection
  //   const itemsCollectionRef = collection(db, "users", uid, "items");
  
  //   try {
  //     // Fetch all documents from the 'items' subcollection
  //     const querySnapshot = await getDocs(itemsCollectionRef);
  //     querySnapshot.forEach((doc) => {
  //       console.log("Document data:", doc.data());
  //     });
  //   } catch (error) {
  //     console.error("Error fetching items:", error);
  //   }
  // };
  
  useEffect(() => {
    if (auth.currentUser) {
      console.log('UID from auth.currentUser:', auth.currentUser.uid); // Log UID
      dispatch(fetchUserProfile(auth.currentUser.uid));
      dispatch(fetch_expenses_list(auth.currentUser.uid));
    } else {
      console.log('auth.currentUser is null');
    }
  }, [dispatch]);

  // useEffect(() => {
  //   console.log("Expenses data updated ------------>", Expense_data);
  //   const expensesByDate = Expense_data.reduce((acc, expense) => {
  //     const date = expense.expenditure_date; // Extract the expenditure date
  //     if (!acc[date]) {
  //       acc[date] = []; // If no array exists for this date, initialize one
  //     }
  //     acc[date].push(expense); // Add the current expense to the array for this date
  //     return acc; // Return the updated accumulator object
  //   }, {});
    
  //   const dateWiseTotalExpenseAmt = {};

  //   Object.entries(expensesByDate).forEach(([date, expenseArray]) => {
  //     const totalAmt = expenseArray.reduce((sum, item) => sum + Number(item.price), 0);
  //     dateWiseTotalExpenseAmt[date] = totalAmt;
  //   });
    
  //   console.log("Date-wise total amounts:", dateWiseTotalExpenseAmt);
  //   console.log("expense by date------->",expensesByDate)
  // }, [Expense_data]);


  return (
    <div className={classes.dashboard}>
      <Navbar/>
      <AddExpenses/>

      <div className={classes.dashboard_content}>
        <Grid container rowSpacing={5} columnSpacing={5}>
          <Grid size={12}>
            <Card width="" height="315px">
            <Daily_expenses_chart/>
            </Card>
          </Grid>
           <Grid size={6}>
            <Card width="" height="400px">
            </Card>
           </Grid>
        </Grid>
      </div>

    </div>
  )
}

export default Dashboard