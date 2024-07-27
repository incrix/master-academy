import { Paper, Stack, Avatar, Button } from "@mui/material";
import Avater from "../../../../util/Avater";
import {
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useWindowDimensions from "../../../../util/useWindowDimensions";
import SvgIcon from '@mui/material/SvgIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
export default function ExamHeader({ isMobileView ,user}) {

  const {width} =useWindowDimensions()
  const path = window.location.pathname;
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

  const handleHome = () =>{
    navigete(`/?=${user.id}`)
  }
  return (
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        height:  width < 500 ? '60px' : "70px" ,
        borderRadius: "20px",
        padding :  width < 500 ? '10px' : "15px" 
      }}
    >
  
      {path == '/checkout' && width < 652  ?  <Stack>
        <Stack direction='row' gap='10px' alignItems={'center'}>
          <SvgIcon onClick={()=> {
            if(width >  600) navigete(`/plan`)
            else navigete(`/?=${user.id}`)
            }} sx={{color:'#187163'}} component={KeyboardBackspaceIcon}/>
          <p style={{fontSize:'14px',fontWeight:'500'}}  >Checkout</p>
        </Stack>
      </Stack> :   <Stack direction="row" gap={isMobileView ? 1 : 2} alignItems="center">
          <img
            src={Avater.LOGO}
            alt="Avatar"
            width={isMobileView ? "40px" : "auto"}
          />
          <h1
            style={{
              fontWeight: "500",
              fontSize: width < 500 ? "15px" : "20px",
            }}
          >
            The <font color="#FEA800">Masters Academy</font>
          </h1>
        </Stack>
}
        {
  path == '/exam/state' ?  user && <Avatar
    sx={{
     width: width < 500 ? '40px' : "50px" ,
     height:  width < 500 ? '40px' : "50px" ,
   }}
 src={user.avatar}
/>
:
    path == '/policy' && !user ?  <Stack direction='row' gap='10px'>
      <Button style={{
        textTransform:'none',
        background:'#187163',
        color:'white',
        width: width > 652 ? '100px' : '50px'
      }}
      onClick={() => navigete('/login')}
      >
 Login
      </Button>
      <Button   style={{
        textTransform:'none',
        background:'#187163',
        color:'white',
        width: width > 652 ? '100px' : '50px'
      }}
      onClick={() => navigete('/signup')}
      >
   SignUp
      </Button>
    </Stack> :   
        <Avatar
          sx={{
            width: width < 500 ? '40px' : "50px" ,
            height:  width < 500 ? '40px' : "50px" ,
          }}
          
        >
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
          {user && <Avatar
                 sx={{
                  width: width < 500 ? '40px' : "50px" ,
                  height:  width < 500 ? '40px' : "50px" ,
                }}
              src={user.avatar}
            />}
          </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleHome}>
              {/* <Avatar src='' /> */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}} >
                <SvgIcon sx={{color:'#187163'}}  component={HomeIcon} >
                 
                 </SvgIcon> 
               <p >Home </p>{" "}
                </div>
            </MenuItem>
    
            <MenuItem onClick={handleLogout}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}} >
                <SvgIcon sx={{color:'#187163'}}  component={LogoutIcon} >
                 
                 </SvgIcon> 
               <p >Logout </p>{" "}
                </div>
            </MenuItem>
          </Menu>
        </Avatar>
}
    
    </Paper>
  );
}
