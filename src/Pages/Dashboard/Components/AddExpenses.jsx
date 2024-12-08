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
import { useDispatch } from 'react-redux';
import { listenToUserExpenses,listenToUserProfile } from '../../../Slices/UserSlice';

const AddExpenses = ({ onUpdateExpenses }) => {
    const [modal,setModal]=useState(false)
    const priceRef=useRef(null);
    const descriptionRef= useRef(null);
    const [error,setError]=useState(false);
    const [loader,setLoader]=useState(false);
    const [date, setDate] = useState(null);
    const dispatch=useDispatch();

    const addToList = async (e) => {
      e.preventDefault();
  
      const user = auth.currentUser; // Get the currently authenticated user
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
        createdAt: new Date(), // Add a timestamp
      };
  
      setLoader(true);
  
      try {
        // Add data to Firestore
        const itemsCollection = collection(db, "users", user.uid, "items");
        await addDoc(itemsCollection, item);
  
        console.log("Item added to Firestore.");
        fetchExpenses(user.uid); // Fetch updated expenses after adding
      } catch (error) {
        console.error("Error adding item:", error);
        setError(error.message);
      } finally {
        setLoader(false);
        setModal(false); // Close modal
      }
    };
  
    const fetchExpenses = async (uid) => {
      try {
        const userExpenseListRef = collection(db, "users", uid, "items");
        const snapshot = await getDocs(userExpenseListRef);
  
        const expenses = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toISOString(), // Convert to serializable format
        }));
  
        console.log("Fetched Expenses:", expenses);
        onUpdateExpenses(expenses); // Pass updated expenses to parent
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    // const updateItem = async (userId, itemId, updatedData) => {
    //   try {
    //     const itemDoc = doc(db, "users", userId, "items", itemId); // Reference to the specific item
    //     await updateDoc(itemDoc, updatedData); // Update only the fields in `updatedData`
    //     console.log("Item updated successfully.");
    //   } catch (error) {
    //     console.error("Error updating item:", error);
    //   }
    // };

    const onChange = (date, dateString) => {
      setDate(dateString); // Set the string representation (e.g., "2024-11")
      console.log("Selected Month (Moment Object):", date); // Moment.js object
      console.log("Selected Month (String):", dateString); // String representation
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
        <form onSubmit={addToList} method='post'>

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
              <DatePicker style={{ width: '40%', height:'2.5rem', padding: '0 8px', textAlign: 'center' ,borderRadius:'1rem',color:'lightgrey'}} onChange={onChange}  className="customDropdown" />
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
                  <button className={classes.button} type='submit'>{loader?<Loader size={30} />:<AddIcon/>}</button>
                </div>
            </div>
        </form>
        </My_modal>
    </div>
  )
}

export default AddExpenses