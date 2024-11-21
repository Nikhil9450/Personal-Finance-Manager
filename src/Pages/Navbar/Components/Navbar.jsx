import {React,useState} from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { Button } from '@mui/material';
import { Drawer } from 'antd';
import classes from './Navbar.module.css';
import Profile_picture from '../../../Profile_picture';
import AddSalary from '../../Dashboard/Components/AddSalary';
import MonthlySavingTarget from '../../Dashboard/Components/MonthlySavingTarget';
import { Divider, List, Typography } from 'antd';
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
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
  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];
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
        <Avatar size={30} icon={<UserOutlined />} />
        </Button>
        <Drawer title=<div style={{display:'flex',justifyContent:'end'}}><Profile_picture/></div> onClose={onClose} open={open}>
          
          
          
            {/* <Divider orientation="left">Small Size</Divider> */}
            <List
              size="small"
              // header={<div>Header</div>}
              footer={<div><Button onClick={signout_user}>Signout</Button></div>}
              bordered
              dataSource={data}
              // renderItem={(item) => <List.Item>{item}</List.Item>}
            >
            <List.Item> <AddSalary/></List.Item>
            <List.Item> <MonthlySavingTarget/></List.Item>
            </List>
          </Drawer>
      </div>
    </div>
  )
}

export default Navbar