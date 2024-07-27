import { Stack, SwipeableDrawer } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExamHeader from "./components/ExamHeader";
import ExamEndCard from "./components/ExamEndCard";
import QuestionStateCard from "./components/QuestionStateCard";
import QuestionActionCard from "./components/QuestionActionCard";
import ExamTimerCard from "./components/ExamTimerCard";
import QuestionCollections from "./components/QuestionCollections";
import useWindowDimensions from "../../../util/useWindowDimensions";
import ExamEndDialog from "./components/ExamEndDialog";
import WarningComp from "./components/WarningComp";
import { callProfileUrl } from "../../../util/callImageUrl";

export default function ExamState() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const examID = search.split("=")[1];
  const { width, height } = useWindowDimensions();
  const [examInfo, setExamInfo] = useState();
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [remainingTime, setRemainingTime] = useState("00:00:00");
  const [timePercentage, setTimePercentage] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setuser] = useState([]);
  const calculateRemainingTime = () => {
    let examTime = examInfo.examEndTime.split(":");
    let examDate = examInfo.examDate.split("/");
    let examDay = examDate[0];
    let examMonth = examDate[1];
    let examYear = examDate[2];
    let examHours = examTime[0];
    let examMinutes = examTime[1];
    let examSeconds = examTime[2];

    let examDateObject = new Date(
      `${examMonth}/${examDay}/${examYear} ${examHours}:${examMinutes}:${examSeconds}`
    );

    let currentDateObject = new Date();

    let remainingTime = examDateObject - currentDateObject;

    return remainingTime;
  };

  const calculateTimePercentage = (remainingTime) => {
    let examDuration = examInfo.examDuration.split(":");
    let examHours = examDuration[0];
    let examMinutes = examDuration[1];
    let examSeconds = examDuration[2];
    let examDurationInMilliseconds =
      examHours * 60 * 60 * 1000 + examMinutes * 60 * 1000 + examSeconds * 1000;
    let timePercentage = (remainingTime / examDurationInMilliseconds) * 100;
    return timePercentage;
  };

  const getRemainingTime = () => {
    let remainingTime = calculateRemainingTime();
    let remainingTimePercentage = calculateTimePercentage(remainingTime);
    let seconds = Math.floor((remainingTime / 1000) % 60);
    let minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    let hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    let remainingTimeString = `${hours}:${minutes}:${seconds}`;
    if (remainingTime < 0) {
      setIsTimeOver(true);
      setRemainingTime("00:00:00");
      setTimePercentage(0);
    } else {
      setRemainingTime(remainingTimeString);
      setTimePercentage(remainingTimePercentage);
    }
  };

  useEffect(() => {
    fetch(`/api/exam/get-exam-state/${examID}`)
      .then((res) => res.json())
      .then((data) => {
       
        setExamInfo(data);
        setStudentAnswers(data.studentsPerformance[0].studentAnswerList);
        setIsBookmarked(data.studentsPerformance[0].bookmarkedQuestionList);
        setCurrentQuestionIndex(eval(data.studentsPerformance[0].currentIndex));
      });
    fetch("/api/user/getUserDetails")
      .then((res) => res.json())
      .then(async (data) => {
        data.avatar = await callProfileUrl(data.avatar)
        setuser(data)
      });

    fetch("/isValueExam")
      .then((res) => res.json())
      .then((data) => {
        if (data.isValue == false) navigate(`/?=${data.userID}`);
      });
  }, []);

  useEffect(() => {
    if (examInfo) {
      setInterval(() => {
        getRemainingTime();
      }, 1000);
    }
  }, [examInfo]);
  useEffect(() => {

    // if (isTimeOver) {
      
    if (studentAnswers.length !== 0) {
      fetch("/api/exam/stateUpdate", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          studentAnswerList: studentAnswers,
          bookmarkedQuestionList: isBookmarked,
          currentIndex: currentQuestionIndex,
        }),
      })
        .then((res) => res.json())
        .then((data) => {})
    }
  }, [studentAnswers, isBookmarked]);

  useEffect(() => {
    if (isTimeOver) {
      fetch("/api/exam/submitExam")
        .then((res) => res.json())
        .then((data) => {
          if (data.status == "success") {
            navigate(`/exam/result?=${examID}`);
          }
        });
    }
  }, [isTimeOver]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examInfo.questionCollections.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleOptionClick = (index) => {
    let newStudentAnswers = [...studentAnswers];
    newStudentAnswers[currentQuestionIndex] = index;
    setStudentAnswers(newStudentAnswers);
  };

  const handleBookmarkClick = () => {
    let newIsBookmarked = [...isBookmarked];
    newIsBookmarked[currentQuestionIndex] =
      !newIsBookmarked[currentQuestionIndex];
    setIsBookmarked(newIsBookmarked);
  };

  const clearAnswers = () => {
    let newStudentAnswers = [...studentAnswers];
    newStudentAnswers[currentQuestionIndex] = null;
    setStudentAnswers(newStudentAnswers);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = (isSubmit) => {
    if (isSubmit) {
      fetch("/api/exam/submitExam")
        .then((res) => res.json())
        .then((data) => {
          if (data.status == "success") {
            navigate(`/exam/result?=${examID}`);
            setIsDialogOpen(false);
          }
        });
    } else {
      setIsDialogOpen(false);
    }
  };

  return (
    examInfo &&
    (width > 1060 ? (
      <DtView
        currentQuestionIndex={currentQuestionIndex}
        handleNextQuestion={handleNextQuestion}
        handlePreviousQuestion={handlePreviousQuestion}
        handleQuestionClick={handleQuestionClick}
        handleOptionClick={handleOptionClick}
        handleBookmarkClick={handleBookmarkClick}
        isBookmarked={isBookmarked}
        studentAnswers={studentAnswers}
        examInfo={examInfo}
        remainingTime={remainingTime}
        timePercentage={timePercentage}
        clearAnswers={clearAnswers}
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleDialogClose}
        handleDialogOpen={handleDialogOpen}
        user={user}
      />
    ) : (
      <MobileView
        currentQuestionIndex={currentQuestionIndex}
        handleNextQuestion={handleNextQuestion}
        handlePreviousQuestion={handlePreviousQuestion}
        handleQuestionClick={handleQuestionClick}
        handleOptionClick={handleOptionClick}
        handleBookmarkClick={handleBookmarkClick}
        isBookmarked={isBookmarked}
        studentAnswers={studentAnswers}
        examInfo={examInfo}
        remainingTime={remainingTime}
        timePercentage={timePercentage}
        clearAnswers={clearAnswers}
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleDialogClose}
        handleDialogOpen={handleDialogOpen}
        user={user}
      />
    ))
  );
}

