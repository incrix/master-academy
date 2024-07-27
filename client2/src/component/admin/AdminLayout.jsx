import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CreateQuestionBank from "./questionBank/CreateQuestionBank";
import CreateCourses from "./courses/components/CreateCourses";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Notification from "../../util/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Layout from "../../app/admin/newLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import avatar from "../../util/Avater";
import SvgIcon from '@mui/material/SvgIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import  {callProfileUrl}  from "../../util/callImageUrl";
import Loader from "../../util/Loader";
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function AsaidMenu() {
  const theme = useTheme();

  const navigator = useNavigate();
  const pathName = window.location.pathname;
  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [isCall, setCall] = useState(false);
  const [isLoading,setLoading] = useState(false)
  const [notificate, setNotification] = useState(false);
  const openNav = Boolean(anchorEl);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    fetch("/logout")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "logout") navigator("/login");
      });
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setLoading(true)
    fetch("/api/admin/getUserDetails")
      .then((res) => res.json())
      .then( async (data) => {
       data.avatar = await callProfileUrl(data.avatar)
       data.name = data.name.length > 7 ? `${data.name.slice('0','5')}...` : data.name
        setUser(data);
        setLoading(false)
      });
  }, []);

  const createBank = (data) => {
    if (data !== "") {
      fetch("/api/admin/createBank", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title: data }),
      })
        .then((res) => res.json())
        .then((data) => {
          setMessage(data.message);
          setSeverity(data.status);
          setNotification(true);
          if (data.status === "success") setCall(!isCall);
        });
    } else {
      setMessage("Please enter bank name");
      setSeverity("warning");
      setNotification(true);
    }
  };

  const createCourse = (data) => {
    fetch("/api/admin/createCourse", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ title: data }),
    })
      .then((res) => res.json())
      .then((data) => {
     
        setMessage(data.message);
        setSeverity(data.status);
        setNotification(true);

        if (data.status == "success") setCall(!isCall);
      });
  };
  const style = {
    footer: {
      color: "#FEA800",
      fontFamily: "DM Sans",
      fontSize:"16px",
      fontWeight: "500",
    },
  };
  return (
    isLoading ? <Loader /> :
     <Box sx={{ display: "flex" }} >
      <Notification
        setNotification={setNotification}
        notificate={notificate}
        message={message}
        severity={severity}
      />
      <CssBaseline />
      <AppBar position="fixed" open={open} elevation={1}  >
        <Toolbar sx={{ background: "white" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,

              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon sx={{ color: "black" }} />
          </IconButton>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <img src={avatar.LOGO} alt="" />
              <h1
                style={{
                  fontSize: "16px",
                  color: "#FEA800",
                }}
              >
                <font color="#187163">The</font> Masters Academy
              </h1>
            </div>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              {pathName === "/admin/dashboard" ? (
                <CreateCourses createBank={createCourse} />
              ) : null}
              {pathName === "/admin/bank" ? (
                <CreateQuestionBank createBank={createBank} />
              ) : null}

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
                  marginLeft: "auto",
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
              <Menu anchorEl={anchorEl} open={openNav} onClose={handleClose}>
                <MenuItem
                  onClick={handleClose}
                  sx={{ display: "flex", gap: "10px" }}
                >
                  <Avatar src={user.avatar} />
                  {user.name}
 
                </MenuItem>

                <MenuItem onClick={handleLogout}>

                <div style={{display:'flex',alignItems:'center',gap:'20px',justifyContent:'center',width:'100%'}} >
                <SvgIcon sx={{color:'#187163'}}  component={LogoutIcon} >
                 
                 </SvgIcon> 
               <p >Logout </p>{" "}
                </div>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} direction={'column'}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            "Course",
            "Question Bank",
            "Manage User",
            "Analytics",
            "Institution",
          ].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
              
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={() => {
                  if (text == "Course") navigator("/admin/dashboard");
                  if (text == "Question Bank") navigator("/admin/bank");
                  if (text == "Manage User") navigator("/admin/manage");
                  if (text == "Analytics") navigator("/admin/analytics");
                  if (text == "Institution") navigator("/admin/institution");
                  handleDrawerClose()
                }}
                onMouseEnter={handleDrawerOpen}
                
              >
                <ListItemIcon
                 onClick={handleDrawerClose}
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    padding:"10px",
                    justifyContent: "center",
                  }}
                >
                  {index ==  0 ? <MenuBookIcon
              sx={{
                fontSize: 28,
                color:  index == 0 && pathName.split('/')[2] == "dashboard"? 
                "#FEA800"
                :"#187163"
              }}
            /> : null}
               {index ==  1 ?  <InsertDriveFileIcon 
              sx={{
                color:  index == 1 && pathName.split('/')[2] == "bank"? "#FEA800"
                : "#187163",
                fontSize: 28,
              }}
            /> : null}
             {index ==  2 ?  <GroupsIcon 
              sx={{
                color:  index == 2 && pathName.split('/')[2] == "manage"? "#FEA800"
                : "#187163",
                fontSize: 28,
              }}
            /> : null}
              
              {index ==  3 ?  <InsertChartRoundedIcon 
              sx={{
                color:  index == 3 && pathName.split('/')[2] == "analytics"? "#FEA800"
                : "#187163",
                fontSize: 28,
              }}
            /> : null}
               {index ==  4 ?  <AccountBalanceIcon 
              sx={{
                color:  index == 4 && pathName.split('/')[2] == "institution"? "#FEA800"
                : "#187163",
                fontSize: 28,
              }}
            /> : null}

                </ListItemIcon>
                <ListItemText
                  primary={text}
                    onClick={handleDrawerClose}
                  sx={{
                    color:
                      (index == 0 && pathName.split('/')[2] =="dashboard") ||
                      (index == 1 && pathName.split('/')[2]== "bank") ||
                      (index == 2 && pathName.split('/')[2]== "manage") ||
                      (index == 3 && pathName.split('/')[2]== "analytics") ||
                      index == 4 && pathName.split('/')[2]== "institution"
                        ? "#FEA800"
                        :"#187163",
                    opacity: open ? 1 : 0,
                    fontSize: "18px",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider />
        <div style={{marginTop:"auto",display:'flex',flexDirection:'row',justifyContent:'center',marginRight:'10px',padding:'5px'}}>
          {open == false ? null : 
        <p style={style.footer}>
          <font color="#187163"> Designed </font> by incrix
        </p>
}
        </div>
         
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1,marginTop: "30px", p: open == false ? 1 : 2 }}
      >
      <Typography > 
          <Layout
            menu={open}
            isCall={isCall}
            handleDrawerClose={handleDrawerClose}
          />
    </Typography> 
      </Box>
    </Box>
  );
}
