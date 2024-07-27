import { Stack, Avatar, Button, SwipeableDrawer, Divider, Menu, MenuItem } from "@mui/material";
import Avater from "../../../util/Avater";
import PlanChip from "./PlanChip";
import { useEffect, useState } from "react";
import { ExpandMore } from "@mui/icons-material";
import AddGoal from "./AddGoal";
import { useNavigate } from "react-router-dom";
import SvgIcon from '@mui/material/SvgIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import useWindowDimensions from "../../../util/useWindowDimensions";
export default function MDNavBar({user,selectGoal,setSelectGoal,goal,isChange,addGoal,setGoalId,id}) {
  const [open, setOpen] = useState(false);
  const {width} = useWindowDimensions()
  const navigete = useNavigate()
  const toggleDrawer = (open) => (event) => {
    setOpen(open);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const openNav = Boolean(anchorEl);
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
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={"space-between"}
      sx={{
        width: "100%",
        padding: "20px",
      }}
    >
      <Button
        onClick={toggleDrawer(true)}
        sx={{
          textTransform: "none",
          color: "black",
          "&.Mui-selected": {
            color: "#FEA800",
          },
          padding: "0px",
          minWidth: "0px",
          width: "fit-content",
          margin: "0px",
        }}
      >
        <Stack direction="row" alignItems="center">
          <img src={Avater.FileImage} />
          <h1
            style={{
              fontSize: "18px",
              marginLeft: "10px",
              fontWeight: "500",
            }}
          >
           {selectGoal.courseName}
          </h1>
          <ExpandMore sx={{ marginLeft: "10px" }} />
        </Stack>
      </Button>
  
  <Stack direction='row' alignItems='center' gap='20px' >
 
 { width > 600   ? selectGoal.plan == 'free' ?  <Button
            variant="contained"
            sx={{
              height:'35px',
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
          </Button> :null : null }
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
          </Stack>
          <Menu anchorEl={anchorEl} open={openNav} onClose={handleClose}>
            <MenuItem onClick={handleClose}>
              <Avatar src={user.avatar} />
                   {user.changeName}
            </MenuItem>
            
            <MenuItem onClick={handleLogout}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}} >
                <SvgIcon sx={{color:'#187163'}}  component={LogoutIcon} >
                 
                 </SvgIcon> 
               <p >Logout </p>{" "}
                </div>
            </MenuItem>
          </Menu>
      <SwipeableDrawer
        anchor={"bottom"}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
            borderRadius: "20px 20px 0px 0px",
            borderTop: "1px solid #E5E5E5",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          },
        }}
      >
        <Stack width="100%" >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "500",
              padding: "30px 20px",
              textAlign: "center",
            }}
          >
            My Goals
          </h1>
          <Divider />
          {goal.map((item, index) => (
            <div key={index} onClick={() => {
              setGoalId(item) 
              setOpen(false)
              
            }
            }>
              <GoalListCard key={index} goal={item.courseName} plan={item.coursePlan} />
              <Divider />
            </div>
          ))}
          <Stack direction="column" width={"100%"} alignItems="center" margin={"20px 0"}>
            
            <AddGoal isChange={isChange}  addGoal={addGoal} id={id} />
         
          </Stack>
        </Stack>
      </SwipeableDrawer>
    </Stack>
  );
}

function GoalListCard({ goal, plan, onClick }) {
  return (
    <Button
      onClick={onClick}
      sx={{
        width: "100%",
        color: "#000",
        textTransform: "none",
        padding: "10px 20px",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" width={"100%"} onClick={()=>{
     
      }} >
        <img src={Avater.FileImage} />
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {goal}
        </h3>
      </Stack>
      <PlanChip plan={plan == 'free' ? 'Free' : plan == 'pro' ? 'Pro' : plan == 'standard' ? 'Standard' : null } />
    </Button>
  );
}
