import React from 'react'
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

const AddExpenses = () => {
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
            icon={<AttachMoneyIcon />} 
            label="Add Expense"
            onClick={showModal} 
            bgColor="grey"
            
        />
        <My_modal title="Add expense" button_name="Add Expenses" isModalOpen={modal} handleCancel={handleCancel}>
             <div>
                <IconButton sx={{width:"20px", p: '10px' }} aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Google Maps"
                    inputProps={{ 'aria-label': 'search google maps' }}
                />
                <IconButton type="button" sx={{width:"20px", p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton color="primary" sx={{width:"20px",  p: '10px' }} aria-label="directions">
                    <DirectionsIcon />
                </IconButton>
            </div>
        </My_modal>
    </div>
  )
}

export default AddExpenses