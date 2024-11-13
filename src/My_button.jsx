import React from 'react';
import Button from '@mui/material/Button';
import { height, styled } from '@mui/system';

const AddButton = ({ type, icon, label,onClick ,color ,bgColor}) => {
  // Define button styles based on the type
  const buttonStyles = {
    // fontWeight: 'bold',
    fontSize: '1rem',
    padding: '10px 20px',
    borderRadius: '20px',
    textTransform: 'none',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:(bgColor)?bgColor:"green",
    color:(color)?color:"white",
    height:'inherit'
  };

  return (
    <Button
      variant="contained"
      startIcon={icon}
      sx={buttonStyles}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default AddButton;

