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
import { doc, collection, addDoc ,updateDoc } from "firebase/firestore";
import { db,auth } from '../../../firebase';
import Loader from '../../../Loader';
const AddExpenses = () => {
    const [modal,setModal]=useState(false)
    const priceRef=useRef(null);
    const descriptionRef= useRef(null);
    const [error,setError]=useState(false);
    const [loader,setLoader]=useState(false);

    const addToList = async (e) => {
      e.preventDefault();
    
      const user = auth.currentUser; // Get the currently authenticated user
      if (!user) {
        console.log("No user is logged in.");
        setError("Please log in to add items.");
        return;
      }
    
      const item = {
        price: priceRef.current.value,
        description: descriptionRef.current.value,
        createdAt: new Date(), // Add a timestamp
      };
    
      console.log("item----------->", item);
      setLoader(true);
    
      try {
        // Reference to the user's subcollection
        const itemsCollection = collection(db, "users", user.uid, "items");
    
        // Add a new document to the subcollection
        await addDoc(itemsCollection, item);
    
        console.log("Item added to Firestore subcollection.");
        setLoader(false); // Reset loader after success
      } catch (error) {
        setLoader(false); // Ensure loader is reset on error
        setError(error.message);
        console.log("error----->", error);
      }
    };

    const updateItem = async (userId, itemId, updatedData) => {
      try {
        const itemDoc = doc(db, "users", userId, "items", itemId); // Reference to the specific item
        await updateDoc(itemDoc, updatedData); // Update only the fields in `updatedData`
        console.log("Item updated successfully.");
      } catch (error) {
        console.error("Error updating item:", error);
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
        <form onSubmit={addToList} method='post'>
             <div id='addExpense_container' className={classes.addExpense_container}>
                <div className={classes.Container_Child}>
                    <label htmlFor="description"><DescriptionIcon/></label>
                    <input id='description' className={classes.description} type="text"  placeholder='Enter description.' ref={descriptionRef} />
                </div>
                <div className={classes.Container_Child}>
                    <label htmlFor="amount"><CurrencyRupeeIcon/></label>
                    <input id='amount' className={classes.amount} type="integer" placeholder='Enter amount.' ref={priceRef}/>
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

export default AddExpenses