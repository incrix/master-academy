
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState,useEffect } from 'react';
export default function UnstyledSelectBasic({chooseOption,change,questions}) {

const [option,setOption] = useState('Multiple Choose')
  const handleChange = (event) => {
  
 if(event.target.value == 'Multiple Choose') chooseOption(false,'Multiple Choose')
 if(event.target.value == 'Number') chooseOption(true,'Number')
  
    setOption(event.target.value)
  };
useEffect(()=>{
setOption('Multiple Choose')
},[change])
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth  >
        <InputLabel id="demo-simple-select-label">{questions[0].type}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={option}
          label={questions[0].type}
          onChange={handleChange}
          
          sx={{borderRadius:'10px',background:'#FFF', '&:hover fieldset': {
            border: '1px solid #187163!important',
            borderRadius: '10px',
          },
          '&:focus-within fieldset, &:focus-visible fieldset': {
            border: '1px solid #187163!important',}}}
        >
          <MenuItem value={'Multiple Choose'}>Multiple Choose</MenuItem>
          <MenuItem value={'Number'}>Number</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}



  