import React from "react";
import Icon from "@mui/material/Icon";
import ClearIcon from "@mui/icons-material/Clear";

import TextField from "@mui/material/TextField";
import Radio from '@mui/material/Radio';
export default  function Choose({
    option ,studentAns, actualAns,  index,opIndex
}) {
  const style = {
    outerLayer: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
    },
    textField: {
      width: "40%",
    },
    textFieldTD:{
      width: "40%",
    }
  };



  return (
    <div style={style.outerLayer}>
      <ColorRadioButtons
      studentAns={studentAns}
      actualAns={actualAns} 
      index={index}
      opIndex={opIndex}
      />
      <p>{option}</p>
   

    </div>
  );
}





function ColorRadioButtons({studentAns, actualAns,index,opIndex}) {



  const controlProps = (studentAns, actualAns, index ,opIndex) => ({
    checked: actualAns[index]  == opIndex ||  studentAns[index] == opIndex   ? true : false ,
    value: actualAns[index] == opIndex ? true : false,
  });

  return (
    <div>
    
      <Radio
          {...controlProps(studentAns, actualAns,  index ,opIndex)}
      color="secondary"
        sx={{
        
        color:  '#787486' ,
          '&.Mui-checked': {
            color:  studentAns[index] == opIndex &&  actualAns[index] !== opIndex ? 'red' : '#187163',
          },
        }}
        disabled
        
      />
    </div>
  );
}

