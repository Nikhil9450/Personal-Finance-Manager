import {React,useState} from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { Button } from '@mui/material';
import { Drawer } from 'antd';
import classes from './Navbar.module.css';
import Profile_picture from '../../../Profile_picture';
import AddSalary from '../../Dashboard/Components/AddSalary';
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
        <Drawer title=<div style={{display:'flex',justifyContent:'end'}}><Profile_picture/></div> onClose={onClose} open={open}>
          <AddSalary/>
          <Button onClick={signout_user}>Signout</Button>
        </Drawer>
      </div>
    </div>
  )
}

export default Navbar