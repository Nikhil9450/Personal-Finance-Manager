import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import My_modal from "../../../My_modal";
import Loader from "../../../Loader";
import DescriptionIcon from "@mui/icons-material/Description";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import classes from "./AddExpenses.module.css";
import { useDispatch,useSelector } from "react-redux";
import { listenToUserExpenses,listenToUserProfile,data_tobe_render,updateUserExpenses } from '../../../Slices/UserSlice';
import Swal from "sweetalert2";
import { Select } from 'antd';

const Update_expense = (props) => {
  const [modal, setModal] = useState(false);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category,setCategory]=useState("");
  // const [loader, setLoader] = useState(false);
  // const [error, setError] = useState(false);
  const dispatch=useDispatch();
  const user = auth.currentUser;
  const Monthly_total_data=useSelector((state)=>state.user.month_wise_totalExpense)
  const isLoading=useSelector((state)=>state.user.loader)
  const error=useSelector((state)=>state.user.error)
  const status=useSelector((state)=>state.user.status)
  
  // useEffect(()=>{
  //   console.log("status-------->",status);
  //   if(error){
  //     handleCancel(); 
  //     Swal.fire({
  //     // text: error,
  //     icon: "error",
  //     // timer: 2000,
  //     showConfirmButton: false,
  //   });
  //   }
  //   if(status=="success"){
  //     handleCancel(); 
  //     Swal.fire({
  //       icon: "success",
  //       timer: 1800,
  //       showConfirmButton: false,
  //     });
  //   }
  // },[error,status]);

  useEffect(() => {
    const fetchItemData = async () => {
      const selectedIdData = Monthly_total_data.allExpenses.find(
        (item) => item.id === props.itemId
      );
      try {

        if (selectedIdData) {
          setPrice(selectedIdData.expense || "");
          setDescription(selectedIdData.description || "");
          setDate(selectedIdData.name || "");
          setCategory(selectedIdData.category || "Others")
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    fetchItemData();
  }, [user, props.itemId]);

  const handlePriceChange = (e) => setPrice(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const updateItem = async (e) => {
    e.preventDefault();

    const formattedDate = date || new Date().toISOString().split("T")[0]; // Fallback to today's date

    const updatedData = {
      price,
      description,
      expenditure_date: formattedDate,
      category,
    };

    console.log("Updating item:", updatedData);
    dispatch(updateUserExpenses(props.itemId,updatedData))
  };

  const showModal = () => {
    setModal(true)
  };
  const handleCancel = () => setModal(false);

  const categories = [
    { value: "Food & Beverages", label: "Food & Beverages" },
    { value: "Vegetables", label: "Vegetables" },
    { value: "Electronics", label: "Electronics" },
    { value: "Clothing", label: "Clothing" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Grocery", label: "Grocery" },
    { value: "Transportation", label: "Transportation" },
    { value: "Health & Fitness", label: "Health & Fitness" },
    { value: "Travel", label: "Travel" },
    { value: "Education", label: "Education" },
    { value: "Personal Care", label: "Personal Care" },
    { value: "Renting", label: "Renting" },
    { value: "Others", label: "Others" }
  ];

  const handleCategoryChange=(value)=>{
    console.log(`selected ${value}`);
    setCategory(value);
  }
  return (
    <div>
      <img
        src="/Icons/edit.png"
        onClick={showModal}
        alt=""
        style={{ height: "1.4rem", marginTop: "8px", paddingRight: "1rem", cursor: "pointer" }}
      />

      <My_modal title="" button_name="Update Expense" isModalOpen={modal} handleCancel={handleCancel}>
        <form onSubmit={updateItem} method="post">
          <div id="addExpense_container" className={classes.addExpense_container}>
            <div className={classes.Container_Child} style={{display:'flex',justifyContent:'space-between'}}>
              <Select
                // showSearch
                placeholder="Select category"
                optionFilterProp="label"
                onChange={handleCategoryChange}
                // onSearch={onSearch}
                value={{ value:category, label: category }}
                options={categories}
                style={{ width: '40%', height:'2.5rem', padding: '0 8px', textAlign: 'center' ,color:'lightgrey'}}
              />
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                style={{
                  width: "40%",
                  height: "2.5rem",
                  padding: "0 8px",
                  textAlign: "center",
                  borderRadius: "1rem",
                }}
              />
            </div>
            <div className={classes.Container_Child}>
              <label htmlFor="description">
                <DescriptionIcon />
              </label>
              <input
                id="description"
                className={classes.description}
                type="text"
                placeholder="Enter description."
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>
            <div className={classes.Container_Child}>
              <label htmlFor="amount">
                <CurrencyRupeeIcon />
              </label>
              <input
                id="amount"
                className={classes.amount}
                type="number"
                placeholder="Enter amount."
                value={price}
                onChange={handlePriceChange}
              />
            </div>
            <div className={classes.submitbtn_container}>
              <button className={classes.button} type="submit">
                {(status=="loading") ? <Loader size={30} /> : <img src='/Icons/upload.png' alt="upload image" style={{height:'1rem',cursor:'pointer'}}/>}
              </button>
            </div>
          </div>
        </form>
      </My_modal>
    </div>
  );
};

export default Update_expense;
