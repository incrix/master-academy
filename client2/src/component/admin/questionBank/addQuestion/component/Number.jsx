import React from "react";

import Icon from "@mui/material/Icon";
import ClearIcon from "@mui/icons-material/Clear";
import ColorRadioButtons from "./selectOption";
import TextField from "@mui/material/TextField";

function Choose({
   to,from,setNumber
}) {
  const style = {
    outerLayer: {
      display: "flex",
      gap: "30px",
      flexDirection:'column',
     
    },
    textField: {
      width: "40%",
    },
    textFieldTD:{
      width: "40%",
    },
    form:{
        display:'flex',
        alignItems:'center',
        gap:'20px'
    }
  };

  const sendAnswer = () => {
 
  };

  return (
    <div style={style.outerLayer}>
    <div style={style.form}>
    <p style={{width:'20px'}}>
        From 
    </p>

      <TextField
        label=""
        multiline
        maxRows={4}
        variant="filled"
        onChange={(e) => {
            setNumber((preValue) => {
                let newList = [...preValue];
                newList[0].from = e.target.value;
                return newList;
              });
          
        }}
        sx={{
          background: "#F5F5F5",
          "& .MuiFilledInput-root:focus-within": { background: "#F5F5F5" },
          "& .MuiFilledBase-root:focus": { background: "#F5F5F5" },
          "& .MuiFilledInput-root:hover": { background: "#F5F5F5" },
          "& .MuiFilledInput-root": { background: "#F5F5F5" },
          "& .MuiFilledInput-underline:before": {
            borderBottom: "#D1D7DD solid 2px",
          },
          "& .MuiFilledInput-underline:after": {
            borderBottom: "#187163 solid 2px",
          },
          "& .MuiFilledInput-underline:hover:before": {
            borderBottom: "#187163 solid 2px",
          },
          "& .MuiFilledInput-input": {
            color: "#787486",
            background: "#F5F5F5",
          },
        }}
        style={style.textField}
        value={from}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendAnswer();
          }
        }}
      />
</div>
<div style={style.form}>
    <p style={{width:'20px'}}>
        To
    </p>
    <TextField
        label=""
        multiline
        maxRows={4}
        variant="filled"
        onChange={(e) => {
            setNumber((preValue) => {
                let newList = [...preValue];
                newList[0].to = e.target.value;
                return newList;
              });
        }}
        sx={{
          background: "#F5F5F5",
          "& .MuiFilledInput-root:focus-within": { background: "#F5F5F5" },
          "& .MuiFilledBase-root:focus": { background: "#F5F5F5" },
          "& .MuiFilledInput-root:hover": { background: "#F5F5F5" },
          "& .MuiFilledInput-root": { background: "#F5F5F5" },
          "& .MuiFilledInput-underline:before": {
            borderBottom: "#D1D7DD solid 2px",
          },
          "& .MuiFilledInput-underline:after": {
            borderBottom: "#187163 solid 2px",
          },
          "& .MuiFilledInput-underline:hover:before": {
            borderBottom: "#187163 solid 2px",
          },
          "& .MuiFilledInput-input": {
            color: "#787486",
            background: "#F5F5F5",
          },
        }}
        
        style={style.textField}
        value={to}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendAnswer();
          }
        }}
      />
</div>
 
    </div>
  );
}

export default Choose;
