import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../../util/useWindowDimensions";
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Input from '@mui/material/Input';
import { SvgIcon } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
function Login ({ controlNotification }) {
  const { width } = useWindowDimensions();
  const [getDetails, setDetails] = useState({ email: "", password: "" });
  const navigator = useNavigate();
  const [isLoading,setLoading] = useState(false)
  const signup = () => {
    if ((getDetails.email !== "", getDetails.password !== "")) {
      setLoading(true)
      fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: getDetails.email,
          password: getDetails.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          
          if (data.status == "goal") navigator(`/login/goal`);
          if (data.status == "userDetails") navigator(`/login/create`);
          if (data.status == "isExam") navigator(`/exam/state?=${data.examID}`);
          if (data.status == "success" && data.roll == "student") {
            navigator(`/?=${data.id}`);
          }

          if (
            (data.status == "success" && data.roll == "teacher") ||
            (data.status == "success" && data.roll == "institution") ||
            (data.status == "success" && data.roll == "admin")
          ) {
            if(data.roll == "teacher" || data.roll == "institution") return navigator(`/institution?=${data.institutionID}`)
           return navigator(`/admin/dashboard?=${data.id}`);
          }
          if (data.status == "error")
          {  controlNotification(data.status, data.message);}
          setLoading(false)
        });
    } else controlNotification("info", "Please enter email and password");
  };
  useEffect(() => {
    fetch("/isLogin")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "goal") navigator(`/login/goal`);
        if (data.status == "userDetails") navigator(`/login/create`);
        if (data.status == "isExam") navigator(`/exam/state?=${data.examID}`);
        if (data.status == "isLogin" && data.roll == "student")
          navigator(`/?=${data.id}`);
        if (
          (data.status == "isLogin" && data.roll == "admin") ||
          (data.status == "isLogin" && data.roll == "teacher") ||
          (data.status == "isLogin" && data.roll == "institution")
        )
    {     if(data.roll == "teacher" || data.roll == "institution") return navigator(`/institution?=${data.institutionID}`)
         else  
      return navigator(`/admin/dashboard?=${data.id}`);}
      });
  }, []);
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
        height: "480px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...(width < 1000 && {
          width: "80%",
          height: "480px",
        }),
      }}
    >
      <Stack direction="column" width="80%" spacing="25px" height="75%">
        <Stack direction="column" spacing="10px">
          <h1>Login</h1>
          <p>
            Create an account and{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigator("/signup")}
            >
              {" "}
              Sign Up{" "}
            </span>{" "}
          </p>
        </Stack>
        <Stack direction="column" spacing="10px">
          <label htmlFor="">Email</label>
          <Input
              type="text"
              name="Email"
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
          <label htmlFor=""> Password</label>
            <Input
            name="Password"
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
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <div style={{cursor : 'pointer' , fontSize: width > 500 ? '16px' : '14px',color:'blue'}} onClick={() => navigator('/forgotPass')}>Forgot password</div>
            <a href="policy" style={{fontSize: width > 500 ? '16px' : '14px'}}> Terms and Policy </a>
            </Stack>

        </Stack>
     {  isLoading ? <LoadingButton
loading
sx={{
  width: "100%",
  height: "36px",
  backgroundColor: "#187163",
  "& .MuiCircularProgress-root": { color: "white" },
}}
/> :
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
        </Button>}
      </Stack>
    </Paper>
  );
}

export default Login;
