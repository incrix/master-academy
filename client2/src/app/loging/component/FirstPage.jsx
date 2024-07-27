import React, { useState } from 'react'
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import PasswordChecklist from "react-password-checklist"
import useWindowDimensions from '../../../util/useWindowDimensions';
import LoadingButton from '@mui/lab/LoadingButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Input from '@mui/material/Input';
import { SvgIcon } from "@mui/material";
function FirstPage({controlNotification}) {
  const { width } = useWindowDimensions();
  const [passValidation,setpassValidation] = useState(false)
  const [getDetails,setDetails] = useState({email:'',password:''})
  const [isWaitCreate,setWaitCreate] = useState(false)
    const navigator = useNavigate()
    const signup = () =>{
      if(getDetails.email !== '' && getDetails.password !== '' && passValidation == true){ 
      if (validator.isEmail(getDetails.email)) {
        setWaitCreate(true)
      fetch('/api/user/create',{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({email:getDetails.email,password:getDetails.password})
      })
      .then(res => res.json())
      .then((data) => {
        controlNotification(data.status,data.message)
        if(data.status == 'success') {
          navigator('/login/verify')
          setWaitCreate(false)
      }
      })

    }     
else {
    controlNotification('info','Enter valid Email!')
  }
  }
  else controlNotification('info','Please fill the details')
    }
const style = {
  styleMobile:{
    height:'100px',
    overflowY:'scroll'
  }
}
const [values, setValues] = useState({
  password: "",
  showPassword: false,
});

const handleClickShowPassword = () => {
  setValues({ ...values, showPassword: !values.showPassword });
};

const handleMouseDownPassword = (event) => {
  event.preventDefault();
};

  return (
        <Paper
                sx={{
                  borderRadius: "7px",
                  background: "#FFF",
                  boxShadow: "0px 4px 14px 0px rgba(0, 0, 0, 0.15)",
                  width: "423px",
                   height: "500px",
                  display: "flex", 
                  justifyContent: "center",
                  alignItems: "center",
                   ...(width < 1000 && {
          width: "80%",
          height: "600px",
       
        })
                }}
              >
                <Stack
                  direction="column"
                  width="80%"
                  spacing="15px"
                  height="90%"
                  marginTop='20px'
                >
                  <Stack direction="column" spacing="10px">
                    <h1>Sign Up</h1>
                    <p>Already have an account <span style={{color:'#0038FF',cursor:'pointer',width:'55px'}} onClick={()=> navigator('/login')} >Log in </span> </p>
                  </Stack>
                  <Stack direction="column" spacing="10px">
                    <label htmlFor="">Email</label>
                    <Input
                type="text"
                placeholder="Enter your email"
                onChange={(e) =>
                  setDetails((preValue) => {
                    const getValue = { ...preValue };
                    getValue.email = e.target.value;
                    return getValue;
                  })
                }
                onKeyDown={(e) => {
                  if(e.key == "Enter") signup()
                }}
                value={getDetails.email}
                
            />
                  </Stack>
                  <Stack direction="column" spacing="10px">
                    <label htmlFor="">Create password</label>
                    <Input
              placeholder="Enter your password"
                type={values.showPassword ? "text" : "password"}
                onChange={(e) =>
                  setDetails((preValue) => {
                    const getValue = { ...preValue };
                    getValue.password = e.target.value;
                    return getValue;
                  })
                }
                onKeyDown={(e) => {
                  if(e.key == "Enter") signup()
                }}
                value={getDetails.password}
                endAdornment={
                    <InputAdornment position="end">
                        <SvgIcon
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {values.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </SvgIcon>
                    </InputAdornment>
                }
            />
                         
                    <PasswordChecklist
                  
				rules={["minLength","specialChar","number","capital"]}
				minLength={5}
				value={getDetails.password}
				// valueAgain={passwordAgain}
    
       
				onChange={(isValid) => {
          setpassValidation(isValid)
        }}
			/>
        
                  </Stack>
                  {
                    isWaitCreate ?  <LoadingButton loading   sx={{ width:'100%',height:'40px' ,backgroundColor:"#187163", "& .MuiCircularProgress-root": { color: "white", } }} />
                  :
                  <Button
                    style={{
                      borderRadius: "4px",
                      width: "100%",
                      color: "white",
                      background: "#187163",
                    }}
                    onClick={signup}
                  >
                    Sign up
                  </Button>
}
                </Stack>
              </Paper>
  
  )
}

export default FirstPage
