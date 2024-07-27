
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState,useEffect } from 'react';
export default function SelectLevel({setQuestions,questions,change}) {
const [level,setLevel] = useState('')
  const handleChange = (event) => {
     setQuestions((preValue)=>{
      let newList = [...preValue];
      newList[0].level = event.target.value;
      return newList;
    })
    setLevel(event.target.value)
  };
useEffect(()=>{
setLevel('')
},[change])
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth  >
        <InputLabel id="demo-simple-select-label">Choose Level</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={level}
          label='Choose Level'
          onChange={handleChange}
          sx={{borderRadius:'10px',background:'#FFF', '&:hover fieldset': {
            border: '1px solid #187163!important',
            borderRadius: '10px',
          },
          '&:focus-within fieldset, &:focus-visible fieldset': {
            border: '1px solid #187163!important',}}}
          
        >
          <MenuItem value={'Easy'}>Easy</MenuItem>
          <MenuItem value={'Medium'}>Medium</MenuItem>
          <MenuItem value={'Hard'}>Hard</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

