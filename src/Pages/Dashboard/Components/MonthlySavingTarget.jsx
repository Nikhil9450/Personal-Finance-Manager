import React, { useRef } from 'react'
import My_modal from '../../../My_modal'
import { useState } from 'react'
import AddButton from '../../../My_button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { DatePicker, Space, DatePickerProps } from 'antd';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AddIcon from '@mui/icons-material/Add';
import classes from "./AddSalary.module.css"
import { doc, collection, addDoc ,updateDoc } from "firebase/firestore";
import { db,auth } from '../../../firebase';
import Loader from '../../../Loader';

// import savings from 'public/Icons/savings.png';

const MonthlySavingTarget = () => {
  const [modal,setModal]=useState(false)
  const [error,setError]=useState(false);
  const [loader,setLoader]=useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const showModal = () => {
    console.log("opening modal");
    setModal(true);
  };

  const handleCancel = () => {
    console.log("closing modal");
    setModal(false);
  };  

  return (
    <div>
            {/* <AddButton 
            type="salary" 
            icon={<AttachMoneyIcon />} 
            label="Salary"
            onClick={showModal} 
            bgColor="grey"
        /> */}
        <button onClick={showModal} style={{padding:'5px',justifyContent:'start', background:'none'}} ><img src='/Icons/savings.png' alt="" style={{height:'2rem',paddingRight:'1rem'}} /> Set Saving Gole</button>
              <My_modal title="SET SAVING GOLE." button_name="Set saving gole." isModalOpen={modal} handleCancel={handleCancel}>
        <form method='post'>
            {/* <div id='addSalary_container' className={classes.addSalary_container}>
                <div className={classes.Container_Child}>
                    <DatePicker style={{ width: '100%', padding: '0 8px', textAlign: 'center' }} onChange={onChange} picker="month" className="customDropdown" />
                </div>
                <div className={classes.Container_Child}>
                    <label htmlFor="amount"><CurrencyRupeeIcon/></label>
                    <input id='amount' className={classes.amount} type="integer" placeholder='Enter amount.' ref={salary}/>
                </div>
                <div className={classes.submitbtn_container}>
                  <button className={classes.button} type='submit'>{loader?<Loader size={30} />:<AddIcon/>}</button>
                </div>
            </div> */}
        </form>
        </My_modal>
    </div>
  )
}

export default MonthlySavingTarget