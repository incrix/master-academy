import React, { useState } from "react";

import Avatar from "@mui/material/Avatar";

import Page from "./User/Page";
import { Button, Menu, MenuItem } from "@mui/material";
import Image from "../../util/Avater";
import Footer from "../../util/Footer";
import { useEffect } from "react";
import useWindowDimensions from "../../util/useWindowDimensions";
import Display from "../../util/display";
import Notification from "../../util/Alert";
import BatchFolder from "./User/components/BatchFolder";
import { useNavigate } from "react-router-dom";
import SvgIcon from '@mui/material/SvgIcon';
import {callProfileUrl} from '../../util/callImageUrl'
import LogoutIcon from '@mui/icons-material/Logout';
import "../../App.css";
import Loader from "../../util/Loader";

function Dashboard() {
  const navigator = useNavigate();
  const pathName = window.location.pathname;
  const { width } = useWindowDimensions();
  const [isNotify, setNotify] = useState(false);
  const [bank, setBank] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState([]);
  const [notificate, setNotification] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [isPageLoading,setIsPageLoading] = useState(false)
  const openNav = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /// useEffect

  useEffect(() => {
    setIsPageLoading(true)
    fetch("/isLogin")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "isLogout") navigator("/login");
      });
    fetch("/api/institution/getUserDetails")
      .then((res) => res.json())
      .then( async(data) => {
        data.avatar = await callProfileUrl(data.avatar)
        data.name = data.name.length > 7 ? `${data.name.slice('0','5')}...` : data.name
        setIsPageLoading(false)
        setUser(data);
      });
  }, []);

  const ControlNotification = (status, message) => {
    setMessage(message);
    setSeverity(status);
    setNotification(true);
  };
  const handleLogout = () => {
    fetch("/logout")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "logout") navigator("/login");
      });
  };
  const styles = {
    navbar: {
      display: "flex",
      gap: "20px",
      width: "100%",
      height: "70px",
    },
    navChild: {
      marginLeft: "auto",
      display: "flex",
      gap: "20px",
    },
  };

  return (
    isPageLoading ? <Loader /> :
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100vh",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",

        padding: "20px",
      }}
    >
      <Notification
        setNotification={setNotification}
        notificate={notificate}
        message={message}
        severity={severity}
      />
      <div
        style={{
          // width: "calc(100% - 280px)",
          width: "calc(100%)",
          height: "calc(100vh - 70px)",
          // padding: "0 30px",
        }}
      >
        <div style={styles.navbar}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img src={Image.LOGO} alt="" />
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
              display: "flex",
              marginLeft: "auto",
              alignItems: "center",
              gap: "20px",
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

              <MenuItem onClick={handleLogout} >
                <div style={{display:'flex',alignItems:'center',gap:'20px',justifyContent:'center',width:'100%'}} >
                <SvgIcon  sx={{color:'#187163'}}   component={LogoutIcon} >
                 
                 </SvgIcon> 
               <p >Logout </p>{" "}
                </div>
               
              </MenuItem>
            </Menu>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {width > 600 ? (
            <div style={{ width: "100%" }}>
              {pathName === "/institution" ? (
                <Page ControlNotification={ControlNotification} />
              ) : null}

              {pathName === "/institution/batch" ? <BatchFolder /> : null}
            </div>
          ) : (
            <Display />
          )}
        </div>
      </div>
      <div style={{ marginTop: "auto" }}>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
