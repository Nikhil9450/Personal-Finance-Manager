import React, { useRef } from 'react'
import { useState } from 'react';
import My_modal from '../../../My_modal'
import AddButton from '../../../My_button'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AddIcon from '@mui/icons-material/Add';
import classes from './AddExpenses.module.css'
const AddExpenses = () => {
    const [modal,setModal]=useState(false)
    const priceRef=useRef(null);
    const descriptionRef= useRef(null);

    const addToList=()=>{
      const item={
        price: priceRef.current.value,
        description: descriptionRef.current.value,
      }
    }


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
            <AddButton 
            type="expense" 
            icon={<AttachMoneyIcon />} 
            label="Add Expense"
            onClick={showModal} 
            bgColor="grey"
            
        />
        <My_modal title="Add expense" button_name="Add Expenses" isModalOpen={modal} handleCancel={handleCancel}>
        <form action="">
             <div id='addExpense_container' className={classes.addExpense_container}>
                <div className={classes.Container_Child}>
                    <label htmlFor="description"><DescriptionIcon/></label>
                    <input id='description' className={classes.description} type="text"  placeholder='Enter description.' ref={descriptionRef} />
                </div>
                <div className={classes.Container_Child}>
                    <label htmlFor="amount"><CurrencyRupeeIcon/></label>
                    <input id='amount' className={classes.amount} type="number" placeholder='Enter amount.' ref={priceRef}/>
                </div>
                <div className={classes.submitbtn_container}>
                  <button className={classes.button} type='submit'><AddIcon/></button>
                </div>
            </div>
        </form>
        </My_modal>
    </div>
  )
}

export default AddExpenses