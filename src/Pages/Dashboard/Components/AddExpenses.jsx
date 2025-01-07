import React, { useRef } from 'react'
import { useState } from 'react';
import My_modal from '../../../My_modal'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DescriptionIcon from '@mui/icons-material/Description';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AddIcon from '@mui/icons-material/Add';
import classes from './AddExpenses.module.css'
import { doc, collection, addDoc ,updateDoc,getDocs } from "firebase/firestore";
import { db,auth } from '../../../firebase';
import Loader from '../../../Loader';
import Fab from '@mui/material/Fab';
import { DatePicker } from 'antd';
import { useDispatch ,useSelector} from 'react-redux';
import {createExpenses } from '../../../Slices/UserSlice';
import { Select } from 'antd';
import { Alert,Collapse } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Timestamp } from "firebase/firestore";
const AddExpenses = ({ onUpdateExpenses }) => {
    const [modal,setModal]=useState(false)
    const priceRef=useRef(null);
    const descriptionRef= useRef(null);
    const [error,setError]=useState(false);
    const [loader,setLoader]=useState(false);
    const [date, setDate] = useState(null);
    const [category,setCategory]=useState(null);
    const [open, setOpen]=useState(false);
    const dispatch=useDispatch();
    const status=useSelector((state)=>state.user.creation_status)

    const addToList = async (e) => {
      try {
        e.preventDefault();
        console.log("Default behavior prevented");
    
        const user = auth.currentUser;
        if (!user) {
          setError("Please log in to add items.");
          return;
        }
    
        const today = new Date();
        const formattedDate = date || today.toISOString().split("T")[0];
        const item = {
          price: priceRef.current.value,
          description: descriptionRef.current.value,
          expenditure_date: formattedDate,
          createdAt: Timestamp.fromDate(new Date()), // Add a timestamp
          category: category,
        };
    
        if (!item.price || !item.description || !item.expenditure_date || !item.category) {
          console.error("All fields are required!");
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, 1500);
        } else {
          console.log("All fields are filled:", item);
          setOpen(false);
          dispatch(createExpenses(item));
                // Reset form values
          priceRef.current.value = "";
          descriptionRef.current.value = "";
          setDate(null);
          setCategory(null);
          setModal(false);
          console.log("Form cleared after submission");
        }
      } catch (error) {
        console.error("Error in addToList:", error);
      }
    };
    
  

    const onChange = (date, dateString) => {
      setDate(dateString); // Set the string representation (e.g., "2024-11")
      console.log("Selected Month (Moment Object):", date); // Moment.js object
      console.log("Selected Month (String):", dateString); // String representation
    };
    const onChangeSelect=(value)=>{
      console.log(`selected ${value}`);
      setCategory(value);
    }
    const categories = [
      { value: "Food", label: "Food" },
      { value: "Electronics", label: "Electronics" },
      { value: "Clothing", label: "Clothing" },
      { value: "Entertainment", label: "Entertainment" },
      { value: "Transportation", label: "Transportation" },
      { value: "Health", label: "Health" },
      { value: "Education", label: "Education" },
      { value: "Personal Expenses", label: "Personal Expenses" },
      { value: "Renting", label: "Renting" },
      { value: "Others", label: "Others" }
    ];
    

    const showModal = () => {
        console.log("opening modal");
        setModal(true);
      };

    const handleCancel = () => {
        console.log("closing modal");
        setModal(false);
      };  
  return (
    <div>

      <Fab 
          // color='primary'
          style={{
            background:'#3a843a',
            color:'white',
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
          }}
          onClick={showModal}
        variant="extended">
        <ShoppingCartIcon sx={{ mr: 1 }} />
        Add Expenses
      </Fab>

        <My_modal title="" button_name="Add Expenses" isModalOpen={modal} handleCancel={handleCancel}>
        <Collapse in={open} style={{width:'95%'}}>
            <Alert severity="warning"
                // action={
                //   <IconButton
                //     aria-label="close"
                //     color="inherit"
                //     size="small"
                //     onClick={() => {
                //       setOpen(false);
                //     }}
                //   >
                //     <CloseIcon fontSize="inherit" />
                //   </IconButton>
                // }
                sx={{ mb: 2 }}>
              {/* <AlertTitle>info</AlertTitle> */}
              All fields are required.
            </Alert>
          </Collapse>
        <form onSubmit={addToList}>

             <div id='addExpense_container' className={classes.addExpense_container}>
             <div className={classes.Container_Child}>
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
              <div style={ {width: '100%', display: 'flex', justifyContent: 'space-between',alignItems: 'center'}}>
              <DatePicker style={{ width: '40%', height:'2.5rem', padding: '0 8px', textAlign: 'center' ,color:'lightgrey'}} onChange={onChange}  className="customDropdown" />

                <Select
                    // showSearch
                    placeholder="Select category"
                    optionFilterProp="label"
                    onChange={onChangeSelect}
                    // onSearch={onSearch}
                    options={categories}
                    style={{ width: '40%', height:'2.5rem', padding: '0 8px', textAlign: 'center' ,color:'lightgrey'}}
                  />
                </div>
              </div>
                <div className={classes.Container_Child}>
                    <label htmlFor="description"><DescriptionIcon/></label>
                    <input id='description' className={classes.description} type="text"  placeholder='Enter description.' ref={descriptionRef} />
                </div>


                <div className={classes.Container_Child}>
                    <label htmlFor="amount"><CurrencyRupeeIcon/></label>
                    <input id='amount' className={classes.amount} type="integer" placeholder='Enter amount.' ref={priceRef}/>
                </div>

                <div className={classes.submitbtn_container}>
                  <button className={classes.button} type='submit'>{(status=='loading')?<Loader size={30} />:<AddIcon/>}</button>
                </div>
            </div>
        </form>
        </My_modal>
    </div>
  )
}

export default AddExpenses