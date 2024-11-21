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
import classes from "./AddSalary.module.css"
import { doc, collection, addDoc ,updateDoc } from "firebase/firestore";
import { db,auth } from '../../../firebase';
import Loader from '../../../Loader';

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
  e.preventDefault();

  const user = auth.currentUser; // Get the currently authenticated user
  if (!user) {
    console.log("No user is logged in.");
    setError("Please log in to add items.");
    return;
  }

  const user_salary = {
    year_month: selectedMonth,
    salary: salary.current.value,
    createdAt: new Date(), // Add a timestamp
  };

  console.log("user_salary----------->", user_salary);
  setLoader(true);

  try {
    // Reference to the user's subcollection
    const itemsCollection = collection(db, "users", user.uid, "salary_detail");

    // Add a new document to the subcollection
    await addDoc(itemsCollection, user_salary);

    console.log("Item added to Firestore subcollection.");
    setLoader(false); // Reset loader after success
  } catch (error) {
    setLoader(false); // Ensure loader is reset on error
    setError(error.message);
    console.log("error----->", error);
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
        <button type='button' onClick={showModal} style={{padding:'5px',justifyContent:'start', background:'none'}}><img src='/Icons/salary.png' alt="" style={{height:'2rem',paddingRight:'1rem'}}/> Add Monthly Salary</button>
        <My_modal title="Add Salary" button_name="Add Salary" isModalOpen={modal} handleCancel={handleCancel}>
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
                  <button className={classes.button} type='submit'>{loader?<Loader size={30} />:<AddIcon/>}</button>
                </div>
            </div>
        </form>
        </My_modal>
    </div>
  )
}

export default AddSalary