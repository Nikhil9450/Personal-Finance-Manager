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
import classes from "./AddSalary.module.css"
// import { doc, collection, addDoc ,updateDoc } from "firebase/firestore";
import { db,auth } from '../../../firebase';
import Loader from '../../../Loader';
import { collection, query, where, getDocs, addDoc ,doc,getDoc,setDoc, updateDoc,deleteDoc} from "firebase/firestore";

const AddSalary = () => {
const [modal,setModal]=useState(false)
const [error,setError]=useState(false);
const [loader,setLoader]=useState(false);
const [selectedMonth, setSelectedMonth] = useState(null);
const month=useRef(null);

const salary=useRef(null);


const onChange = (date, dateString) => {
  setSelectedMonth(dateString); // Set the string representation (e.g., "2024-11")
  console.log("Selected Month (Moment Object):", date); // Moment.js object
  console.log("Selected Month (String):", dateString); // String representation
  month.current = dateString; // Save the selected value to the ref
};

const addSalary = async (e) => {
  const buttonName = e.nativeEvent.submitter?.name;
  console.log("this is event of ",e)
  e.preventDefault();

  const user = auth.currentUser; // Get the currently authenticated user
  if (!user) {
    console.log("No user is logged in.");
    setError("Please log in to add items.");
    return;
  }

  const [year, month] = selectedMonth.split("-");
  const user_salary = {
    year_month: selectedMonth,
    salary: salary.current.value,
    createdAt: new Date(), // Add a timestamp
  };

  console.log("user_salary----------->", user_salary);
  setLoader(true);
  if(buttonName==="addSalary"){
    try {
      // Reference to the document named by year and month inside salary_detail
      const salaryDocRef = doc(db, "users", user.uid, "salary_detail", `${year}-${month}`);
  
      // Check if the document already exists
      const salaryDocSnapshot = await getDoc(salaryDocRef);
      if (salaryDocSnapshot.exists()) {
        setLoader(false);
        setError("Salary for this month has already been added.");
        console.log("Salary for this month already exists.");
        return;
      }
  
      // Create or overwrite the document with the salary data
      await setDoc(salaryDocRef, user_salary);
  
      console.log("Item added to Firestore subcollection.");
      setLoader(false); // Reset loader after success
    } catch (error) {
      setLoader(false); // Ensure loader is reset on error
      setError(error.message);
      console.log("error----->", error);
    }
  }else if(buttonName==="updateSalary"){
    try {
      // Reference to the document named by year and month inside salary_detail
      const salaryDocRef = doc(db, "users", user.uid, "salary_detail", `${year}-${month}`);
  
      // Check if the document already exists
      const salaryDocSnapshot = await getDoc(salaryDocRef);
      if (salaryDocSnapshot.exists()) {

      // Create or overwrite the document with the salary data
      await updateDoc(salaryDocRef,user_salary);
      console.log("Item updated to Firestore subcollection.");
      setLoader(false); // Reset loader after success
        

        return;
      }
      setLoader(false);
      setError("Salary for this month does not exists.");
      console.log("Salary for this month does not exists.");
    } catch (error) {
      setLoader(false); // Ensure loader is reset on error
      setError(error.message);
      console.log("error----->", error);
    }

  }else if(buttonName === "deleteSalary"){
    try {
      // Reference to the document named by year and month inside salary_detail
      const salaryDocRef = doc(db, "users", user.uid, "salary_detail", `${year}-${month}`);
  
      // Check if the document already exists
      const salaryDocSnapshot = await getDoc(salaryDocRef);
      if (salaryDocSnapshot.exists()) {
        // Delete the document
        await deleteDoc(salaryDocRef);
        console.log("Item deleted from Firestore subcollection.");
        setLoader(false); // Reset loader after success
        return; // Exit after successfully deleting
      }
  
      // Document does not exist
      setLoader(false);
      setError("Salary for this month does not exist.");
      console.log("Salary for this month does not exist.");
    } catch (error) {
      // Handle any errors that occur
      setLoader(false); // Ensure loader is reset on error
      setError(error.message);
      console.log("Error deleting Firestore document:", error);
    }
  }
};


const showModal = () => {
    console.log("opening modal");
    setModal(true);
  };

  const handleCancel = () => {
    console.log("closing modal");
    setModal(false);
  };  

  // const onChange = (date, dateString) => {
  //   console.log(date, dateString);
  //   console.log("Selected Month (Moment Object):", date); // Moment.js object
  //   console.log("Selected Month (String):", dateString); // String representation
  //   month.current = dateString; // Save the selected value to the ref
  // };
  return (
    <div>
            <style>
              {`
                .ant-picker-dropdown .ant-picker-header {
                    /* Adjust these properties as needed */
                    width: 50%;         /* Ensures the header fits the dropdown width */
                    padding: 8px;        /* Adjust padding if needed */
                    display: flex;
                    {/* justify-content: center; /* Centers header content */ */}
                }
              `}
        </style>
        {/* <AddButton 
            type="salary" 
            icon={<AttachMoneyIcon />} 
            label="Salary"
            onClick={showModal} 
            bgColor="grey"
        /> */}
        <button type='button' onClick={showModal} style={{padding:'5px',justifyContent:'start', background:'none'}}><img src='/Icons/salary.png' alt="" style={{height:'2rem',paddingRight:'1rem'}}/> Add/Update/Delete Monthly Salary</button>
        <My_modal title="ADD/UPDATE/DELETE Salary" button_name="Add Salary" isModalOpen={modal} handleCancel={handleCancel}>
        <form onSubmit={addSalary} method='post'>
            <div id='addSalary_container' className={classes.addSalary_container}>
                <div className={classes.Container_Child}>
                    <DatePicker style={{ width: '100%', padding: '0 8px', textAlign: 'center' }} onChange={onChange} picker="month" className="customDropdown" />
                </div>
                <div className={classes.Container_Child}>
                    <label htmlFor="amount"><CurrencyRupeeIcon/></label>
                    <input id='amount' className={classes.amount} type="integer" placeholder='Enter amount.' ref={salary}/>
                </div>
                <div className={classes.submitbtn_container}>
                  <button name='addSalary' className={classes.button} type='submit'>{loader?<Loader size={30} />:<AddIcon/>}</button>
                  <button name='updateSalary' className={classes.button} type='submit'>{loader?<Loader size={30} />:<EditIcon/>}</button>
                  <button name='deleteSalary' className={classes.button} type='submit'>{loader?<Loader size={30} />:<DeleteIcon/>}</button>

                </div>
            </div>
        </form>
        </My_modal>
    </div>
  )
}

export default AddSalary