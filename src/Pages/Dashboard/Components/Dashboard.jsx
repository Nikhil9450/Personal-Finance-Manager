import React from 'react'
import Navbar from '../../Navbar/Components/Navbar'
import classes from './Dashboard.module.css'
import Card from './Card'
import Grid from '@mui/material/Grid2';
import { motion } from "framer-motion"

const Dashboard = () => {
  return (
    <div className={classes.dashboard}>
      <Navbar/>
      <Grid container rowSpacing={5} columnSpacing={5}>
        <Grid size={8}>
          <Card width="" height="200px">
            {/* Content goes here */}
          </Card>
        </Grid>
        
        <Grid size={4}>
          <Card width="" height="200px">
            {/* Content goes here */}
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
  )
}

export default Dashboard