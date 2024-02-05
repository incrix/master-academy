import { useEffect, useState } from "react";
import { Stack, SvgIcon, Button } from "@mui/material";
import image from "../../../util/Avater";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from '@mui/icons-material/Cancel';
import Header from "../../exam/pages/components/ExamHeader";
import Notification from "../../../util/Alert";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../../util/useWindowDimensions";
import Footer from "../../../util/Footer";
import { callProfileUrl } from "../../../util/callImageUrl";
export default function DTPayment() {
  const {width} = useWindowDimensions()
  const navigator = useNavigate();
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [notificate, setNotification] = useState(false);
  const [plan, setplan] = useState("");
  const [user, setuser] = useState("");
  const [payment, setPayment] = useState([]);
  const [selectPlan, setSelect] = useState(false);
  useEffect(() => {
    fetch("/api/user/getPlan")
      .then((res) => res.json())
      .then((data) => {
        if (data.plan == "not choose yet") return navigator("/");
        setPayment(data.Payment);
        setplan(data.Payment[0])
      });
    fetch("/api/user/getUserDetails")
      .then((res) => res.json())
      .then(async (data) => {
        data.avatar = await callProfileUrl(data.avatar)
        setuser(data)
      });
  }, []);
  const handleSubmit = () =>{
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
            setSeverity(data.status)
            setMessage(data.message)
            setNotification(true)
        }
    })
  }
  const disableTextSelection = {
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    width: "100%",
    height: "100vh",
    overFlow: "hidden",
    background: "#C5CFD3",
  };
  return (
    user !== "" && (
      <Stack
        style={{
          ...disableTextSelection,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack

        style={{
          width :  width < 890 ?  '100%' : "80%"  ,
          height:"100%",
          display:"flex",
          padding:width < 850 ?  '30px' : "40px", 
          flexDirection:"column",
          gap:"20px"
        }}
         
        //  width='100%'
       
        >
          <Header user={user} />
          <Stack
            // height="820px"
            height={'600px'}
            backgroundColor='white'
            width={"100%"}
            borderRadius="11px"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <Stack
              width= {width > 700 ? "90%" : "100%" }
              height="100%"
              padding="10px"
              justifyContent="flex-start"
              alignItems="center"
              gap={"20px"}
              flexDirection="column"
            >
              <p
                style={{
                  fontSize: "20px",
                  fontSize: "25px",
                  fontWeight: 700,
                  color: " #187163",
                }}
              >
                Subscription
              </p>
              <Stack
                display="flex"
                width="100%"
                height="100%"
              
                flexDirection='column'
                justifyContent="center"
                alignItems="center"
               
              >
                <Stack direction='row' justifyContent="center"  alignItems="center" gap='30px' width='100%' >
                <div
                  style={{
                    width: width > 1000 ?  "40%" : "60%",
                    padding:'20px',
                    marginBottom:'10px',
                    borderRadius: "11px",
                    backgroundColor:
                      selectPlan == false ? "rgba(2, 201, 79, 0.10)" : "white",
                    cursor: "pointer",
                    boxShadow: " 0px 4px 11px 4px rgba(111, 111, 111, 0.15)",
                  }}
                  onClick={() => setSelect(false)}
                >
                  <Free />
                </div>
                <div
                  style={{
                    width: width > 1000 ? "40%" : "60%",
                    marginBottom:'10px',
                   padding:'20px',
                    borderRadius: "11px",
                    backgroundColor:
                      selectPlan == true ? "rgba(243, 59, 18, 0.10)" : "white",
                    cursor: "pointer",
                    boxShadow: " 0px 4px 11px 4px rgba(111, 111, 111, 0.15)",
                  }}
                  onClick={() => setSelect(true)}
                >
                  <Pro />
                </div>

                </Stack>
                {selectPlan == true ? 
              <Stack
                direction="row"
                marginTop='auto'
                justifyContent="space-between"
                alignItems="center"
                padding="20px"
                width= {width > 1000 ? "90%" : "100%"}
                border='4px'
                boxShadow='0px 4px 11px 4px rgba(111, 111, 111, 0.15)'
              >
                <Stack width="55%" direction="column" gap="10px">
                  <p style={{color:'#187163',fontSize:'18px',fontWeight:700}}>Duration</p>
                  <Stack direction="row" gap="20px" minWidth="70%">
                    {payment.map((task) => (
                      <div
                        style={{
                          width: "100px",
                          height: "44px",
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                          border:
                            plan.month == task.month
                              ? "2px solid #FEA800"
                              : "1.5px solid #187163",
                          backgroundColor: plan.month == task.month ?"rgba(254, 168, 0, 0.10)":'white',

                          borderRadius: "5px",
                        }}
                        onClick={() => setplan(task)}
                      >
                        <p
                          style={{
                            color:
                              plan.month == task.month ? "#FEA800" : "#187163",
                          }}
                        >
                          {task.month} Months
                        </p>
                      </div>
                    ))}
                  </Stack>
                </Stack>
                <Stack direction="column" gap="10px">
                  <p style={{color:'#187163',fontSize:'18px',fontWeight:700}}>Subscribe at</p>
                  <Button
                    style={{
                      width: "210px",
                      height: "45px",
                      borderRadius: "5px",
                      background: " #187163",
                      boxShadow: " 0px 4px 4px 0px rgba(0, 0, 0, 0.15)",
                      fontSize: " 20px",
                      fontWeight: 700,
                      color: "white",
                    }}
                    onClick={()=>{
                        if(plan !== '') handleSubmit()
                    }}
                  >
                    ₹{plan.amount}
                  </Button>
                </Stack>
              </Stack>
              :   <Stack
              marginTop='auto'
              direction="row"
              justifyContent="center"
              alignItems="center"
              padding="30px"
              height={'120px'}
              width={width > 1000 ? "90%" : "100%"}
              border='4px'
              boxShadow='0px 4px 11px 4px rgba(111, 111, 111, 0.15)'
            >
               <p style={{color:'#187163',fontSize:'18px',fontWeight:700}}>
               Your current Plan
                </p> 
                </Stack>}
              </Stack>
         
            </Stack>
          </Stack>
          <Stack marginTop='auto'>
          <Footer />
          </Stack>
       
        </Stack>
        <Notification
        setNotification={setNotification}
        notificate={notificate}
        message={message}
        severity={severity}
      />
      </Stack>
    )
  );
}

function Free() {
  const style = {
    letter: {
      fontSize: "14px",
      fontWeight: "500",
    },
  };
  return (
    <Stack
      direction={"column"}
      alignItems="center"
      justifyContent={"center"}
      gap={"20px"}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
         
          marginBottom: "auto",
          alignItems: "center",
        }}
      >
        <img src={image.Free} alt="" />
        <p> Free</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
      </div>
    </Stack>
  );
}

function Pro() {
  return (
    <Stack
      direction={"column"}
      alignItems="center"
      justifyContent={"center"}
      gap={"20px"}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "auto",
          alignItems: "center",
        }}
      >
        <img src={image.Red} alt="" />
        <p> Pro</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
          <p>Unlimited Mock Test</p>
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
      </div>
    </Stack>
  );
}
