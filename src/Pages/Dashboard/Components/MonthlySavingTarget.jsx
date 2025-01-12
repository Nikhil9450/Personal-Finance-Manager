import React, { useRef } from 'react'
import My_modal from '../../../My_modal'
import { useState } from 'react'
import AddButton from '../../../My_button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { DatePicker, Space, DatePickerProps } from 'antd';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit';
import { doc, collection, addDoc ,updateDoc, getDoc, setDoc,deleteDoc } from "firebase/firestore";
import { db,auth } from '../../../firebase';
import Loader from '../../../Loader';
import classes from './MonthlySavingTarget.module.css'

// import savings from 'public/Icons/savings.png';

const MonthlySavingTarget = () => {
  const [modal,setModal]=useState(false)
  const [error,setError]=useState(false);
  const [loader,setLoader]=useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const month=useRef(null);
  
  const saving=useRef(null);
  const showModal = () => {
    console.log("opening modal");
    setModal(true);
  };

  const handleCancel = () => {
    console.log("closing modal");
    setModal(false);
  };  
  const onChange = (date, dateString) => {
    setSelectedMonth(dateString); // Set the string representation (e.g., "2024-11")
    console.log("Selected Month (Moment Object):", date); // Moment.js object
    console.log("Selected Month (String):", dateString); // String representation
    month.current = dateString; // Save the selected value to the ref
  };

  const addSavingGoal = async (e) => {
  const buttonName = e.nativeEvent.submitter?.name;
  e.preventDefault();

  const user = auth.currentUser; // Get the currently authenticated user
  if (!user) {
    console.log("No user is logged in.");
    setError("Please log in to add items.");
    return;
  }

  const [year, month] = selectedMonth.split("-");
  const user_savingGoal = {
    year_month: selectedMonth,
    Saving_goal: saving.current.value,
    createdAt: new Date(), // Add a timestamp
  };

  console.log("user_salary----------->", user_savingGoal);
  setLoader(true);
  if(buttonName==="addSavingGoal"){
    try {
      // Reference to the document named by year and month inside salary_detail
      const savingDocRef = doc(db, "users", user.uid, "saving_detail", `${year}-${month}`);
  
      // Check if the document already exists
      const savingDocSnapshot = await getDoc(savingDocRef);
      if (savingDocSnapshot.exists()) {
        setLoader(false);
        setError("Salary for this month has already been added.");
        console.log("Salary for this month already exists.");
        return;
      }
  
      // Create or overwrite the document with the salary data
      await setDoc(savingDocRef, user_savingGoal);
  
      console.log("Item added to Firestore subcollection.");
      setLoader(false); // Reset loader after success
    } catch (error) {
      setLoader(false); // Ensure loader is reset on error
      setError(error.message);
      console.log("error----->", error);
    }
  }else if(buttonName==="updateSavingGoal"){
    try {
      // Reference to the document named by year and month inside salary_detail
      const savingDocRef = doc(db, "users", user.uid, "saving_detail", `${year}-${month}`);

      // Check if the document already exists
      const savingDocSnapshot = await getDoc(savingDocRef);
      if (savingDocSnapshot.exists()) {
      // Create or overwrite the document with the salary data
        await updateDoc(savingDocRef, user_savingGoal);

        console.log("Item updated to Firestore subcollection.");
        setLoader(false); // Reset loader after success
        return;
      }

      setLoader(false);
      setError("Saving goal for this month does not exist.");
      console.log("Saving goal for this month does not exist");


    } catch (error) {
      setLoader(false); // Ensure loader is reset on error
      setError(error.message);
      console.log("error----->", error);
    }
  }else if(buttonName==="deleteSavingGoal"){
    try {
      // Reference to the document named by year and month inside salary_detail
      const savingDocRef = doc(db, "users", user.uid, "saving_detail", `${year}-${month}`);

      // Check if the document already exists
      const savingDocSnapshot = await getDoc(savingDocRef);
      if (savingDocSnapshot.exists()) {
      // Create or overwrite the document with the salary data
        await deleteDoc(savingDocRef, user_savingGoal);

        console.log("Item deleted from Firestore subcollection.");
        setLoader(false); // Reset loader after success
        return;
      }

      setLoader(false);
      setError("Saving goal for this month does not exist.");
      console.log("Saving goal for this month does not exist");


    } catch (error) {
      setLoader(false); // Ensure loader is reset on error
      setError(error.message);
      console.log("error----->", error);
    }

  }
};
  return (
    <div>
            {/* <AddButton 
            type="salary" 
            icon={<AttachMoneyIcon />} 
            label="Salary"
            onClick={showModal} 
            bgColor="grey"
        /> */}
        <button onClick={showModal} style={{padding:'5px',justifyContent:'start', background:'none'}} ><img src='/Icons/savings.png' alt="" style={{height:'2rem',paddingRight:'1rem'}} /> Add/update/Delete Saving Gole</button>
              <My_modal title="ADD/UPDATE/DELETE MONTHLY SAVING GOLE." button_name="Set saving gole." isModalOpen={modal} handleCancel={handleCancel}>
        <form onSubmit={addSavingGoal}>
            <div id='saving_container' className={classes.saving_container}>
                <div className={classes.Container_Child}>
                    <DatePicker style={{ width: '100%', padding: '0 8px', textAlign: 'center' }} onChange={onChange} picker="month" className="customDropdown" />
                </div>
                <div className={classes.Container_Child}>
                    <label htmlFor="amount"><CurrencyRupeeIcon/></label>
                    <input id='amount' className={classes.amount} type="integer" placeholder='Enter amount.' ref={saving}/>
                </div>
                <div className={classes.submitbtn_container}>
                  <button name='addSavingGoal' className={classes.button} type='submit'>{loader?<Loader size={30} />:<AddIcon/>}</button>
                  <button name='updateSavingGoal' className={classes.button} type='submit'>{loader?<Loader size={30} />:<EditIcon/>}</button>
                  <button name='deleteSavingGoal' className={classes.button} type='submit'>{loader?<Loader size={30} />:<DeleteIcon/>}</button>

                </div>
            </div>
        </form>
        </My_modal>
    </div>
  )
}

export default MonthlySavingTarget