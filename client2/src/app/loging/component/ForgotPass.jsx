import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import PasswordChecklist from "react-password-checklist";
import useWindowDimensions from "../../../util/useWindowDimensions";
import LoadingButton from "@mui/lab/LoadingButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Input from "@mui/material/Input";
import { SvgIcon } from "@mui/material";
function ForgotPass({ controlNotification }) {
  const { width } = useWindowDimensions();
  const [passValidation, setpassValidation] = useState(false);
  const [getDetails, setDetails] = useState({ email: "", password: "" });
  const [isWaitVerify,setWatiVerify] = useState(false)
  const navigator = useNavigate();
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const signup = () => {
    if (
      getDetails.email !== "" &&
      getDetails.password !== "" &&
      passValidation == true
    ) {
      if (validator.isEmail(getDetails.email)) {
        setWatiVerify(true)
        fetch("/api/user/forgotPass", {
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
            controlNotification(data.status, data.message);
            if (data.status == "success") {
              navigator("/login/verify")
            setWatiVerify(false)
          }
          });
      } else {
        controlNotification("info", "Enter valid Email!");
      }
    } else controlNotification("info", "Please fill the details");
  };

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
        }),
      }}
    >
      <Stack direction="column" width="80%" spacing="15px" height="85%">
        <Stack direction="column" spacing="10px">
          <h1>Change Password</h1>
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
              if (e.key == "Enter") signup();
            }}
            value={getDetails.email}
          />
        </Stack>
        <Stack direction="column" spacing="10px">
          <label htmlFor="">Change Password</label>
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
              if (e.key == "Enter") signup();
            }}
            value={getDetails.password}
            endAdornment={
              <InputAdornment position="end">
                <SvgIcon
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </SvgIcon>
              </InputAdornment>
            }
          />
          <PasswordChecklist
            rules={["minLength", "specialChar", "number", "capital"]}
            minLength={5}
            value={getDetails.password}
            onChange={(isValid) => {
              setpassValidation(isValid);
            }}
          />
        </Stack>
    
        {
isWaitVerify ? <LoadingButton
loading
sx={{
  width: "100%",
  height: "40px",
  backgroundColor: "#187163",
  "& .MuiCircularProgress-root": { color: "white" },
}}
/>
  :      
        <Button
          style={{
            borderRadius: "4px",
            width: "100%",
            color: "white",
            // marginTop:'auto',
            background: "#187163",
          }}
          onClick={signup}
        >
          Submit
        </Button>
}
      </Stack>
    </Paper>
  );
}

export default ForgotPass;
