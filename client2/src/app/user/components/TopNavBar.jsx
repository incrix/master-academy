import {
  Button,
  Stack,
  Paper,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import Avater from "../../../util/Avater";
import PlanChip from "./PlanChip";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SvgIcon from '@mui/material/SvgIcon';
import LogoutIcon from '@mui/icons-material/Logout';
export default function TopNavBar({user,goal}) {
  
 

  const navigete = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
   
    setAnchorEl(null);
  };
  const handleLogout = () =>{
    fetch('/logout')
    .then( res => res.json())
    .then(data =>{
      if(data.status == 'logout') navigete('/login')
    })
    
  }
  return (
    <Paper
      sx={{
        width: "100%",
        borderBottom: "1px solid #e0e0e0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        height:'80px',
        padding: "20px 30px",
        borderRadius: "20px",
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
      }}
    >
    
        <Stack direction="row" spacing={2} alignItems="center">
          <img src={Avater.LOGO} />
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            The <font color="#FEA800">Masters Academy</font>
          </h1>
        </Stack>
        <Stack direction="row" spacing={4} alignItems="center">

          {
            goal.plan == 'free' ?
          
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#187163",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#187163",
                color: "#fff",
              },
            }}
            onClick={()=> navigete('/plan')}
          >
            Upgrade to PRO
          </Button>
          :
          null
          
} 

          <PlanChip plan={goal.plan == 'free' ? 'Free' : goal.plan == 'pro' ? 'Pro' : goal.plan == 'standard' ? 'Standard' : null } />
          <Button
            d="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{
              borderRadius: "50%",
              padding: "0px",
              minWidth: "0px",
            }}
          >
            <Avatar
              sx={{
                width: "50px",
                height: "50px",
              }}
              src={user.avatar}
            />
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleClose} sx={{display:'flex',gap:'10px'}}>
              <Avatar src={user.avatar} />
                   {user.changeName}
            </MenuItem>
            
            <MenuItem onClick={handleLogout}>
            <div style={{display:'flex',alignItems:'center',gap:'20px',justifyContent:'center',width:'100%'}} >
                <SvgIcon sx={{color:'#187163'}}  component={LogoutIcon} >
                 
                 </SvgIcon> 
               <p >Logout </p>{" "}
                </div>
            </MenuItem>
          </Menu>
        </Stack>
    
    </Paper>
  );
}
