import TopNavBar from "./components/TopNavBar";
import GoalCard from "./components/GoalCard";
import InstitutionCard from "./components/InstitutionCard";
import ScoreCard from "./components/ScoreCard";
import AnalysisCard from "./components/AnalysisCard";
import TestCard from "./components/TestCard";
import PracticeTest from "./components/PracticeTest";
import MockTest from "./components/MockTest";
import MDNavBar from "./components/MDNavBar";
import { Stack, Grid, Tab, Tabs, Paper } from "@mui/material";
import PropTypes from "prop-types";
import useWindowDimensions from "../../util/useWindowDimensions";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Notification from "../../util/Alert";
import Footer from "../../util/Footer";
import Loader from "../../util/Loader";
import Payment from "./components/Payment";
import { callInstitutionUrl, callProfileUrl } from "../../util/callImageUrl";
export default function Layout() {
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();
  const { search } = useLocation();
  const id = search.split("=")[1];
  const { width } = useWindowDimensions();
  const [institute, setInstitue] = useState([]);
  const [user, setUser] = useState([]);
  const [isWaitingPra,setWaitPra] = useState(false)
  const [isWaitingMock,setWaitMock] = useState(false)
  const [goal, setGoal] = useState([]);
  const [getGoalId, setGoalId] = useState("");
  const [isChange, setChange] = useState(false);
  const [selectGoal, setSelectGoal] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [instituteDetails, setInstituteDetails] = useState([]);
  const [studentsPerformance, setStudentsPerformance] = useState([]);
  const [details, setDetails] = useState({
    userID: id,
    instituteName: "",
    instituteID: "",
    rollNumber: "",
    Dept: "",
    batchCode: "",
  });
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [notificate, setNotification] = useState(false);
  const Notifications = (status, message) => {
    setSeverity(status);
    setMessage(message);
    setNotification(true);
  };

  const getInstitute = () => {
    fetch("/api/user/getInstitute")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ok") setInstitue(data.message);
      });
  };
  const getUserDetails = () => {
    setLoading(true);
    fetch("/api/user/getUserData", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.status == "ok") {
          data.message.avatar = await callProfileUrl(data.message.avatar) 
          data.message.changeName = data.message.name.length > 7 ? `${data.message.name.slice('0','5')}...` : data.message.name
          data.instuteDetails.avatar = await callInstitutionUrl(data.instuteDetails.avatar) 
          setInstituteDetails(data.instuteDetails);
          setStudentsPerformance(data.studentsPerformance.score);
          setAnalysis(data.studentsPerformance.Analysis);
          
          setUser(data.message);
          setGoal(data.data);
          if (data.topic.courseId !== "") setSelectGoal(data.topic);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const addGoal = (goal) => {
    fetch("/api/user/addGoal", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id, goal }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") setChange(!isChange);
        Notifications(data.status, data.message);
      });
  };
  const createPracticesExam = (value, selectGoal) => {
    setWaitPra(true)
    fetch("/api/exam/createPracticesExam", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id, value, selectGoal }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "info") {
          Notifications(data.status, data.message);
          setWaitPra(false)
        }
        if (data.status == "success") {
          navigator(`/exam/info?=${data.examId}`);
          setWaitPra(false)
        }
      });
  };
  const createMockExam = (data) => {
    setWaitMock(true)
    fetch("/api/exam/createMockExam", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ selectGoal }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "info"){ 
          Notifications(data.status, data.message);
          setWaitMock(false)
        }
        if (data.status == "success") {
          navigator(`/exam/info?=${data.examId}`);
          setWaitMock(false)
        }
      });
  };
  useEffect(() => {
    if (getGoalId !== "") {
      setLoading(true);
      fetch("/api/user/getViewGoal", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ getGoalId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAnalysis(data.studentsPerformance[0].Analysis);
          setStudentsPerformance(data.goal);
          setSelectGoal(data.topic);
          setLoading(false);
        });
    }

    fetch("/handleStatus")
      .then((res) => res.json())
      .then((data) => {});
    fetch("/api/user/checkIsValid")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == true) {
          getInstitute();
          getUserDetails();
        }
      });
  }, [getGoalId]);
  useEffect(() => {
    fetch("/isLogin")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "goal") navigator(`/login/goal`);
        if (data.status == "userDetails") navigator(`/login/create`);
        if (data.status == "isLogout") navigator("/login");
        if (data.status == "isExam") navigator(`/exam/state?=${data.examID}`);
        if (id == undefined) navigator("/login");
        if (data.status == "isLogin" && data.roll == "student")
          navigator(`/?=${data.id}`);
        if (
          (data.status == "isLogin" && data.roll == "admin") ||
          (data.status == "isLogin" && data.roll == "teacher") ||
          (data.status == "isLogin" && data.roll == "institution")
        ) {
          if (data.roll == "teacher" || data.roll == "institution")
            return navigator(`/institution?=${data.institutionID}`);

          return navigator(`/admin/dashboard?=${data.id}`);
        }
      });
    getInstitute();
    getUserDetails();
  }, [isChange, id]);

  return loading == true ? (
    <Loader />
  ) : (
    <div>
      {width > 1024 ? (
        <DTView
          institute={institute}
          user={user}
          goal={goal}
          isChange={isChange}
          addGoal={addGoal}
          id={id}
          setGoalId={setGoalId}
          selectGoal={selectGoal}
          createPracticesExam={createPracticesExam}
          setSelectGoal={setSelectGoal}
          details={details}
          analysis={analysis}
          setDetails={setDetails}
          Notificate={Notifications}
          studentsPerformance={studentsPerformance}
          createMockExam={createMockExam}
          instituteDetails={instituteDetails}
          isWaitingPra={isWaitingPra}
          isWaitingMock={isWaitingMock}
        />
      ) : (
        <MoView
          institute={institute}
          user={user}
          goal={goal}
          id={id}
          analysis={analysis}
          setGoalId={setGoalId}
          addGoal={addGoal}
          isChange={isChange}
          selectGoal={selectGoal}
          createPracticesExam={createPracticesExam}
          setSelectGoal={setSelectGoal}
          details={details}
          createMockExam={createMockExam}
          setDetails={setDetails}
          studentsPerformance={studentsPerformance}
          Notificate={Notifications}
          width={width}
          instituteDetails={instituteDetails}
          isWaitingPra={isWaitingPra}
          isWaitingMock={isWaitingMock}
        />
      )}

      <Notification
        setNotification={setNotification}
        notificate={notificate}
        message={message}
        severity={severity}
      />
    </div>
  );
}

