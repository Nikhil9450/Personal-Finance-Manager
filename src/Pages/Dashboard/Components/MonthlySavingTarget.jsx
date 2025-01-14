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

  const [loadingState, setLoadingState] = useState({
    addSavingGoal: false,
    updateSavingGoal: false,
    deleteSavingGoal: false,
  });
  
  const toggleLoader = (buttonName, state) => {
    setLoadingState((prev) => ({
      ...prev,
      [buttonName]: state,
    }));
  };
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
    const buttonName = e.nativeEvent.submitter?.name; // Get the name of the clicked button
    e.preventDefault();
  
    const user = auth.currentUser; // Get the currently authenticated user
    if (!user) {
      console.log("No user is logged in.");
      setError("Please log in to perform this action.");
      return;
    }
  
    const [year, month] = selectedMonth.split("-");
    const user_savingGoal = {
      year_month: selectedMonth,
      Saving_goal: saving.current.value,
      createdAt: new Date(), // Add a timestamp
    };
  
    console.log("user_savingGoal----------->", user_savingGoal);
    toggleLoader(buttonName, true);
  
    try {
      const savingDocRef = doc(db, "users", user.uid, "saving_detail", `${year}-${month}`);
      const savingDocSnapshot = await getDoc(savingDocRef);
  
      if (buttonName === "addSavingGoal" && !savingDocSnapshot.exists()) {
        await setDoc(savingDocRef, user_savingGoal);
        console.log("Saving goal added to Firestore.");
      } else if (buttonName === "updateSavingGoal" && savingDocSnapshot.exists()) {
        await updateDoc(savingDocRef, user_savingGoal);
        console.log("Saving goal updated in Firestore.");
      } else if (buttonName === "deleteSavingGoal" && savingDocSnapshot.exists()) {
        await deleteDoc(savingDocRef);
        console.log("Saving goal deleted from Firestore.");
      } else {
        throw new Error(
          buttonName === "addSavingGoal"
            ? "Saving goal for this month already exists."
            : "Saving goal for this month does not exist."
        );
      }
    } catch (error) {
      setError(error.message);
      console.log("Error----->", error);
    } finally {
      toggleLoader(buttonName, false);
    }
  };
  
  return (
    <div>
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
                  <button name="addSavingGoal" className={classes.button} type="submit">
                    {loadingState.addSavingGoal ? <Loader size={30} /> : <AddIcon/>}
                  </button>
                  <button name="updateSavingGoal" className={classes.button} type="submit">
                    {loadingState.updateSavingGoal ? <Loader size={30} /> : <EditIcon/>}
                  </button>
                  <button name="deleteSavingGoal" className={classes.button} type="submit">
                    {loadingState.deleteSavingGoal ? <Loader size={30} /> : <DeleteIcon/>}
                  </button>
                </div>
            </div>
        </form>
        </My_modal>
    </div>
  )
}

export default MonthlySavingTarget