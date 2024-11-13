import React from 'react'
import Navbar from '../../Navbar/Components/Navbar'
import classes from './Dashboard.module.css'
import Card from './Card'
import Grid from '@mui/material/Grid2';
import { motion } from "framer-motion"
import AddExpenses from './AddExpenses';
import AddSalary from './AddSalary';
import AddButton from '../../../My_button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
const Dashboard = () => {
  return (
    <div className={classes.dashboard}>
      <Navbar/>
      <div className={classes.dashboard_content}>
        <Grid container rowSpacing={5} columnSpacing={5}>
          <Grid size={8}>
            <Card width="" height="200px">
              {/* Content goes here */}
              <AddExpenses/>
            </Card>
          </Grid>
          
          <Grid size={4}>
            <Card width="" height="200px">
              {/* Content goes here */}
              <AddSalary/>
            </Card>
          </Grid>

          <Grid size={6}>
            <Card width="" height="200px">
              {/* Content goes here */}
            </Card>
          </Grid>

          <Grid size={6}>
            <Card width="" height="200px">
              {/* Content goes here */}
            </Card>
          </Grid>

          <Grid size={4}>
            <Card width="" height="200px">
              {/* Content goes here */}
            </Card>
          </Grid>

          <Grid size={4}>
            <Card width="" height="200px">
              {/* Content goes here */}
            </Card>
          </Grid>

          <Grid size={4}>
            <Card width="" height="200px">
              {/* Content goes here */}
            </Card>
          </Grid>

          <Grid size={12}>
            <Card width="" height="200px">
              {/* Content goes here */}
            </Card>
          </Grid>
        </Grid>
      </div>

    </div>
  )
}

export default Dashboard