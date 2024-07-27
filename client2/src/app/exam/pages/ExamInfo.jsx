import { Paper, Stack, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWindowDimensions from "../../../util/useWindowDimensions";
import ExamHeader from "./components/ExamHeader";
import LoadingButton from "@mui/lab/LoadingButton";
import ExamComplete from "./components/ExamComplete"
import Footer from "../../../util/Footer";
import { callProfileUrl } from "../../../util/callImageUrl";
export default function ExamInfo() {
  const { search } = useLocation();
   const {width} = useWindowDimensions()
  const examId = search.split("=")[1];
  const navigator = useNavigate();
  const [examInfo, setExamInfo] = useState(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [user,setuser] = useState([])
  const [message,setMessage] =useState('')
  const [examState,setExamComplete] = useState(false)
  useEffect(() => {
    fetch(`/api/exam/get-exam-info/${examId}`)
      .then((res) => res.json())
      .then((data) => {
        setExamInfo(data);
        setIsScheduled(() => {
          return data.type === "schedule" ? true : false;
        });
       
      });
      fetch('/api/user/getUserDetails')
      .then(res => res.json())
      .then(async (data) => {
        data.avatar = await callProfileUrl(data.avatar)
        setuser(data)
      }) 

      fetch("/isLogin")
      .then((res) => res.json())
      .then((data) => {
    
        if (data.status == "isExam" ) navigator(`/exam/state?=${data.examID}`)

      if (
        (data.status == "isLogin" && data.roll == "admin") ||
        (data.status == "isLogin" && data.roll == "teacher") ||
        (data.status == "isLogin" && data.roll == "institution")
      )
        navigator(`/admin/dashboard?=${data.id}`);
      });
  },[]);

  return (
    examInfo && (
      <Stack
        sx={{
          width: "100%",
          height:  width > 450 ? '100vh' : '100%',
          padding: width > 600  ? "0px 20px" : "0px 10px",
          marginTop: "20px",
          maxWidth: "1240px",
          display:'flex',
          flexDirection:'column'
        }}
      >
        <ExamHeader user={user} />
        <ExamComplete examState={examState} message={message} />
        <ExamInfoBody
          isScheduled={isScheduled}
          examName={examInfo.title}
          scheduledTime={`${examInfo.examStartTime}:00`}
          scheduledDate={examInfo.examDate}
          examId={examId}
          duration={examInfo.examDuration}
          totalMark={examInfo.totalMark}
          NoOfquestion={examInfo.NoOfquestion}
          setExamComplete={setExamComplete}
          setMessage={setMessage}
        />
<Stack marginTop='auto'>
<Footer />
</Stack>
     
      </Stack>
    )
  );
}

const ExamInfoBody = ({
  examName,
  isScheduled,
  scheduledTime,
  scheduledDate,
  examId,
  setExamComplete,
  NoOfquestion,
  duration,
  totalMark,
  setMessage,
 
}) => {
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00:00");
  const [load,setLoad] = useState(false)
  const [currentDate, setCurrentDate] = useState("00/00/0000");
  const [remainingTime, setRemainingTime] = useState("0d 0h 0m 0s");
  const navigate = useNavigate();

  const updateExamTime = () => {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm}`);
  };

  const updateExamDate = () => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
  };

  const calculateRemainingTime = () => {
    let examTime = scheduledTime.split(":");
    let examDate = scheduledDate.split("/");
    let examHours = examTime[0];
    let examMinutes = examTime[1];
    let examSeconds = examTime[2];
    let examDay = examDate[0];
    let examMonth = examDate[1];
    let examYear = examDate[2];
    let examDateObject = new Date(
      `${examMonth}/${examDay}/${examYear} ${examHours}:${examMinutes}:${examSeconds}`
    );

    const getExamDate = new Date();
    let changeTime = getExamDate.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
   
    const getDate = changeTime.split(',')[0].split('/')
    const getTime =  changeTime.split(',')[1].split(':')
    
    const indianTime = {
       date : getDate[1],
       month : getDate[0],
       year : getDate[2],
       hour:getTime[0],
       minutes:getTime[1],
       sec:getTime[2]
    }
    let currentDateObject = new Date(`${indianTime.month}/${indianTime.date}/${indianTime.year} ${indianTime.hour}:${indianTime.minutes}:${indianTime.sec}`);
    
    let remainingTime = examDateObject - currentDateObject;
    return remainingTime;
  };

  const getRemainingTime = () => {
    let remainingTime = calculateRemainingTime();
    let seconds = Math.floor((remainingTime / 1000) % 60);
    let minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    let hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    let days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

    if (remainingTime < 0) {
      setIsTimeOver(true);
      setRemainingTime("0d 0h 0m 0s");
    } else {
      setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }
  };
  setInterval(() => {
    updateExamTime();
    updateExamDate();
    getRemainingTime();
  }, 1000);

  

  return (
    <Paper
      elevation={2}
      sx={{
        padding: "40px 30px",
        borderRadius: "20px",
        width: "100%",
        margin: "30px 0px",
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="space-between"
        gap={3}
      >
        <h1
          style={{
            fontWeight: "700",
            fontSize: "26px",
            color: "#187163",
          }}
        >
          {examName}
        </h1>
        <h2
          style={{
            fontWeight: "700",
            fontSize: "20px",
          }}
        >
          Instructions
        </h2>
        <ol
          style={{
            textAlign: "left",
            fontWeight: "500",
            fontSize: "18px",
            width: "80%",
            lineHeight: "34px",
            color: "#3F3F3F",
          }}
        >
          <li>This Test booklet consists of {NoOfquestion} questions.</li>
          <li>There is no time limit for each questions.</li>
          <li>All the questions were given as multiple choice questions.</li>
          <li>The total duration is {duration} hour.</li>
          <li>The maximum mark can be attempted in this test is {totalMark}.</li>
        </ol>
        {isScheduled ? (
          <>
            <h2
              style={{
                fontWeight: "700",
                fontSize: "20px",
              }}
            >
              Exam Starts In
            </h2>
            <h1
              style={{
                fontWeight: "700",
                fontSize: "26px",
                color: "#FEA800",
              }}
            >
              {remainingTime}
            </h1>
          </>
        ) : null}

{
  load == false ? 

        <Button
        loading
          variant="contained"
          disabled={!isTimeOver && isScheduled}
          sx={{
            textTransform: "none",
            backgroundColor: "#187163",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#187163",
              color: "#fff",
            },
          }}
          onClick={() => {
            setLoad(true)
            fetch(`/api/exam/start-exam/${examId}`)
              .then((res) => res.json())
              .then((data) => {
               
               
                if(data.status == 'info'  )  {           
                  setMessage(data.message)
                  setExamComplete(true)
               
              }
                if (data.status === "success")
                  navigate(`/exam/state?=${examId}`);
              });
          }}
        >
          Start Test
        </Button>
        :
        <LoadingButton loading  sx={{ "& .MuiCircularProgress-root": { color: "#187163" } }} >
          
        </LoadingButton>
}
      </Stack>
    </Paper>
  );
};
