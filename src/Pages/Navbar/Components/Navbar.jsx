import {React,useState} from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { Button } from '@mui/material';
import { Drawer } from 'antd';
import classes from './Navbar.module.css'
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const signout_user=()=>{
    signOut(auth).then(()=>{
      console.log('sign out successfully.')
    }).catch(error=>{
      console.log("error---->",error)
    })
  }

  // const DescriptionItem = ({ title, content }) => (
  //   <div className="site-description-item-profile-wrapper">
  //     <p className="site-description-item-profile-p-label">{title}:</p>
  //     {content}
  //   </div>
  // );
  return (
    <div className={classes.navbar}>
      <div className={classes.logo}>
        Logo
      </div>
      <div className={classes.profile}>
        <Button type="primary" onClick={showDrawer}>
          Profile
        </Button>
        <Drawer title="Basic Drawer" onClose={onClose} open={open}>
          <Button onClick={signout_user}>Signout</Button>
        </Drawer>
      </div>
    </div>
  )
}

export default Navbar