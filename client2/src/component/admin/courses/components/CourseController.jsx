import Paper from "@mui/material/Paper";
import Image from "../../../../util/Avater";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CourseController({
  collectDetails,
  ControlNotification,
  pageControl,
  mock,
  isNotify,
    setNotify 
}) {
  const { search } = useLocation();
  const id = search.split("?")[1];
  const [checkPublish,setPublish] = useState([])
const sendPublish = () =>{
  fetch("/api/admin/publishCourse", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ id: id,}),
  })
 .then(res => res.json())
.then(data =>   {
  ControlNotification(data.status,data.message)
  getCourse()
})
}

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
      if (data.status == "ok") {
      
        setPublish(data.message);
      
      }
    });
}

const callDraft = () =>{
  fetch("/api/admin/callDraft", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((res) => res.json())
    .then((data) => {
   
      setNotify(!isNotify)
      getCourse()
      ControlNotification(data.status,data.message)
    });
}

useEffect(()=>{getCourse()},[])
  return (
    <Paper elevation={1} style={{ padding: "10px 20px", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={Image.FileImage} />
          <div style={{ marginLeft: "10px" }}>
            <h4
              style={{
                fontSize: "18px",
              }}
            >
              Course Name
            </h4>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {checkPublish.status == 'publish' ?        
          <Button
          variant="contained"
          sx={{
            backgroundColor: "#187163",
            "&:hover": {
              backgroundColor: "#187163",
            },
            width: "90px",
          }}
          disableElevation
        onClick={callDraft}
        >
          Draft
        </Button>
          
      :      <Button
      variant="contained"
      sx={{
        backgroundColor: "#187163",
        "&:hover": {
          backgroundColor: "#187163",
        },
        width: "90px",
      }}
      disableElevation
      onClick={sendPublish}
    >
      Publish
    </Button> }
         
          {pageControl.mockPage == false &&
          pageControl.courseSettingPage == false ? (
            ""
          ) : (
            <SaveButton
              mock={mock}
              checkPublish={checkPublish}
              collectDetails={collectDetails}
              ControlNotification={ControlNotification}
              pageControl={pageControl}
            />
          )}
        </div>
      </div>
    </Paper>
  );
}

const SaveButton = ({
  collectDetails,
  ControlNotification,
  pageControl,
  mock,
  checkPublish
}) => {
  const course = [];
  const { search } = useLocation();
  const id = search.split("?")[1];
  const styleButton = {
    save: {
      backgroundColor: "#187163",
      width: "90px",
      "&:hover": {
        backgroundColor: "#187163",
      },
    },
    unSave: {
      backgroundColor: "#787486",
      width: "90px",
      "&:hover": {
        backgroundColor: "#787486",
      },
    },
  };
  const callCheck = () => {
  const check =[]
    mock.map((task) =>
      task.topic.map((task) => {
          
        if (
          task.level.easy == "" ||
          task.level.medium == "" ||
          task.level.hard == ""
        ) {
          ControlNotification("error", "text field should not be empty");
        } else {
          course.push(task);
        }
      })
    );
    mock.map((task) =>
    task.topic.map((task) => {
      check.push(task)
      
    })
  );
    
    if (course.length == check.length) {
      fetch("/api/admin/createCourseMock", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id: id, course: mock }),
      })
        .then((res) => res.json())
        .then((data) => {
          ControlNotification(data.status, data.message);
        });
   
    }
 
  };

  const sendData = () => {
  
    if(collectDetails.mediumPercentage[0] > '0'){
      if(collectDetails.Payment.length > 0)
{   fetch("/api/admin/createCourseDuration", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id, course: collectDetails }),
    })
      .then((res) => res.json())
      .then((data) => {
        ControlNotification(data.status,data.message)
      })
    }
    else{
      ControlNotification('info','Please set Payment')
    }
    }
    else{
      ControlNotification('info','Please set the medium percentage');
    }
 
  };

  return (
    <>
      {
      checkPublish.status !== 'publish' ?  
      
      pageControl.mockPage == false &&
      pageControl.courseSettingPage == true ? (
        collectDetails.mark > '0' &&
        collectDetails.duration > '0'   ? (
          <Button
            variant="contained"
            sx={styleButton.save}
            style={{ marginLeft: "30px" }}
            onClick={sendData}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={styleButton.unSave}
            style={{ marginLeft: "30px" }}
          
          >
            Save
          </Button>
        )
      ) : (
        <Button
          variant="contained"
          sx={styleButton.save}
          style={{ marginLeft: "30px" }}
          onClick={callCheck}
        >
          Save
        </Button>
      )
    : null
    }
    </>
  );
};
