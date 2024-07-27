import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
export default function AddOption({task,getGroupName}) {
  const [option, setOption] = useState('')
  
  const handleChange = (event) => {
    getGroupName(event.target.value)
 
    setOption(event.target.value)
  }

  return (
    <Box sx={{ minWidth: 120 ,marginTop:'20px' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Choose Question Bank</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={option}
          label="Choose Question Bank"
          onChange={handleChange}
        
        >
            {task.map((task,index) =>  <MenuItem key={index} value={task}  >{task.title}</MenuItem> )}
         
        </Select>
      </FormControl>
    </Box>
  )
}