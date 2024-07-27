import * as React from 'react';

import Radio from '@mui/material/Radio';


export default function ColorRadioButtons({isCorrect,index,setCorrectOption,actValue}) {

  const handleChange = (event) => {
     setCorrectOption(index,actValue,isCorrect)
  }

  const controlProps = (item) => ({
    checked: true === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  return (
    <div>
    
      <Radio
          {...controlProps(isCorrect)}
 
        sx={{
          color: '#787486',
          '&.Mui-checked': {
            color:'#187163',
          },
        }}
      />
    </div>
  );
}
