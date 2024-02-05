import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./components/Searchbar";
import { Paper, Stack } from "@mui/material";
import AddBatch from "./components/AddBatch";
import Image from "../../../util/Avater";
import { SvgIcon } from "@mui/material";
import "../../../App.css";
import AddTeacher from "./components/AddTeacher";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TeacherList from './components/TeacherList'
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import { TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import {callProfileUrl} from '../../../util/callImageUrl'
import Loader from '../../../util/Loader'
export default function InstitutePage({ ControlNotification }) {
  const { search } = useLocation();
  const navigator = useNavigate();
  const id = search.split("=")[1];
  const [user,setUser] = useState([])
  const [teacher, setTeacher] = useState([]);
  const [institute, setInstitute] = useState([]);
  const [isLoading,setLoading] = useState([])
  const [isPageLoading,setIsPageLoading] = useState(false)
  const getInstitution = () => {
    setIsPageLoading(true)
    fetch("/api/institution/getInstitution",{
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then( async(data) => {
        if (data.status == "success") {
      
           if(data.message.teacherList.length > 0) 
           {
            for(let i=0;i<data.message.teacherList.length;i++) {
              data.message.teacherList[i].avatar = await callProfileUrl(data.message.teacherList[i].avatar)
            }
           }
           for (let index = 0; index < data.message.batch.length; index++) {
            data.message.batch[index] =data.createBatchList[index];
          }
          setIsPageLoading(false)
          setInstitute(data.message)
        };
      });
  };

  const getTeacher = () => {
    fetch("/api/institution/getTeacher")
      .then((res) => res.json())
      .then((data) => {
      
        setTeacher(data.message);
      });
  };
  const editTeacherAction = (type,data) =>{
    fetch('/api/institution/editTeacherAction',{
  method:"POST",
  headers:{
    "Content-type":"application/json"
  },
  body:JSON.stringify({type,data,id})
    })
    .then(res => res.json())
    .then((data) => {
      if(data.status == 'success'){
    getInstitution()
    ControlNotification(data.status,data.message)
      }
      if(data.status == 'error')   ControlNotification(data.status,data.message)
    })
  } 
  const removeTeacher = (data1) =>{
    fetch('/api/institution/removeTeacher',{
      method:"POST",
      headers:{
        "Content-type":"application/json"
      },
      body:JSON.stringify({data:data1,id})
        })
        .then(res => res.json())
        .then((data) => {
          if(data.status == 'success'){
        getInstitution()
        getTeacher()
        setLoading((preValue)=>{
          let getValue = preValue
          getValue = [...getValue.filter(task => task.valueOf() !== data1.id.valueOf())]
          return getValue
        })
        ControlNotification(data.status,data.message)
          }
          if(data.status == 'error')   ControlNotification(data.status,data.message)
        })
  }
const getTeacherAccess =(status,data) =>{

if(status == 'callInstitute') getInstitution()
if(status == 'removeBatch') editTeacherAction('removeBatch',data)
if(status == 'removeTeacher')  removeTeacher(data)

if(status == 'success' ) {
  getInstitution()
  getTeacher()
} 

}
  useEffect(() => {
    getInstitution();
    getTeacher();
    fetch("/isLogin")
    .then((res) => res.json())
    .then((data) => {
      setUser(data.roll)
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
  },[]);
  return (
    isPageLoading ? <Loader /> :
    <div>
{/* <SearchBar /> */}
      <Stack sx={{ marginTop: "20px" }}>
        {institute.length > 0 ? (
          ""
        ) : (
          <Home
            teacher={teacher}
            institute={institute}
            id={id}
            user={user}
            ControlNotification={ControlNotification}
            getTeacherAccess={getTeacherAccess}
            isLoading ={isLoading}
            setLoading = {setLoading}
          />
        )}
      </Stack>
    </div>
  );
}

const Home = ({user, institute, id, ControlNotification, teacher,getTeacherAccess,isLoading,
  setLoading }) => {
  const style = {
    image: {
      width: " 50px",
      height: " 50px",
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
    addBtn: {
      color: "white",
      borderRadius: " 4px",
      background: " #187163",
      minWidth: "118px",
      height: "34px",
      textTransform: "none",
    },
    batch: {
      color: " #000",
      fontFamily: " DM Sans",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
      marginTop: "20px",
    },
  };
  return (
    <Paper
      sx={{
        borderRadius: "5px",
        background: "#FFF",
        boxShadow: "0px 15px 62px 0px rgba(0, 0, 0, 0.08)",
        width: "100%",
        height: "600px",

        padding: "20px",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing="15px">
          <img src={Image.institutionImage} style={style.image} alt="" />
          <p style={style.name}>{institute.name}</p>
        </Stack>
        <Stack direction="row" alignItems="center" spacing="15px">
          {

          user == 'institution' ? <AddTeacher
            id={id}
            teacher={teacher}
            ControlNotification={ControlNotification}
            getTeacherAccess={getTeacherAccess}
          />
          : null
}
{
   user == 'institution' ?  <AddBatch id={id} ControlNotification={ControlNotification} getTeacherAccess={getTeacherAccess} />
   : null
}
     
        </Stack>
      </Stack>
      <ChooseTab user={user} institute={institute} getTeacherAccess={getTeacherAccess} ControlNotification={ControlNotification}  isLoading={isLoading} 
        setLoading={setLoading}  />
    </Paper>
  );
};

function ChooseTab({ user,institute,getTeacherAccess,ControlNotification,isLoading, setLoading }) {

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
          
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#FEA800",
               
              },
              "& .MuiTab-root " :{ color:' black !important' }

            }}
            
          >
            <Tab
              sx={{ textTransform: "none", fontSize:'16px' ,fontWeight: "550" ,
           
            }}
              label="Active Batches"
              value="1"
            />
            {
            user == 'teacher' ?  null : <Tab
            sx={{ textTransform: "none",fontSize:'16px', fontWeight: "550" }}
            label="Teacher List"
            value="2"
          /> 
            }
           
          </TabList>
        </Box>
        <TabPanel value="1">
          <ActiveBatch institute={institute} />
        </TabPanel>
        <TabPanel value="2">
       <TeacherList institute={institute} getTeacheAccess={getTeacherAccess} ControlNotification={ControlNotification}  isLoading={isLoading}  setLoading={setLoading}  />    
        </TabPanel>
      </TabContext>
    </Box>
  );
}

const ActiveBatch = ({ institute }) => {
  return (
    <div
      className="scrollHide"
      style={{ width:'100%', height: "450px", overflow: "scroll", }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {institute.batch  == undefined || institute.batch.length == 0
          ? <div
          style={{
            width: "100%",
            height: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#CACACA",
          }}
        >
          No Active Batches
        </div>
          : 
      
          <div
            className="scrollHide"
            style={{
              padding: "10px",
              display: "flex",
              gap: "20px",
             // height: "55vh",
            flexWrap:'wrap',
              width: "100%",
              overflowY: "scroll",
            }}
          >
            {institute.batch.map((task, index) => (
              <Batch task={task} key={index} />
            ))}
          </div>
            
            }
      </div>
    </div>
  );
};

const Batch = ({ task }) => {
  const navigator = useNavigate();
  const RieDirect = () => {
    navigator(`/institution/batch?=${task.batchID}`);
  };

  const style = {
    image: {
      width: " 46px",
      height: "44px",
    },
    name: {
      color: " #000",
      fontFamily: " DM Sans",
      fontSize: "18px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
    },
  };

  return (
    <Paper
      sx={{
        width: "290px",
        height: "110px",
        borderRadius: "5px",
        background: "#FFF",
        boxShadow: " 0px 5px 5px 2px rgba(0, 0, 0, 0.10)",
        cursor: "pointer",
        padding: "10px",
        display:'flex',
       flexDirection:'column'
      }}
      onClick={RieDirect}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing="10px">
          <img src={Image.FileImage} style={style.image} alt="" />
          <p style={style.name}>{task.name}</p>
        </Stack>
        <SvgIcon component={ArrowForwardIosIcon} sx={{ color: "#187163" }} />
      </Stack>
      <Stack display='flex' justifyContent='space-around' alignItems='center' flexDirection='row'>
        <center >
         <p style={{fontWeight:'700',color:'#187163'}}>{task.studentList}</p>
        <p style={{marginTop:'auto',color:'#187163'}}>Students</p>
        </center>
      <center>
        <p style={{fontWeight:'700',color:'#FEA800'}}>{task.teacherList}</p>
      <p style={{marginTop:'auto',color:'#FEA800'}}>Teachers</p>
    </center>
     
      </Stack>
    
    </Paper>
  );
};


