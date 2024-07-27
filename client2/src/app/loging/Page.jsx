import React, { useEffect } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Image from "../../util/Avater";
import FirstPage from "./component/FirstPage";
import Verify from "./component/Verify";
import CreatePage from "./component/CreatePage";
import useWindowDimensions from "../../util/useWindowDimensions";
import ChooseGoal from "./component/ChooseGoal";
import Notification from "../../util/Alert";
import { useState } from "react";
import ForgotPass from './component/ForgotPass'
import Login from "./component/login";
function Page() {
  const pathName = window.location.pathname;
  const { width } = useWindowDimensions();
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [notificate, setNotification] = useState(false);
  const [state,setState] = useState(false)

  const controlNotification = (status, message) => {
    setMessage(message);
    setSeverity(status);
    setNotification(true);
  };


  useEffect(()=>{
    fetch("/isCheck")
      .then((res) => res.json())
      .then((data) => {
  
        if (data.status == "isLogout") setState(true) 
      });
  },[])

  return (
    <div style={{ background: " #187163" }}>
      <Notification
        setNotification={setNotification}
        notificate={notificate}
        message={message}
        severity={severity}
      />
      <Stack
        
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100vh"
      >
        {width > 1000 ?  
        <Paper sx={{ background: "#FFF", width: "80%", height: "90%" }}>
          <Stack
            sx={{ background: "#FFF" }}
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Stack
              direction="row"
              spacing="60px"
              width="80%"
             
              justifyContent="center"
              padding="20px"
            >
              {width > 1000 ? (
                <Stack
                  width="423px"
                  height="443px"
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <img
                    src={Image.loginWalpaper}
                    style={{ width: "100%" }}
                    alt=""
                  />
                  <p
                    style={{
                      color: "#187163",
                      textAlign: " center",
                      fontFamily: " DM Sans",
                      fontSize: "14px",
                      fontStyle: " normal",
                      fontWeight: "700",
                      lineHeight: "normal",
                    }}
                  >
                    Prepare for success - Ace placements and bank exams with The
                    Masters Academy. Unlock your potential now!
                  </p>
                </Stack>
              ) : null}

              {pathName == "/signup" ? (
                <FirstPage controlNotification={controlNotification} />
              ) : null}
              {pathName == "/login/verify" ? (
                <Verify controlNotification={controlNotification} />
              ) : null}
              {pathName == "/login/create" ? (
                <CreatePage controlNotification={controlNotification} />
              ) : null}
              {pathName == "/login/goal" ? (
                <ChooseGoal
                  controlNotification={controlNotification}
                  
                />
              ) : null}

{pathName == "/forgotPass" ? (
          <ForgotPass controlNotification={controlNotification} />
        ) : null }
                  {pathName == "/login" ? (

                <Login
                  controlNotification={controlNotification}
                  
                />
              ) : null}
            </Stack>
          </Stack>
        </Paper>

        :        
        pathName == "/login" ? (
                 
          <Login
            controlNotification={controlNotification}
            
          />
        ) : 
        pathName == "/login/goal" ? (
          <ChooseGoal
            controlNotification={controlNotification}
            
          />
        ) : 
        pathName == "/signup" ? (
         
          <FirstPage controlNotification={controlNotification} />
      
        ) : 
        pathName == "/forgotPass" ? (
          <ForgotPass controlNotification={controlNotification} />
        )      
        :
        pathName == "/login/verify" ? (
          <Verify controlNotification={controlNotification} />
        ) :
        pathName == "/login/create" ? (
          <CreatePage controlNotification={controlNotification} />
        ) : null}
      </Stack>
    </div>
  );
}

export default Page;
