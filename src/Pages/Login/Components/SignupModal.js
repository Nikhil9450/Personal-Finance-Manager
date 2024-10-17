import React from 'react'
import classes from './SignupModal.module.css'
// import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const SignupModal = (props) => {

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
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <div class="form" className={classes.form}>
          <form action="/register" method="post">
            <input type="text" name="username" id="username" placeholder="UserName" />
            <input type="email" name="email" placeholder="Email" id="email" />
            <input type="password" name="password" placeholder="Password" id="password" />
            <button>Sign Up</button>
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