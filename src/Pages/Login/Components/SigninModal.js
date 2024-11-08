import React from 'react'
import classes from './SignupModal.module.css'
// import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState,useRef } from 'react';
import { Alert,Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
  borderRadius:'20px',
  boxShadow: 24,
  p: 4,
};

const SigninModal = (props) => {
  const [loader,setLoader]=useState(false);
  const [open,setOpen]=useState(false);
  const [error,setError]=useState("")
  const emailRef= useRef(null);
  const passwordRef = useRef(null);

  function openAlert(){
    setOpen(true);
    setTimeout(()=>{
      closeAlert()
    },[2000])
  };
  function closeAlert(){
    setOpen(false);
  }

  const onSubmit = (e) => {
    // console.log("initial values---------->",user_data)
    e.preventDefault();
    const formData = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
    // Gather form data, assuming you have it in your formData state
    // const { name, email, phone, password, confirmPassword, gender, dateOfBirth } = formData;
    console.log("this formdata is in onSubmit---->",formData)
    setLoader(true);
    signInWithEmailAndPassword(auth,formData.email,formData.password)
    .then((userCred)=>{
      setLoader(false);
      console.log("usercred------------->",userCred);
    })
    .catch((error)=>{
      console.log(error);
      setLoader(false);
      setError(error)
      openAlert();
    })
  
  };
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
            SIGN IN
          </Typography>
          <Collapse in={open}>
                <Alert severity="error"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}>
                  <AlertTitle>Error</AlertTitle>
                  Invalid user credentials.
                </Alert>
              </Collapse>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div class="form" className={classes.form}>
            <form onSubmit={onSubmit}>
              <input type="email" name="email" placeholder="Email" id="email" ref={emailRef}/>
              <input type="password" name="password" placeholder="Password" id="password" ref={passwordRef} />

              <Button style={{marginTop:".5rem"}} variant="contained" type='submit' >{((loader)?<Loader size={30}/>:"Login")}</Button>
            </form>
            </div>
          </Typography>
        </Box>
      </Modal>

    </div>
  )
}

export default SigninModal