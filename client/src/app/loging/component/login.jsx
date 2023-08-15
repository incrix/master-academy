import React, { useState } from 'react'
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
function Login({controlNotification}) {
  const [getDetails,setDetails] = useState({email:'',password:''})
    const navigator = useNavigate()
    const signup = () =>{

 
      if(getDetails.email !== '' , getDetails.password !== ''){  
      fetch('/api/user/login',{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({email:getDetails.email,password:getDetails.password})
      })
      .then(res => res.json())
      .then((data) => {
        controlNotification(data.status,data.message)
        if(data.status == 'success') navigator('/')
      })
    
    }
    else controlNotification('info','Please enter email and password')
       
    }
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
                <Stack
                  direction="column"
                  width="80%"
                  spacing="25px"
                  height="75%"
                >
                  <Stack direction="column" spacing="10px">
                    <h1>Login</h1>
                 
                  </Stack>
                  <Stack direction="column" spacing="10px">
                    <label htmlFor="">Email</label>
                    <TextField
                      id="outlined-basic"
                      label="Enter your Email"
                      variant="outlined"
                      onChange={(e)=> setDetails((preValue)=> {
                        const getValue = {...preValue}
                        getValue.email= e.target.value
                        return getValue
                      })}
                    />
                  </Stack>
                  <Stack direction="column" spacing="10px">
                    <label htmlFor=""> password</label>
                    <TextField
                      id="outlined-basic"
                      label="password"
                      variant="outlined"
                      onChange={(e)=> setDetails((preValue)=> {
                        const getValue = {...preValue}
                        getValue.password= e.target.value
                        return getValue
                      })}
                    />
                  </Stack>
                  <Button
                    style={{
                      borderRadius: "4px",
                      width: "100%",
                      color: "white",
                      background: "#187163",
                    }}
                    onClick={signup}
                  >
                    Login
                  </Button>
                </Stack>
              </Paper>
  
  )
}

export default Login
