import React, { useState } from "react";
import QuestionBank from "./QuestionBanks/Page";
import Courses from "./Courses/Page";
import Course from "../../component/admin/courses/Course";
import Manage from "./ManageUser/Page";
import Institution from "./Institution/Page";
import Analytics from "./Analytics/Page";
import Collection from "../../component/admin/questionBank/Collection";
import { useEffect } from "react";
import useWindowDimensions from "../../util/useWindowDimensions";
import Display from "../../util/display";
import Notification from "../../util/Alert";
import BatchFolder from "../../component/admin/institution/components/BatchFolder";
import { useNavigate } from "react-router-dom";
import  '../../App.css'
import InstitutePage from "../../component/admin/institution/components/institutePage";
import Loader from '../../util/Loader'

function Dashboard({menu,isCall,handleDrawerClose}) {
  const navigator = useNavigate();
  const pathName = window.location.pathname;
  const { width } = useWindowDimensions();
  const [isNotify, setNotify] = useState(false);
  const [bank, setBank] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
const [isloading,setLoading] = useState(false)
  const [notificate, setNotification] = useState(false);

  useEffect(() => {
    getCourse()
    getBank()
  }, [isNotify,isCall,notificate])

  useEffect(() => {
  
    fetch("/isLogin")
    .then((res) => res.json())
    .then((data) => {
      if (data.status == "isLogout") navigator("/login");
      if (data.status == "isExam" ) navigator(`/exam/state?=${data.examID}`)
      if (data.status == "isLogin" && data.roll == "student")
      navigator(`/?=${data.id}`);
    if (
      (data.status == "isLogin" && data.roll == "admin") ||
      (data.status == "isLogin" && data.roll == "teacher") ||
      (data.status == "isLogin" && data.roll == "institution")
    )
 {   if(data.roll == "teacher" || data.roll == "institution") return navigator(`/institution?=${data.institutionID}`)
   
  return navigator(`/admin/dashboard?=${data.id}`);}
    });
    
  }, []);

  
  const getBank = () => {
   
    fetch("/api/admin/getBank")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setBank(data.message);
        }
      });
  };

  const getCourse = () => {
    setLoading(true)
    fetch("/api/admin/getCourse")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setCourseList(data.message);
          setLoading(false)
        }
      });
  };

  const ControlNotification = (status, message) => {
    setMessage(message);
    setSeverity(status);
    setNotification(true);
  };
  
  const styles = {
    navbar: {
      display: "flex",
      gap: "20px",
      width: "100%",
      height: "70px",
      alignItems: "center",
      justifyContent: "space-between",
    },
    navChild: {
      marginLeft: "auto",
      display: "flex",
      gap: "20px",
    },
  };

  return (
    <div
      style={{
        // display: "flex",
        marginTop:'30px',
        position: "fixed",
        width: menu == false ? `${width -80}px` : `${width - 260}px`,
        height: "90vh",
        overflow: "hidden",
    //    padding:'20px'
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
          width: "100%",
          height: "calc(100vh - 70px)",
          // padding: "0 30px",
  
        }}
        onMouseLeave={handleDrawerClose}
      >
          <div style={{ width: "calc(100%-104px)", padding:"20px" }} onMouseLeave={handleDrawerClose}>
            {pathName === "/admin/dashboard" ? (
              isloading ? <Loader /> :
              <Courses
                courseList={courseList}
                isNotify={isNotify}
                setNotify={setNotify}
              />
            ) : null}
            {pathName === "/admin/bank" ? <QuestionBank bank={bank} /> : null}
            {pathName === "/admin/analytics" ?  width > 700 ?  <Analytics /> : <Display /> : null}
            {
            pathName === "/admin/institution" ? (
              
              <Institution ControlNotification={ControlNotification} />
          
               ) : null 
            }
            {pathName === "/admin/manage" ?  width > 700 ?  <Manage /> : <Display /> : null}
            {pathName === "/admin/dashboard/course" ? (
              <Course
                ControlNotification={ControlNotification}
                isNotify={isNotify}
                setNotify={setNotify}
              />
            ) : null}
            {pathName === "/admin/bank/collection" ? (
              width > 700 ? (
                <Collection />
              ) : (
                <Display />
              )
            ) : null}

            {pathName === "/admin/institution/page" ? (
              <InstitutePage ControlNotification={ControlNotification} />
            ) : null}

            {pathName === "/admin/institution/page/batch" ? (
              <BatchFolder />
            ) : null}
          </div>
        </div>
    </div>
  );
}

export default Dashboard;

