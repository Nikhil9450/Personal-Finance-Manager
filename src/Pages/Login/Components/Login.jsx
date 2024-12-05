import React from 'react'
import classes from './Login.module.css';
import SignupModal from './SignupModal';
import { useState } from 'react';
import SigninModal from './SigninModal';
import { auth,GoogleAuthProvider,db } from "../../../firebase";
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
const Login = () => {
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isSigninModalOpen, setSigninModalOpen] = useState(false);
  const openSignupModal = () => {
    setSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setSignupModalOpen(false);
  };
  const openSigninModal = () => {
    setSigninModalOpen(true);
  };

  const closeSigninModal = () => {
    setSigninModalOpen(false);
  };

  // const signInWithGoogle = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, new GoogleAuthProvider());
  //     console.log("result--------->", result);
  //   } catch (error) {
  //     console.error("Google authentication failed:", error);
  //   }
  // };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // Firebase Auth user object
  
      // Ensure Firestore document exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
        });
        console.log('New user document created in Firestore.');
      } else {
        console.log('User document already exists.');
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };
  return (
    <div className={classes.login_container}>
      <div className={classes.login_grid}>
        <div className={classes.grid_item1}>
          {/* <img className={classes.icon} src = 'Icons/logo8.png' alt='twitter icon'></img> */}
          <img className={classes.icon} src='/Icons/self-dev.png' alt="logo"/>
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
                  <hr width="100%" size="1" color="grey" noshade/>
                  <p className={classes.or}>or</p>
                  <hr width="100%" size="1" color="grey" noshade></hr>
                </div>
                <button className={classes.create_acc_btn} onClick={openSignupModal}>Create account</button>
                <p className={classes.term_condition_para}>By signing up,you agree to the Terms of Service and Privacy Policy, including Cookie Use.</p>
              </div>

              <div>
                <h5 className={classes.al_hav_acc}>Already have an account?</h5>
                <button className={classes.signin_btn} onClick={openSigninModal}>Sign in</button>
              </div>
            </div>
          </div>  
        </div>
      </div>
      <SignupModal open={isSignupModalOpen} onClose={closeSignupModal} />
      <SigninModal open={isSigninModalOpen} onClose={closeSigninModal} />
    </div>
  )
}

export default Login