function DTView({
  id,
  institute,
  addGoal,
  setDetails,
  isChange,
  details,
  user,
  goal,
  selectGoal,
  setSelectGoal,
  Notificate,
  setGoalId,
  createPracticesExam,
  createMockExam,
  studentsPerformance,
  analysis,
  instituteDetails,
  isWaitingPra,
  isWaitingMock
}) {
  return (
    <Stack
      direction="column"
      alignItems="center"
      sx={{
        width: "100%",
        padding: "30px 0px",
        backgroundColor: "#C5CFD3",
        minHeight: "100vh",
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        gap={"10px"}
        sx={{
          width: "100%",
          padding: "0px 20px",
          maxWidth: "1240px",
        }}
      >
        <TopNavBar user={user} goal={selectGoal} />
        <Grid
          container
          width={"100%"}
          sx={{
            marginTop: "20px",
            maxWidth: "1200px",
          }}
        >
          <Grid item xs={6} paddingRight="10px">
            <GoalCard
              goal={goal}
              selectGoal={selectGoal}
              isChange={isChange}
              addGoal={addGoal}
              setGoalId={setGoalId}
              setSelectGoal={setSelectGoal}
              id={id}
            />
            {selectGoal && (
              <TestCard
                selectGoal={selectGoal}
                setSelectGoal={setSelectGoal}
                Notificate={Notificate}
                createMockExam={createMockExam}
                isWaitingPra={isWaitingPra}
                isWaitingMock={isWaitingMock}
                createPracticesExam={createPracticesExam}
              />
            )}
          </Grid>
          <Grid item xs={6} paddingLeft="10px">
            <InstitutionCard
              institute={institute}
              setDetails={setDetails}
              details={details}
              Notificate={Notificate}
              instituteDetails={instituteDetails}
            />

            {studentsPerformance.length !== 0 && (
              <ScoreCard studentsPerformance={studentsPerformance} />
            )}
            {analysis !== "" && <AnalysisCard analysis={analysis} />}
          </Grid>
        </Grid>
        <Footer />
      </Stack>
    </Stack>
  );
}

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
      color: "#187163",
      "&.Mui-selected": {
        color: "#FEA800",
      },
    },
  };
}

function MoView({
  institute,
  setDetails,
  createMockExam,
  details,
  Notificate,
  user,
  goal,
  isChange,
  addGoal,
  id,
  selectGoal,
  setSelectGoal,
  createPracticesExam,
  setGoalId,
  studentsPerformance,
  analysis,
  width,
  instituteDetails,
  isWaitingPra,
  isWaitingMock
}) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Paper
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MDNavBar
        user={user}
        goal={goal}
        selectGoal={selectGoal}
        setSelectGoal={setSelectGoal}
        isChange={isChange}
        addGoal={addGoal}
        id={id}
        setGoalId={setGoalId}
      />
      <Stack
        overflow={"scroll"}
        sx={{
          width: "100%",
          padding: "0px 10px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          className="scrollHide"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#FEA800",
            },
            width: "fit-content",
            overflowX: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab label="Tests" {...a11yProps(0)} />
          <Tab label="Scorecard" {...a11yProps(1)} />
          <Tab label="Analysis" {...a11yProps(2)} />
          <Tab label="Institute" {...a11yProps(3)} />
          {width > 600 ? null : selectGoal.plan == "free" ? (
            <Tab label="Subscribe" {...a11yProps(4)} />
          ) : null}
        </Tabs>
      </Stack>
      <CustomTabPanel value={value} index={0}>
        {selectGoal.length !== 0 ? (
          <PracticeTest
            MD={true}
            goal={goal}
            selectGoal={selectGoal}
            setSelectGoal={setSelectGoal}
            Notificate={Notificate}
            createPracticesExam={createPracticesExam}
            isWaitingPra={isWaitingPra}
           
          />
        ) : null}
        <MockTest
          MD={true}
          goal={goal}
          selectGoal={selectGoal}
          setSelectGoal={setSelectGoal}
          createMockExam={createMockExam}
    
          isWaitingMock={isWaitingMock}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {studentsPerformance && (
          <ScoreCard MD={true} studentsPerformance={studentsPerformance} />
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {analysis !== "" && <AnalysisCard MD={true} analysis={analysis} />}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <InstitutionCard
          MD={true}
          institute={institute}
          setDetails={setDetails}
          details={details}
          Notificate={Notificate}
          instituteDetails={instituteDetails}
        />
      </CustomTabPanel>

      {selectGoal.plan == "free" ? (
        <CustomTabPanel value={value} index={4}>
          <Payment Payment={selectGoal.Payment} Notificate={Notificate} />
        </CustomTabPanel>
      ) : null}
      <div style={{ marginTop: "auto" }}>
        <Footer />
      </div>
    </Paper>
  );
}
