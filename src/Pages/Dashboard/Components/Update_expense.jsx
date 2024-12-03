import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import My_modal from "../../../My_modal";
import Loader from "../../../Loader";
import DescriptionIcon from "@mui/icons-material/Description";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import classes from "./AddExpenses.module.css";
import { useDispatch } from "react-redux";
import { listenToUserExpenses } from "../../../Slices/UserSlice";
import { listenToUserProfile } from "../../../Slices/UserSlice";
const Update_expense = (props) => {
  const [modal, setModal] = useState(false);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const dispatch=useDispatch();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      console.log("No user is logged in.");
      setError("Please log in to update items.");
      return;
    }

    const fetchItemData = async () => {
      try {
        const itemDoc = doc(db, "users", user.uid, "items", props.itemId);
        const docSnap = await getDoc(itemDoc);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPrice(data.price || "");
          setDescription(data.description || "");
          setDate(data.expenditure_date || "");
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
    };

    console.log("Updating item:", updatedData);
    setLoader(true);

    try {
      const itemDoc = doc(db, "users", user.uid, "items", props.itemId);
      await updateDoc(itemDoc, updatedData);
      console.log("Item updated successfully.");
      setModal(false);
        console.log('UID from auth.currentUser:', auth.currentUser.uid); // Log UID


    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setLoader(false);
      dispatch(listenToUserProfile(auth.currentUser.uid));
      dispatch(listenToUserExpenses(auth.currentUser.uid));
    }
  };

  const showModal = () => setModal(true);
  const handleCancel = () => setModal(false);

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
            <div className={classes.Container_Child}>
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
                {loader ? <Loader size={30} /> : <img src='/Icons/upload.png' alt="upload image" style={{height:'1rem',cursor:'pointer'}}/>}
              </button>
            </div>
          </div>
        </form>
      </My_modal>
    </div>
  );
};

export default Update_expense;
