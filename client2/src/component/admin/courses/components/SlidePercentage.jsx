import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useState } from 'react';
function valuetext(value) {
  return `${value}°C`;
}

export default function RangeSlider({setSetting,courseSetting}) {
  const [value, setValue] = useState(courseSetting.mediumPercentage)

  const handleChange = (event, newValue) => {
 
    setValue(newValue)
  const low = newValue[0] -1
  const lowPercentage = [0 , low]
  const mediumPercentage = newValue

  const high = 1 + newValue[1]
  const HighPercentage = [high,100]
    setSetting((preValue) =>{
        const getValue = {...preValue}
        getValue.lowPercentage = lowPercentage
        getValue.mediumPercentage = mediumPercentage
        getValue.highPercentage = HighPercentage
        return getValue
    })

  }

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => 'Temperature range'}
        value={value}
        sx={{color:'#187163'}}
        onChange={handleChange}
        valueLabelDisplay="auto"
        // getAriaValueText={valuetext}
      />
    </Box>
  );
}