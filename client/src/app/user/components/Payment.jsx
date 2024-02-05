import { Stack, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { SvgIcon } from "@mui/material";
import image from "../../../util/Avater";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import CancelIcon from '@mui/icons-material/Cancel';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
export default function Payment({ Payment,Notificate }) {
  const [option, setOption] = useState(false);
  const navigator = useNavigate()
  const [selectPlan, setPlan] = useState("");
 useEffect(() =>{setPlan('')},[Payment])

 const handleSubmit =(plan) =>{

  fetch("/api/user/sendPlan",{
    method:'POST',
    headers: {
        "Content-type": "application/json",
      },
      body:JSON.stringify({plan})
})
.then((res) => res.json())
.then((data) =>{
    if(data.status == 'success') return navigator('/checkout')
    if(data.status == 'error') {   
      Notificate(data.status,data.message)
  
    }
})
 }
  return (
    <Stack
      sx={{
        minHeight: "80vh",
        background:
          option == false
            ? " rgba(2, 201, 79, 0.10) "
            : "rgba(243, 59, 18, 0.10)",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          height: "100px",
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          padding={"20px"}
          sx={{
            width: "80%",
            height: "80%",
            background: "white",
            borderRadius: "6px",
          }}
        >
          <Button
            style={{
              width: "170px",
              height: "38px",
              borderRadius: " 7px",
              border: option == false ? "1px solid #02C94F" : undefined,
              color: "green",
              background: option == false ? "rgba(2, 201, 79, 0.10)" : "white",
            }}
            onClick={() => setOption(false)}
          >
            Free
          </Button>
          <Button
            style={{
              width: "170px",
              height: "38px",
              borderRadius: " 7px",
              border: option == true ? "1px solid #F33B12" : undefined,
              color: "red",
              background: option == true ? "rgba(243, 59, 18, 0.10)" : "white",
            }}
            onClick={() => setOption(true)}
          >
            Pro
          </Button>
        </Stack>
      </Stack>
      {option == false ? (
        <Free setOption={setOption} />
      ) : (
        <Pro setOption={setOption} />
      )}
      {option === true ? (
        <div
          style={{
            marginTop: "auto",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "10px",
            }}
          >
            <div>
              <p style={{ fontSize: "18px", fontWeight: "600" }}>Get At</p>
              {selectPlan == "" ? (
                <p style={{ color: "#187163", fontSize: "16px" }}>₹_/-</p>
              ) : (
                <p style={{ color: "#187163", fontSize: "16px" }}>
                  ₹{selectPlan.amount}/-
                </p>
              )}
            </div>
            <MySelect Payment={Payment} setPlan={setPlan} />
          </div>

          <Button
            style={{
              borderRadius: " 5px",
              background: "#FEA800",
              color: "white",
              width: "80%",
            }}
            onClick={() => {
             
                if(selectPlan == '') Notificate('info',"Plese select Package")
                else handleSubmit(selectPlan)
            }}
          >
            Proceed to Pay
          </Button>
        </div>
      ) : null}
    </Stack>
  );
}

const MySelect = ({ Payment, setPlan }) => {
  const Pakage = ["3 Month Package", "6 Month Package", "12 Month Package"];
  const [value, setValue] = useState("");
useEffect(() =>{setValue('')},[Payment])
  return (
    <FormControl sx={{ width: "180px" }}>
      <InputLabel id="my-select-label" sx={{ fontWeight: "700" }}>
        Select Package
      </InputLabel>
      <Select
        variant="outlined"
        label="Select Pakage"
        id="my-select"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        sx={{ fontWeight: "600" }}
      >
        {Payment.map((task, index) => (
          <MenuItem onClick={() => setPlan(task)} key={index} value={task}>
            {task.month} Month Package{" "}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

function Free() {
  const style = {
    letter: {
      fontSize: "14px",
      fontWeight: "500",
    },
  };
  return (
    <Stack sx={{ padding: "40px" }} direction={"column"} gap={"20px"}>
      <Stack direction={"row"} gap={"10px"}>
        <SvgIcon
          sx={{ color: "#02C94F", width: "20px", height: "20px" }}
          component={CheckCircleIcon}
        />
        <p>2 Practice tests</p>
      </Stack>

      <Stack direction={"row"} gap={"10px"}>
        <SvgIcon
          sx={{ color: "#02C94F", width: "20px", height: "20px" }}
          component={CheckCircleIcon}
        />
         <p>1 Mock Test </p>
      </Stack>

      <Stack direction={"row"} gap={"10px"}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "20px",
          }}
        >
          <SvgIcon
            sx={{ color: "red", width: "20px", height: "20px" }}
            component={CancelIcon}
          />
        </div>
        <p>1-1 Mentorship</p>
      </Stack>
      <Stack direction={"row"} gap={"10px"}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "20px",
          }}
        >
         <SvgIcon
            sx={{ color: "red", width: "20px", height: "20px" }}
            component={CancelIcon}
          />
        </div>
        <p>Course materials in PDF</p>
      </Stack>
      <Stack direction={"row"} gap={"10px"}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "20px",
          }}
        >
         <SvgIcon
            sx={{ color: "red", width: "20px", height: "20px" }}
            component={CancelIcon}
          />
        </div>
        <p> Self Assesment</p>
      </Stack>
      <Stack direction={"row"} gap={"10px"}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "20px",
          }}
        >
         <SvgIcon
            sx={{ color: "red", width: "20px", height: "20px" }}
            component={CancelIcon}
          />
        </div>
        <p> Report and marksheets</p>
      </Stack>
    </Stack>
  );
}

function Pro() {
  return (
    <Stack sx={{ padding: "40px" }} direction={"column"} gap={"20px"}>
      <Stack direction={"row"} gap={"10px"}>
        <SvgIcon
          sx={{ color: "#02C94F", width: "20px", height: "20px" }}
          component={CheckCircleIcon}
        />
        <p>Unlimited Practice Test</p>
      </Stack>

      <Stack direction={"row"} gap={"10px"}>
        <SvgIcon
          sx={{ color: "#02C94F", width: "20px", height: "20px" }}
          component={CheckCircleIcon}
        />
        <p>Unlimited Mock Test </p>
      </Stack>

      <Stack direction={"row"} gap={"10px"}>
        <SvgIcon
          sx={{ color: "#02C94F", width: "20px", height: "20px" }}
          component={CheckCircleIcon}
        />
        <p>1-1 Mentorship</p>
      </Stack>
      <Stack direction={"row"} gap={"10px"}>
        <SvgIcon
          sx={{ color: "#02C94F", width: "20px", height: "20px" }}
          component={CheckCircleIcon}
        />
        <p>Course materials in PDF</p>
      </Stack>
      <Stack direction={"row"} gap={"10px"}>
        <SvgIcon
          sx={{ color: "#02C94F", width: "20px", height: "20px" }}
          component={CheckCircleIcon}
        />
        <p> Self Assesment</p>
      </Stack>
      <Stack direction={"row"} gap={"10px"}>
        <SvgIcon
          sx={{ color: "#02C94F", width: "20px", height: "20px" }}
          component={CheckCircleIcon}
        />
        <p> Report and marksheets</p>
      </Stack>
    </Stack>
  );
}
