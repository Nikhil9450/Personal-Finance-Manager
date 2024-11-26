import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { Button } from '@mui/material';
import { Drawer, Divider, List, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import classes from './Navbar.module.css';
import Profile_picture from '../../../Profile_picture';
import AddSalary from '../../Dashboard/Components/AddSalary';
import MonthlySavingTarget from '../../Dashboard/Components/MonthlySavingTarget';
import {useSelector } from 'react-redux';
import Loader from '../../../Loader';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { profile, status, error } = useSelector((state) => state.user);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const signout_user = () => {
    signOut(auth)
      .then(() => console.log('Sign out successfully.'))
      .catch((error) => console.error("Error during sign out:", error));
  };

  useEffect(()=>{
    console.log("profile detail from redux ------------->",profile);
  })

  return (
    <div className={classes.navbar}>
                <style>
              {`
                .ant-drawer-header {
                        padding: 10px 24px !important;
                }
              `}
        </style>
      <div className={classes.logo}><img src='/Icons/self-dev.png' alt="" style={{height:'2rem',paddingRight:'1rem'}}/></div>
      <div className={classes.profile}>
      {profile ? (
                    <div className={classes.nameContainer}>
                      <p className={classes.name}>{profile.name.toUpperCase()}</p>
                      <p className={classes.email}>{profile.email}</p>
                    </div>
                  ) : (
                    <div className={classes.nameContainer}>
                      <Loader size={15} />
                    </div>
                  )}
      <Button type="primary" onClick={showDrawer} style={{width:'2rem'}}>
        <Avatar
          size={30}
          src={profile?.photoURL || 'fallback-image-url.png'} // Use fallback image if photoURL is missing
          icon={<UserOutlined />} // Icon as backup if src fails
        />
      </Button>
        <Drawer
          title={
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Profile_picture />
            </div>
          }
          onClose={onClose}
          open={open}
        >
          <List
            size="small"
            footer={
              <div>
                <Button onClick={signout_user}>Signout</Button>
              </div>
            }
            bordered
          >
            <List.Item>
              <AddSalary />
            </List.Item>
            <List.Item>
              <MonthlySavingTarget />
            </List.Item>
          </List>
        </Drawer>
      </div>
    </div>
  );
};

export default Navbar;