const DtView = ({
  currentQuestionIndex,
  handleNextQuestion,
  handlePreviousQuestion,
  handleQuestionClick,
  handleOptionClick,
  handleBookmarkClick,
  isBookmarked,
  studentAnswers,
  examInfo,
  remainingTime,
  timePercentage,
  clearAnswers,
  isDialogOpen,
  handleDialogClose,
  handleDialogOpen,
  user,
}) => {
  return (
    <Stack
      sx={{
        width: "100%",
        padding: "20px 20px",
        maxWidth: "1240px",
        height: "100vh",
      }}
      direction="row"
      gap={2}
    >
      <Stack direction="column" width="130%" gap={2}>
        <ExamHeader user={user} />
        <Stack
          direction="column"
          height={"100%"}
          justifyContent={"space-between"}
        >
          <QuestionStateCard
            index={currentQuestionIndex}
            mark={examInfo.mark}
            negativeMark={examInfo.negativeMark}
            handleOptionClick={handleOptionClick}
            handleBookmarkClick={handleBookmarkClick}
            isBookmarked={isBookmarked[currentQuestionIndex]}
            imageUrl={
              examInfo.questionCollections[currentQuestionIndex].imageUrl
            }
            question={
              examInfo.questionCollections[currentQuestionIndex].question
            }
            optionList={
              examInfo.questionCollections[currentQuestionIndex].options
            }
            studentAnswers={studentAnswers[currentQuestionIndex]}
            clearAnswers={clearAnswers}
          />
          <QuestionActionCard
            handleNextQuestion={handleNextQuestion}
            handlePreviousQuestion={handlePreviousQuestion}
            questionLength={examInfo.questionCollections.length}
            currentQuestionIndex={currentQuestionIndex}
          />
        </Stack>
      </Stack>
      <Stack direction="column" width="70%" gap={2}>
        <ExamEndCard
          title={examInfo.examTitle}
          handleDialogOpen={handleDialogOpen}
        />
        <ExamTimerCard
          remainingTime={remainingTime}
          timePercentage={timePercentage}
        />
        <QuestionCollections
          currentQuestionIndex={currentQuestionIndex}
          handleQuestionClick={handleQuestionClick}
          questionCategoryList={examInfo.questionCategoryList}
          isBookmarked={isBookmarked}
          questionLength={examInfo.questionCollections.length}
          studentAnswers={studentAnswers}
        />
      </Stack>
      <ExamEndDialog
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleDialogClose}
        studentAnswers={studentAnswers}
      />
      <WarningComp />
    </Stack>
  );
};

