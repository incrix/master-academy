import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
function Verify({controlNotification}) {
    const [otp,setOtp] = useState('')
  const navigator = useNavigate();
 
  const Verify = () =>{
    if(otp !== ''){  
        console.log(otp)
        fetch('/api/user/checkOtp',{
          method:"POST",
          headers:{
            "Content-type":"application/json"
          },
          body:JSON.stringify({otp:otp})
        })
        .then(res => res.json())
        .then((data) => {
          controlNotification(data.status,data.message)
          if(data.status == 'success')  navigator("/login/create");
        })
      
      }
      else controlNotification('info','Please enter the otp')
   
  }
  const style = {
    otp: {
      color: "#187163",
      fontFamily: " DM Sans",
      fontSize: " 12px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: " normal",
    },
  };
  return (
    <Paper
      sx={{
        borderRadius: "7px",
        background: "#FFF",
        boxShadow: "0px 4px 14px 0px rgba(0, 0, 0, 0.15)",
        width: "423px",
        height: "443px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack direction="column" spacing='35px' width="80%"  height="50%">
      
        <Stack direction="column" spacing="20px">
          <label htmlFor="">OTP</label>
          <TextField
            id="outlined-basic"
            label="Enter your OTP"
            variant="outlined"
            onChange={(e) => setOtp(e.target.value)}
          />
          <p style={style.otp}>Resend OTP</p>
        </Stack>
      
        <Button
          style={{
            borderRadius: "4px",
            width: "100%",
            color: "white",
            background: "#187163",
          }}
          onClick={Verify}
        >
          Verify
        </Button>
      </Stack>
    </Paper>
  );
}

export default Verify;
