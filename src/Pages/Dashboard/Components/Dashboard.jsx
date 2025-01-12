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
import SavingGoalChart from '../../chart/Saving_goleChart';
import { doc, collection, onSnapshot, getDoc, updateDoc ,deleteDoc,addDoc,setDoc } from 'firebase/firestore';
// import SavingGoalChart from '../../chart/Saving_goleChart';
const Dashboard = () => {
  const [date, setDate] = useState(null);
  const [year_month, setYear_month] = useState(moment().format('YYYY-MM'));
  const [salary, setSalary] = useState(0); // Default to 0
  const [savingGoal, setSavingGoal] = useState(0);
  const [savings, setSavings] = useState(0);
  const [remainingSalary,setRemainingSalary]=useState(0);
  const currentUser = auth.currentUser;
  const total_spent_amt = useSelector((state) => state.user.total_spent_data);

  const dispatch = useDispatch();
  const [exp_loader, set_expLoader] = useState(true);
  const Monthly_total_data = useSelector((state) => state.user.month_wise_totalExpense);

  const onChange = (date, dateString) => {
    setDate(dateString);
    setYear_month(dateString);
    dispatch(data_tobe_render(dateString));
    fetch_salary(dateString);
    fetch_savingGoal(dateString);
  };

  const fetch_salary = (yearMonth = year_month) => {
    if (!currentUser || !currentUser.uid) {
      console.error('User is not authenticated');
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
        const data = snapshot.data();
        const salaryValue = parseInt(data.salary || 0); // Default to 0 if invalid
        setSalary(salaryValue);
        console.log("salaryValue------------>",salaryValue);
      } else {
        console.error('No salary details found');
        setSalary(0); // Set to 0 if no data
      }
    });
  };

  const fetch_savingGoal = (yearMonth = year_month) => {
    if (!currentUser || !currentUser.uid) {
      console.error('User is not authenticated');
      return;
    }

    const userExpenseListRef = doc(
      db,
      'users',
      currentUser.uid,
      'saving_detail',
      yearMonth
    );

    onSnapshot(userExpenseListRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const savingGoal = parseInt(data.Saving_goal || 0); // Default to 0 if invalid
        setSavingGoal(savingGoal);
        console.log("savingGoal----------->",savingGoal)
        console.log("savingGoal_data----------->",data)

      } else {
        console.error('Not found');
        setSavingGoal(0); // Set to 0 if no data
      }
    });
  };

  useEffect(() => {
    if (auth.currentUser) {
      dispatch(listenToUserProfile(auth.currentUser.uid));
      dispatch(listenToUserExpenses(auth.currentUser.uid));
      fetch_salary(year_month);
      fetch_savingGoal(year_month);
    }
  }, [dispatch, year_month]);

  useEffect(() => {
    setTimeout(() => {
      set_expLoader(false);
    }, 5000);
  }, []);

  useEffect(() => {
    const salaryAmount = salary || 0;
    const totalSpentAmount = total_spent_amt || 0;
    const calculatedSavings = salaryAmount - totalSpentAmount;
    const remainingAmount=salaryAmount-totalSpentAmount
    setSavings(calculatedSavings);
    setRemainingSalary(remainingAmount)
  }, [salary, total_spent_amt]);

  return exp_loader ? (
    <LoadingScreen
      loading={true}
      bgColor="rgba(255,255,255,0.8)"
      spinnerColor="#9ee5f8"
      textColor="#676767"
      logoSrc=""
      text=""
    />
  ) : (
    <div className={classes.dashboard}>
      <Navbar />
      <div className={classes.dashboard_content}>
        <div className={classes.date_picker_container}>
          <DatePicker
            style={{
              width: '10rem',
              height: '2.5rem',
              padding: '0 15px',
              textAlign: 'center',
              borderRadius: '2rem',
              color: 'grey'
            }}
            onChange={onChange}
            className="customDropdown"
            picker="month"
          />
        </div>
        <Grid container rowSpacing={3} columnSpacing={3}>
          <Grid container rowSpacing={3} columnSpacing={3} size={8}>
            <Grid size={4}>
              <Card width="" height="6rem">
                <div className={classes.flex_div}>
                  <p>Your Salary</p>
                  <p className={classes.styled_text} style={{ color: "#c88fd0" }}>
                    ₹{(salary || 0).toLocaleString()} {/* Default to 0 if salary is invalid */}
                  </p>
                </div>
              </Card>
            </Grid>
            <Grid size={4}>
              <Card width="" height="6rem">
                <div className={classes.flex_div}>
                  <p>Total Expenditure</p>
                  <p className={classes.styled_text}>
                    ₹{(total_spent_amt || 0).toLocaleString()} {/* Default to 0 if total_spent_amt is invalid */}
                  </p>
                </div>
              </Card>
            </Grid>
            <Grid size={4}>
              <Card width="" height="6rem">
                <div className={classes.flex_div}>
                  <p>Remaining Balance</p>
                  <p className={classes.styled_text}>
                    ₹{(remainingSalary || 0).toLocaleString()} {/* Default to 0 if total_spent_amt is invalid */}
                  </p>
                </div>
              </Card>
            </Grid>
            <Grid size={12}>
              <Card width="" height="">
                <Daily_expenses_chart date={date} year_month={year_month} />
              </Card>
            </Grid>
          </Grid>
          <Grid container rowSpacing={3} columnSpacing={3} size={4}>
            <Grid size={12}>
              <Card>
                <BarChart date={date} Monthly_total_data={Monthly_total_data || []} />
              </Card>
            </Grid>
            <Grid size={6}>
              <Card height='15rem'>
                <div>
                  <SavingGoalChart savings={savings} goal={savingGoal} />
                </div>
              </Card>
            </Grid>
            <Grid size={6}>
              <Card height='15rem'></Card>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;




