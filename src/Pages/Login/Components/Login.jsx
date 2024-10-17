import React from 'react'
import classes from './Login.module.css';
import SignupModal from './SignupModal';
import { useState } from 'react';
import SigninModal from './SigninModal';
import { auth,GoogleAuthProvider } from "../../../firebase";
import { signInWithPopup } from 'firebase/auth';
const Login = () => {
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  // const [isSigninModalOpen, setSigninModalOpen] = useState(false);
  const openSignupModal = () => {
    setSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setSignupModalOpen(false);
  };
  // const openSigninModal = () => {
  //   setSigninModalOpen(true);
  // };

  // const closeSigninModal = () => {
  //   setSigninModalOpen(false);
  // };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      console.log("result--------->", result);
    } catch (error) {
      console.error("Google authentication failed:", error);
    }
  };
  return (
    <div className={classes.login_container}>
      <div className={classes.login_grid}>
        <div className={classes.grid_item1}>
          <img className={classes.icon} src = 'Icons/logo8.png' alt='twitter icon'></img>
          {/* <h4 className={classes.logo_name}>Personal Finance Manager</h4> */}
          </div>
        <div className={classes.grid_item2}>
          <div className={classes.signup_card}>
            <div>
              <h1>Your Money, Your Rules – Manage Smarter.</h1>
            </div>
            <div className={classes.form}>
              <div>
                {/* <h2>Let's cook together.</h2> */}
                <div>
                  <button className={classes.g_signup} onClick={signInWithGoogle} ><img className={classes.google_icon} src="Icons/google.png" alt="google icon" /><span>Sign up with Google</span></button>
                </div>
                <div className={classes.line}>
                  <hr width="100%" size="2" color="grey" noshade/>
                  <p className={classes.or}>or</p>
                  <hr width="100%" size="2" color="grey" noshade></hr>
                </div>
                <button className={classes.create_acc_btn} onClick={openSignupModal}>Create account</button>
                <p className={classes.term_condition_para}>By signing up,you agree to the Terms of Service and Privacy Policy, including Cookie Use.</p>
              </div>

              {/* <div>
                <h5>Already have an account?</h5>
                <button className={classes.signin_btn} onClick={openSigninModal}>Sign in</button>
              </div> */}
            </div>
          </div>  
        </div>
      </div>
      <SignupModal open={isSignupModalOpen} onClose={closeSignupModal} />
      {/* <SigninModal open={isSigninModalOpen} onClose={closeSigninModal} /> */}
    </div>
  )
}

export default Login