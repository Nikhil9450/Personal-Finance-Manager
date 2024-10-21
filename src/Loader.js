import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loader(props) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress color="inherit"  size={props.size}  />
    </Box>
  );
}