import React, { useRef, useState } from 'react'
import classes from './SignupModal.module.css'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { auth } from '../../../firebase';
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth';
import Loader from '../../../Loader'; 
import IconButton from '@mui/material/IconButton';
import AlertTitle from '@mui/material/AlertTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Alert,Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
// import FormControl from '@mui/material/FormControl';
// import Swal from 'sweetalert2'
import Select from '@mui/material/Select';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius:'20px',
  p: 4,
};
const SignupModal = (props) => {
const [error,setError]=useState(false);
const [loader,setLoader]=useState(false);
const emailRef =useRef(null);
const nameRef = useRef(null);
const passwordRef= useRef(null);
const confirmPasswordRef = useRef(null);
const DOBref=useRef(null);
const [alertOpen,setAlertOpen]=useState(false)
const [gender, setGender] =useState('');

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const handleChange = (event) => {
  setGender(event.target.value);
};

function openAlert(){
  setAlertOpen(true);
  setTimeout(()=>{
    closeAlert()
  },[2000])
};
function closeAlert(){
  setAlertOpen(false);
}


const submit_signup_form = (e) => {
  e.preventDefault();
  const formData = {
    name: nameRef.current.value,
    email: emailRef.current.value,
    password: passwordRef.current.value,
    confirmPass: confirmPasswordRef.current.value,
    DOB: DOBref.current.value,
    gender: gender,
  };

  console.log("form data---------->",formData)

  // Validation
  if (!formData.name) {
    setError("Name is required.");
    openAlert();
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(formData.email)) {
    setError("Please enter a valid email.");
    openAlert();
    return;
  }

  if (formData.password.length < 6) {
    setError("Password should be at least 6 characters long.");
    openAlert();
    return;
  }

  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordPattern.test(formData.password)) {
    setError("Password must contain at least one letter and one number.");
    openAlert();
    return;
  }

  if (formData.password !== formData.confirmPass) {
    setError("Passwords do not match.");
    openAlert();
    return;
  }

  const today = new Date();
  const inputDOB = new Date(formData.DOB);
  if (inputDOB >= today) {
    setError("Date of Birth must be in the past.");
    openAlert();
    return;
  }

  if (!formData.gender) {
    setError("Please select a gender.");
    openAlert();
    return;
  }

  // Proceed with Firebase auth if all validations pass
  createUserWithEmailAndPassword(auth, formData.email, formData.password)
    .then((response) => {
      setLoader(false);
      console.log("response of create user----->", response);
    })
    .catch((error) => {
      setLoader(false);
      setError(error)
      openAlert();
      console.log("error----->", error);
    });

  console.log("signup form data", formData);
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
          SIGNUP
        </Typography>
          <Collapse in={alertOpen}>
            <Alert severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setAlertOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          </Collapse>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <div class="form" className={classes.form}>
          <form onSubmit={submit_signup_form} method="post">
            <Grid container rowSpacing={.1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid size={12}>
                {/* <Item>size=8</Item> */}
                <div>
                  <label>Full Name</label>
                  <input type="text" name="username" id="username" placeholder="UserName"  ref={nameRef}/>
                </div>
              </Grid>
              <Grid size={12}>
                <div>
                  <label aria-required>Email</label>
                  <input type="email" name="email" placeholder="Email" id="email" ref={emailRef}/>
                </div>
              </Grid>
              <Grid size={6}>
              <div className={classes.child1}>
                <label>Password</label>
                <input type="password" name="password" placeholder="Password" id="password" ref={passwordRef}/>
              </div>
              </Grid>
              <Grid size={6}>
              <div className={classes.child}>
                <label>Confirm Password</label>
                <input type="password" name="confirm_password" placeholder="Confirm Password" id="confirm_password" ref={confirmPasswordRef}/>
              </div>
              </Grid>

              <Grid size={8}>
                <div>
                  <label>Date of Birth</label>
                  <input type="date" placeholder='Date of Birth' ref={DOBref}/>
                </div>
              </Grid>

              <Grid size={4}>
                <div>
                  <label >Gender</label>
                  <select
                    labelId="demo-select-small-label"
                    // id="demo-select-small"
                    value={gender}
                    label="Gender"
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    {/* <MenuItem value={30}></MenuItem> */}
                  </select>
                </div>
              </Grid>

              <Grid size={12}>
                <Button style={{marginTop:"1rem"}} variant="contained" type='submit' >{((loader)?<Loader size={30}/>:"Sign Up")}</Button>
              </Grid>
            </Grid>

            </form>
          </div>
          <div className={classes.card_terms}>
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