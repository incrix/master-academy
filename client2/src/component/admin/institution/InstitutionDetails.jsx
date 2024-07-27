import React from "react";
import { Button, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callInstitutionUrl } from "../../../util/callImageUrl";
const InstitutionDetails =  ({ task }) => {

  task.avatar = callInstitutionUrl()
  const navigator = useNavigate()
const RouteDirect = () =>{
  navigator(`/admin/institution/page?=${task.institutionID}`)
}
  const style = {
    image: {
      width: " 40px",
      height: " 40px",
      borderRadius:'30px'
    },
    name: {
      color: " #000",
      fontFamily: " DM Sans",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
    },
    email:{
      color: " #000",
      fontFamily: " DM Sans",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "normal",
    },
    viewBtn:{
     color:'white',
     borderRadius:' 4px',
background:' #187163',
width: '80px',
height: '34px',
textTransform:'none'
    }
  };
  return (
    <Paper sx={{ width: "100%", height: "80px", padding: "23px" }}>
      <Stack direction="row" alignItems="center" justifyContent='space-between' >
        <Stack direction="row" alignItems="center" spacing="20px">
          <img src={task.avatar} style={style.image} alt="" />
          <p style={style.name}>{task.name}</p>
        </Stack>
        <p style={style.email}>{task.email}</p>
        <Button onClick={RouteDirect} style={style.viewBtn}>View</Button>
      </Stack>
    </Paper>
  );
};

export default InstitutionDetails;
