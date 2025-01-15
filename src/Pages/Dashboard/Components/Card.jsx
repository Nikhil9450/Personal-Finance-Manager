import React from 'react';
import classes from './Card.module.css';
import { motion } from "framer-motion"

const Card = ({ width, height,padding, children }) => {
  return (
    // <div
    //   className={classes.card}
    //   style={{
    //     width: width,
    //     height: height,
    //   }}
    // >
    <motion.div 
                className={classes.card}
                // whileHover={{
                //     scale: 1.1,
                // }}
                // transition={{ type: "spring", stiffness: 400, damping: 17 }}
                // whileTap={{
                //     scale: 1.02
                // }}
                style={{
                    width: width,
                    height: height,
                    padding:padding
                }}>
                
       {children}
    </motion.div>
   
    // </div>
  );
};

export default Card;