const MobileView = ({
  currentQuestionIndex,
  handleNextQuestion,
  handlePreviousQuestion,
  handleQuestionClick,
  handleOptionClick,
  handleBookmarkClick,
  isBookmarked,
  studentAnswers,
  examInfo,
  remainingTime,
  timePercentage,
  clearAnswers,
  isDialogOpen,
  handleDialogClose,
  handleDialogOpen,
  user,
}) => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (open) => (event) => {
    setOpen(open);
  };
  return (
    <Stack
      sx={{
        width: "100%",
        padding: "20 20px",
        height: "100%",

        position: "fixed",
      }}
      direction="column"
      justifyContent={"space-between"}
    >
      <Stack
        sx={{
          height: "100%",
        }}
      >
        <ExamTimerCard
          remainingTime={remainingTime}
          timePercentage={timePercentage}
          isMobileView={true}
          handleDialogOpen={handleDialogOpen}
        />
        <ExamEndCard
          title={examInfo.examTitle}
          isMobileView={true}
          toggleDrawer={toggleDrawer}
          currentQuestionIndex={currentQuestionIndex}
          questionLength={examInfo.questionCollections.length}
          handleDialogOpen={handleDialogOpen}
          handleNextQuestion={handleNextQuestion}
          handlePreviousQuestion={handlePreviousQuestion}
        />
        <QuestionStateCard
          index={currentQuestionIndex}
          mark={examInfo.mark}
          negativeMark={examInfo.negativeMark}
          handleOptionClick={handleOptionClick}
          handleBookmarkClick={handleBookmarkClick}
          isBookmarked={isBookmarked[currentQuestionIndex]}
          imageUrl={examInfo.questionCollections[currentQuestionIndex].imageUrl}
          question={examInfo.questionCollections[currentQuestionIndex].question}
          optionList={
            examInfo.questionCollections[currentQuestionIndex].options
          }
          studentAnswers={studentAnswers[currentQuestionIndex]}
          isMobileView={true}
          clearAnswers={clearAnswers}
        />
        <SwipeableDrawer
          anchor={"bottom"}
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "100%",
              borderRadius: "20px 20px 0px 0px",
              borderTop: "1px solid #E5E5E5",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            },
          }}
        >
          <QuestionCollections
            currentQuestionIndex={currentQuestionIndex}
            handleQuestionClick={handleQuestionClick}
            questionCategoryList={examInfo.questionCategoryList}
            isBookmarked={isBookmarked}
            studentAnswers={studentAnswers}
            isMobileView={true}
            questionLength={examInfo.questionCollections.length}
          />
        </SwipeableDrawer>
      </Stack>
      {/* <QuestionActionCard
        handleNextQuestion={handleNextQuestion}
        handlePreviousQuestion={handlePreviousQuestion}
        isMobileView={true}
        questionLength={examInfo.questionCollections.length}
        currentQuestionIndex={currentQuestionIndex}
      /> */}
      <ExamEndDialog
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleDialogClose}
        studentAnswers={studentAnswers}
      />
      <WarningComp />
    </Stack>
  );
};
