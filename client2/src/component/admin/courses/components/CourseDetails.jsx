import {  IconButton, Paper } from "@mui/material";

import GroupAddTopic from "./GroupAddTopic";
import DeleteIcon from "@mui/icons-material/Delete";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Avater from "../../../../util/Avater";
import AddTopic from "./AddTopic";
import AddGroup from "./AddGroup";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import EditGroupNameCourseCollection from "./EditGroupName";
import { checkPublish } from "../../../../util/checkPublish";
export default function CourseDetails({ Notificate,notificate,setPageController,isNotify,setNotify }) {
  const { search } = useLocation();
  const id = search.split("?")[1];
  const [task, setTask] = useState([]);
  const [course, setCourse] = useState([]);
  const [checkPublishMode,setPublish] = useState([])
  const [isChange,setChange] = useState(false)
  const getCourse = () => {
    fetch("/api/admin/getCourseDetails", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPublish(data.message.status)
        if (data.status == "ok") {
          setCourse(data.message.collections);
        }
      });
    fetch("/api/admin/getCollectionName",{
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setTask(data.message);
     
        }
      });
  };

  useEffect(() => {
    getCourse();
    setPageController({
      mockPage:false,
      courseSettingPage:false
    })
  },[]);
  useEffect(() => {
    getCourse();
  },[Notificate]);
  useEffect(() => {
    getCourse();
    setPageController({
      mockPage:false,
      courseSettingPage:false
    })
  },[isChange]);
  const createTopic = (task) => {
    fetch("/api/admin/createCourseTopic", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ data: task, id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        Notificate(data.status, data.message);
        getCourse();
       
      });
  };
  const createGroup = (data) => {
    fetch("/api/admin/createCourseGroup", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id, groupName: data }),
    })
      .then((res) => res.json())
      .then((data) => {
        Notificate(data.status, data.message);
        getCourse();
      
      });
  };
  const buttonStyle = {
    marginRight: "20px",
    color: "white",
    backgroundColor: "#187163",
    "&:hover": {
      backgroundColor: "#187163",
    },
    textTransform: "none",
  };
  return (
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          margin: "20px 0",
        }}
      >
        <AddTopic createBank={createTopic} task={task} checkPublish={checkPublishMode} Notificate={Notificate} />
        <AddGroup
          createGroup={createGroup}
          id={id}
          task={task}
          checkPublish={checkPublishMode}
          Notificate={Notificate}
        />
      </div>
      <div
        className="scrollHide"
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          width: "100%",
          paddingBottom: "20px",
          maxHeight: "calc(100vh - 320px)",
          overflowY: "scroll",
        }}
      >
      {course.length !== 0 ?  course.map((item, index) => {
          if (item.type === "group") {
            return (
              <AccordionCards
                id={id}
                task={task}
                groupID={item._id}
                key={index}
                title={item.title}
                topicList={item.topic}
                collectionsID={item._id}
                index={index}
                courseID={id}
                checkPublish={checkPublish}
                checkPublishMode={checkPublishMode}
                isNotify={isNotify} setNotify={setNotify}
                Notificate={Notificate}
               setChange={setChange}
               isChange={isChange}
              />
            );
          } else {
            return item.topic.length == 0 ? null : (
              <TopicCard
                key={index}
                collectionsID={item._id}
                title={item.topic[0].title}
                courseID={id}
                quesBankID={item.topic[0]._id}
                index={index}
                checkPublish={checkPublish}
                checkPublishMode={checkPublishMode}
                isNotify={isNotify} 
                setNotify={setNotify}
                Notificate={Notificate}
                setChange={setChange}
                isChange={isChange}
              />
            );
          }
        })

      :
      <div style={{fontWeight:'700',fontSize:'30px', color:'gray',width:'100%',height:'50vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        Add topic 
      </div>
      }
      </div>
    </div>
  );
}

function AccordionCards({
  task,
  Notificate,
  courseID,
  isNotify,
  setNotify,
  title,
  collectionsID,
  topicList,
  index,
  id,
  checkPublishMode,
  groupID,
  setChange,
  isChange,
  checkPublish
}) {
  const createTopic = (data) => {
    fetch("/api/admin/createGroupTopic", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ groupID: groupID, id: id, data: data }),
    })
      .then((res) => res.json())
      .then((data) => {
        Notificate(data.status, data.message);
      });
  };

  const deleteCourse = () => {
    if(checkPublishMode !== "publish")
  {
    fetch("/api/admin/deleteGroupCourseCollection", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        courseID: courseID,
        title: title,
        collectionsID: collectionsID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
       
        checkPublish(courseID)
        Notificate(data.status, data.message);
        setChange(!isChange)
        setNotify(!isNotify)
      });}
      else{
        Notificate('info', 'Please switch to publish mode');
      }
  };
 
  return (
    <div style={{ width: "400px" }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                maxWidth: "calc(100% - 140px)",
                fontWeight: "500",
              }}
            >
              <img src={Avater.FileImage} />
              <span>{title}</span>
            </div>
            <div style={{display:'flex'}}>
              <IconButton title="Delete Group" onClick={deleteCourse}>
                <DeleteIcon />
              </IconButton>
              <EditGroupNameCourseCollection checkPublish={checkPublishMode}  task={task} Notificate={Notificate} courseID={courseID} title={title} collectionsID={collectionsID} />
    
              <GroupAddTopic task={task} createTopic={createTopic} checkPublish={checkPublishMode} Notificate ={Notificate} />
       
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: "0",
            margin: "0",
          }}
        >
          {topicList.map((topic, index) => {
            return (
              <TopicCard
                Notificate={Notificate}
                key={index}
                collectionsID={collectionsID}
                courseID={id}
                checkPublishMode={checkPublishMode}
                checkPublish={checkPublish}
                quesBankID={topic._id}
                title={topic.title}
                index={index}
                isNotify={isNotify} 
                setNotify={setNotify}
                isChange={isChange}
                setChange={setChange}
              />
            );
          })}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function TopicCard({
  Notificate,
  collectionsID,
  title,
  index,
  isNotify,
  setNotify,
  courseID,
  quesBankID,
  isChange,
  setChange,
  checkPublish,
  checkPublishMode
}) {
  const deletCollection = () => {
    if(checkPublishMode !== "publish")
 {   fetch("/api/admin/deleteCourseCollection", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        courseID: courseID,
        quesBankID: quesBankID,
        title: title,
        collectionsID: collectionsID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
       
        checkPublish(courseID)
        Notificate(data.status, data.message);
        setChange(!isChange)
        setNotify(!isNotify)
      });
    } else{
      Notificate('info', 'Please switch to publish mode');
    }
  };
  return (
    <Paper
      sx={{
        width: "400px",
        height: "70px",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          paddingRight: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            gap: "20px",
            padding: "0 20px",
          }}
        >
          <img src={Avater.QuestionImage} />
          <span style={{ fontWeight: "500" }}>{title}</span>
        </div>
        <IconButton title="Delete Topic" onClick={deletCollection}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Paper>
  );
}
