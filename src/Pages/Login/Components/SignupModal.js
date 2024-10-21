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



const submit_signup_form=(e)=>{
  e.preventDefault();
  const formData ={
    name:nameRef.current.value,
    email:emailRef.current.value,
    password:passwordRef.current.value
  }
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
            <input type="text" name="username" id="username" placeholder="UserName"  ref={nameRef}/>
            <input type="email" name="email" placeholder="Email" id="email" ref={emailRef}/>
            <input type="password" name="password" placeholder="Password" id="password" ref={passwordRef}/>
            <input type="password" name="confirm_password" placeholder="Confirm Password" id="confirm_password" ref={confirmPasswordRef}/>
            <Button variant="contained" type='submit' >{((loader)?<Loader size={30}/>:"Login")}</Button>
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