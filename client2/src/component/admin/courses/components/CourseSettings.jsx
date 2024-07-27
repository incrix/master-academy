import {
  TextField,
  OutlinedInput,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  SvgIcon,
} from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect, useState } from "react";
import RangeSlider from "./SlidePercentage";
import AddPayment from "./AddPayment";
export default function CourseSettings({
  courseSetting,
  setSetting,
  setPageController,
}) {
  useEffect(() => {
    setPageController({
      mockPage: false,
      courseSettingPage: true,
    });
  }, []);

  const CssTextField = {
    "& label.Mui-focused": {
      color: "#A0AAB4",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#E0E3E7",
      },
      "&:hover fieldset": {
        borderColor: "#B2BAC2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6F7E8C",
      },
    },
  };
  const styleSetting = {
    "& label.Mui-focused": {
      color: "#187163",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#187163",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#187163",
      },
      "&:hover fieldset": {
        borderColor: "#187163",
      },
      "&.Mui-focused fieldset": {
        borderColor: "187163",
      },
    },
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <div>
        <p style={{ padding: "10px", fontSize: "18px", fontWeight: "700" }}>
          Course Setting
        </p>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <TextField
            type="number"
            value={courseSetting.mark}
            onChange={(e) => {
              setSetting((preValue) => {
                const getValue = { ...preValue };
                getValue.mark = e.target.value;
                return getValue;
              });
            }}
            label="Mark per question"
            variant="outlined"
            sx={styleSetting}
          />

          <TextField
            type="number"
            value={courseSetting.negativeMark}
            onChange={(e) => {
              setSetting((preValue) => {
                const getValue = { ...preValue };
                getValue.negativeMark = e.target.value;
                return getValue;
              });
            }}
            sx={styleSetting}
            label="Negative Mark per question"
            variant="outlined"
          />

          <FormControl sx={styleSetting} variant="outlined">
            <InputLabel>Duration in mins</InputLabel>
            <OutlinedInput
              type="number"
              value={courseSetting.duration}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              }
              startAdornment={
                <InputAdornment position="start">
                  <IconButton edge="end">
                    <RemoveIcon />
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e) => {
                setSetting((preValue) => {
                  const getValue = { ...preValue };
                  getValue.duration = e.target.value;
                  return getValue;
                });
              }}
              label="Duration in mins"
            />
          </FormControl>
          <div>
            <label htmlFor="">Set the medium percentage</label>
            <RangeSlider
              setSetting={setSetting}
              courseSetting={courseSetting}
            />
          </div>
        </div>
      </div>
      <CoursePayment courseSetting={courseSetting} setSetting={setSetting} />
      <div></div>
    </div>
  );
}

function CoursePayment({ courseSetting, setSetting }) {
  const [over,setOver] = useState([])
 

  useEffect(()=>{

  },[courseSetting.Payment])
  const handleDelete =(task,index) =>{
    setOver((preValue) =>{
      let getValue = [preValue]
      getValue = getValue.filter(task => task== index)
      return getValue
    })
  
    const get= courseSetting.Payment.filter(data => data !== task )
    setSetting((preValue) =>{
      const getValue ={ ...preValue}
      getValue.Payment = get
      return getValue
    })
  }
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <p style={{ padding: "10px", fontSize: "18px", fontWeight: "700" }}>
          Course Payment
        </p>
        <AddPayment courseSetting={courseSetting} setSetting={setSetting} />
      </div>
      <div>
        {courseSetting.Payment.length > 0 ? (
          <div
            style={{
              display: "flex",
              gap: "30px",
              alignItems: "center",
              padding: "20px",
            }}
            
          >
            {courseSetting.Payment.map((task, index) => (
              <Paper
                key={index}
                sx={{
                  width: "2px",
                  display: "flex",
                  flexDirection: "column",
                  // alignItems:'center',
                  justifyContent:'space-between',
                  padding:'20px',
                  gap: "10px",
                  width:'145px',
                  height:'151px',
                  borderRadius:"30px",
                  boxShadow:"0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px -1px 4px 0px rgba(0, 0, 0, 0.15)",
                  position:'relative'
                }}
                onMouseLeave={()=>{
                  setOver((preValue) =>{
                    let getValue = [preValue]
                    getValue = getValue.filter(task => task== index)
                    return getValue
                  })
                }}
                onMouseOver={()=>{
                  setOver((preValue) =>{
                    let getValue = [preValue]
                     getValue.push(index)
                    return getValue
                  })
                }}
              >
                <p style={{fontSize:"18px",color:'#187163'}}>{task.month} Month</p>
                <p style={{fontSize:"22px",color:'#187163'}}>₹{task.amount}</p>
                <p style={{fontSize:"14px",color:'#FEA800'}}>Discount {task.discount}%</p>
                {
                   over.indexOf(index) !== -1 ? <SvgIcon sx={{
                    position:'absolute',
                    top:'10px',
                    right:'15px',
                    color:'#187163'
                  }} component={HighlightOffIcon}
                  onClick={()=>handleDelete(task,index)}
                  /> : null
                }

              </Paper>
            ))}
          </div>
        ) : (
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "200px",
              fontWeight: "400",
              fontSize: "20px",
              color: "gray",
            }}
          >
            No Active Course Payment
          </p>
        )}
      </div>
    </div>
  );
}
