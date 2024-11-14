import React from 'react'
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
const AddSalary = () => {
const [modal,setModal]=useState(false)

const showModal = () => {
    console.log("opening modal");
    setModal(true);
  };

  const handleCancel = () => {
    console.log("closing modal");
    setModal(false);
  };  

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
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
        <AddButton 
            type="salary" 
            icon={<ShoppingCartIcon />} 
            label="Salary"
            onClick={showModal} 
            bgColor="grey"
        />
        <My_modal title="Add Salary" button_name="Add Salary" isModalOpen={modal} handleCancel={handleCancel}>
        <div id='addSalary_container' className={classes.addSalary_container}>
                <div className={classes.Container_Child}>
                    <DatePicker style={{ width: '100%', padding: '0 8px', textAlign: 'center' }} onChange={onChange} picker="month" className="customDropdown" />
                </div>
                <div className={classes.Container_Child}>
                    <label htmlFor="amount"><CurrencyRupeeIcon/></label>
                    <input id='amount' className={classes.amount} type="number" placeholder='Enter amount.'/>
                </div>
                <div className={classes.submitbtn_container}>
                  <button className={classes.button} type='submit'><AddIcon/></button>
                </div>
            </div>
        </My_modal>
    </div>
  )
}

export default AddSalary