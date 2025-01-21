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
  // const onChange = (date, dateString) => {
  //   if (!date || !dateString) {
  //     // Handle the case when the date is cleared
  //     setDate('');
  //     setYear_month('');
  //     dispatch(data_tobe_render(''));
  //     fetch_salary('');
  //     fetch_savingGoal('');
  //     console.log('Date is cleared');
  //   } else {
  //     // Handle the case when a valid date is selected
  //     setDate(dateString);
  //     setYear_month(dateString);
  //     dispatch(data_tobe_render(dateString));
  //     fetch_salary(dateString);
  //     fetch_savingGoal(dateString);
  //   }
  // };
  
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
        <style>
                    {`.ant-picker-header-view{
                        display:flex;
                    }
                      .ant-picker-dropdown .ant-picker-header {
                          /* Adjust these properties as needed */
                          width: 23% !important;         /* Ensures the header fits the dropdown width */
                          padding: 8px;        /* Adjust padding if needed */
                          display: flex;
                          {/* justify-content: center; /* Centers header content */ */}
                      }
                    `}
              </style>
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
        <div className={classes.container}>
            <div className={`${classes.item} ${classes.item1}`}>
              <div className={classes.item1_child} style={{width:"100%",margin:".5rem"}}>
                <div className={classes.I1}>
                  <Card  height= "100%" padding={0}  >
                    <div className={classes.flex_div}>
                      <p style={{ color: "#6d2fd4" }}>Your Salary</p>
                      <p className={classes.styled_text} style={{ color: "#c88fd0" }}>
                        ₹{(salary || 0).toLocaleString()} {/* Default to 0 if salary is invalid */}
                      </p>
                    </div>
                  </Card>
                </div>
                <div className={classes.I2}>
                  <Card height= "100%" padding={"0 1rem"}   >
                    <div className={classes.flex_div}>
                      <p style={{ color: "#6d2fd4" }}>Total Expenditure</p>
                      <p className={classes.styled_text}>
                        ₹{(total_spent_amt || 0).toLocaleString()} {/* Default to 0 if total_spent_amt is invalid */}
                      </p>
                    </div>
                  </Card>
                </div>
                <div className={classes.I3}>
                  <Card height= "100%" padding={"0 1rem"}   >
                    <div className={classes.flex_div}>
                      <p style={{ color: "#6d2fd4" }}>Remaining Balance</p>
                      <p className={classes.styled_text}>
                        ₹{(remainingSalary || 0).toLocaleString()} {/* Default to 0 if remainingSalary is invalid */}
                      </p>
                    </div>
                  </Card>
                </div>
                <div className={classes.I4}>
                  <Card height= "100%" padding={"1rem"}   >
                    <Daily_expenses_chart date={date} year_month={year_month} />
                  </Card>
                </div>
                <div className={classes.I5}>
                  <Card height= "100%" padding={0}   >
                    {/* <BarChart date={date} Monthly_total_data={Monthly_total_data || []} /> */}
                  </Card>
                </div>
                <div className={classes.I6}>
                  <Card height= "100%" padding={0}   >
                    {/* <SavingGoalChart savings={savings} goal={savingGoal} /> */}
                  </Card>
                </div>
              </div>
              {/* <div className={classes.item2_child} style={{width:"100%",margin:".5rem"}}>
                <Card  padding="2rem"> */}
                  {/* <Daily_expenses_chart date={date} year_month={year_month} /> */}
                {/* </Card>
              </div> */}
            </div>
            {/* <div className={`${classes.item} ${classes.item2}`}>
              <Card className={classes.savingGoal_card} padding="1rem">
                <BarChart date={date} Monthly_total_data={Monthly_total_data || []} />
              </Card>
              <Card padding={'2rem'}  height={'15rem'} >
                  <SavingGoalChart savings={savings} goal={savingGoal} />
              </Card>
            </div> */}

          </div>
        </div>
      </div>
  );
};

export default Dashboard;




