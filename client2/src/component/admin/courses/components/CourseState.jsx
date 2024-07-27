import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CourseDetails from "./CourseDetails";
import CourseSettings from "./CourseSettings";
import MockTest from "./MockTest";
import Notificate from '../../../../util/Alert'
import { useLocation } from "react-router-dom";
function CustomTabPanel(props) {

  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <>{children}</>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    sx: {
      textTransform: "none",
      color: "black",
      "&.Mui-selected": {
        color: "#FEA800",
      },
    },
  };
}


export default function BasicTabs({setDetails,collectDetails,setPageController,setMock,setNotify,isNotify}) {

  const { search } = useLocation();
  const id = search.split("?")[1];
  const [value, setValue] = useState(0);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [notificate, setNotification] = useState(false);
  const [ course,setCourse] = useState([])
  const [ courseAvalile,setCourseAvalible] = useState([])
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const Notification =(status,message) =>{
    setSeverity(status)
    setMessage(message)
    setNotification(true)
  }
 
const getMockTest = () =>{
  fetch("/api/admin/getCourseAvalible", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status == "ok") {
     
      if(data.courseSetting[0].Payment == undefined) setDetails({...data.courseSetting[0],Payment:[]})
      else
      {
         setDetails(data.courseSetting[0])

        
        }
         setCourse(data.courseDetails)
         setCourseAvalible(data.message)
      }
    });
}
useEffect(()=>{
 
  getMockTest()
  
},[notificate])


  return (
    <Paper
      sx={{
        width: "100%",
        height: "calc(100vh - 180px)",
        padding: "0 20px",
        margin: "20px 0",
        overflowY:"scroll",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#FEA800",
            },
          }}
        >
          <Tab label="Course Details" {...a11yProps(0)} />
          <Tab label="Settings" {...a11yProps(1)} />
          <Tab label="Mock Test" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CourseDetails Notificate={Notification} isNotify={isNotify} setNotify={setNotify} notificate={notificate} setPageController={setPageController} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {collectDetails.length !== 0 ?  <CourseSettings setSetting={setDetails} courseSetting={collectDetails} setPageController={setPageController} /> : null }

      </CustomTabPanel>
      <CustomTabPanel value={value} index={2} >
      {course.length !== 0 ?  course.map((task,index) =>  {
          return task.topic.map((courseTopic,courseTopicIndex) =>  {
           return courseAvalile.map(avalible =>  {
              if(courseTopic.id == avalible._id){
                return  <MockTest courseTopicIndex={courseTopicIndex} courseAvalile={avalible} setPageController={setPageController} setMock={setMock} key={index}  task={courseTopic} index={index} setCourse={setCourse} course={course} />
              }
            })
          } )
        } ):  
        <div style={{fontWeight:'700',fontSize:'30px', color:'gray',width:'100%',height:'50vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        Add topic 
      </div>}
      </CustomTabPanel>
   
      <Notificate
        setNotification={setNotification}
        notificate={notificate}
        message={message}
        severity={severity}
      />

    </Paper>
  );
}
