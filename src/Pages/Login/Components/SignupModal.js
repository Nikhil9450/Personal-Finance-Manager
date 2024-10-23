import React, { useRef, useState } from 'react'
import classes from './SignupModal.module.css'
// import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { auth } from '../../../firebase';
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth';
import Loader from '../../../Loader'; 
import IconButton from '@mui/material/IconButton';
import AlertTitle from '@mui/material/AlertTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius:'20px',
  p: 4,
};
const SignupModal = (props) => {
const [open,setOpen]= useState(false);
const [error,setError]=useState(false);
const [loader,setLoader]=useState(false);
const emailRef =useRef(null);
const nameRef = useRef(null);
const passwordRef= useRef(null);
const confirmPasswordRef = useRef(null);
const [value, setValue] = React.useState(null);


const submit_signup_form=(e)=>{
  e.preventDefault();
  const formData ={
    name:nameRef.current.value,
    email:emailRef.current.value,
    password:passwordRef.current.value
  }
  createUserWithEmailAndPassword(auth,formData.email,formData.password)
  .then((response)=>{
    setLoader(false);
    console.log("response of create user----->",response);
  })
  .catch((error)=>{
    setLoader(false);
    console.log("error----->",error);
  })
  console.log("signup form data",formData)
}

  return (

    <div>
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          SIGNUP
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <div class="form" className={classes.form}>
          <form onSubmit={submit_signup_form} method="post">
          <label>Full Name</label>
            <input type="text" name="username" id="username" placeholder="UserName"  ref={nameRef}/>
            <label aria-required>Email</label>
            <input type="email" name="email" placeholder="Email" id="email" ref={emailRef}/>
            <label>Password</label>
            <input type="password" name="password" placeholder="Password" id="password" ref={passwordRef}/>
            <label>Confirm Password</label>
            <input type="password" name="confirm_password" placeholder="Confirm Password" id="confirm_password" ref={confirmPasswordRef}/>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select date"
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider> */}
            <label>Date of Birth</label>
            <input type="date" placeholder='Date of Birth'/>
            <Button variant="contained" type='submit' >{((loader)?<Loader size={30}/>:"Sign Up")}</Button>
            </form>
          </div>
          <div class="card_terms">
              <input type="checkbox" name="" id="terms"/> 
              <span> I have read and agree to the 
              <a href="">Terms of Service</a>
              </span>
          </div>
        </Typography>
      </Box>
    </Modal>
    </div>
  )
}

export default SignupModal