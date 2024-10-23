import React from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { Button } from '@mui/material';

const Navbar = () => {
  const signout_user=()=>{
    signOut(auth).then(()=>{
      console.log('sign out successfully.')
    }).catch(error=>{
      console.log("error---->",error)
    })
  }
  return (
    <div>
    <Button onClick={signout_user}>Signout</Button>
    </div>
  )
}

export default Navbar