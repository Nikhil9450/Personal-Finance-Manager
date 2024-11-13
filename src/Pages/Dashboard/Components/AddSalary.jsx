import React from 'react'
import My_modal from '../../../My_modal'
import { useState } from 'react'
import AddButton from '../../../My_button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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
  return (
    <div>
        <AddButton 
            type="expense" 
            icon={<ShoppingCartIcon />} 
            label="Add Salary"
            onClick={showModal} 
            bgColor="grey"
        />
        <My_modal title="Add Salary" button_name="Add Salary" isModalOpen={modal} handleCancel={handleCancel}>
          <p>Add your salary</p>
        </My_modal>
    </div>
  )
}

export default AddSalary