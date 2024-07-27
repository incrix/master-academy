import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ScheduleTest from "./ScheduleTest";
import { useLocation } from "react-router-dom";
import History from "./History";
import Notification from "../../../../util/Alert";
import { IconButton, Stack } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Requests from "./Requests";
import Batch from "./Batch";
import { useNavigate } from "react-router-dom";
import { callProfileUrl } from "../../../../util/callImageUrl";

import LoadingButton from "@mui/lab/LoadingButton";
import Tooltip from "@mui/material/Tooltip";
import RefreshIcon from "@mui/icons-material/Refresh";

import Loader from '../../../../util/Loader'
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

export default function BatchFolder({}) {
  const { search } = useLocation();
  const id = search.split("=")[1];
  const [head, setHead] = useState([]);
  const [isPageLoading,setIsPageLoading] = useState(false)
  const [question, setQuestion] = useState({
    avalibleQues: [],
    batchQues: [],
  });

  let date = new Date();
  let indianTime = date.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });

  const [details, setDetails] = useState({
    // setDate: indianTime,
    setDate:date,
    setTimeFrom: "0:0",
    setTimeTo: "0:0",
    setMark: "",
    setNegativeMark: "0",
    setExamTitle: "",
    examDuration: "0",
  });
  const [batch, setBatch] = useState([]);
  const [value, setValue] = useState(0);
  const [isChange, setChange] = useState(false);
  const [isCall, setCall] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setLoading] = useState([]);
  const [notificate, setNotification] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const deleteBatchTopic = () => {
    setChange(!isChange);
  };

  const getHistory = () => {
    setIsPageLoading(true)
    fetch("/api/admin/getHistory", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.status == "ok") {
          setHistory(data.history);
          setHead(data.head);
          // change ascending order

          // let numArray = [];
          // let order = []
          // data.message.studentList.map(task => numArray.push(task.rollNumber))

          // let i = 0, j;
          // while (i < numArray.length) {
          //     j = i + 1;
          //     while (j < numArray.length) {

          //         if (eval(numArray[j]) < eval(numArray[i])) {
          //             let temp = numArray[i];
          //             numArray[i] = numArray[j];
          //             numArray[j] = temp;
          //         }
          //         j++;
          //     }
          //     i++;
          // }
          // const ascending = numArray
          // ascending.map(task =>{
          //   data.message.studentList.map(roll =>{
          //     if(task == roll.rollNumber)
          //     order.push(roll)
          //   })
          // })
          // const clearduplicate = order.filter((task,index) => order.indexOf(task) == index)
          // data.message.studentList = []
          // data.message.studentList = clearduplicate
          let numArray = [];
          let order = [];
          data.message.studentList.map((task) =>
            numArray.push(task.rollNumber)
          );
          const ascending = numArray.sort();
          ascending.map((task) => {
            data.message.studentList.map((roll) => {
              if (task == roll.rollNumber) order.push(roll);
            });
          });
          const clearduplicate = order.filter(
            (task, index) => order.indexOf(task) == index
          );
          data.message.studentList = [];
          data.message.studentList = clearduplicate;

          /// change student images
          //   let listCount =[]
          for (let i = 0; i < data.message.studentList.length; i++) {
            data.message.studentList[i].avatar = await callProfileUrl(
              data.message.studentList[i].avatar
            );
          }
          //  if(listCount.length == data.message.studentList.length)

          setBatch(data.message);
          setIsPageLoading(false)
        }
      });
  };

  const getRequestAccess = (status, data) => {
    fetch("/api/admin/getRequestAccess", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id, status, data }),
    })
      .then((res) => res.json())
      .then((data1) => {
        setLoading((preValue) => {
          let getValue = preValue;
          getValue = [
            ...getValue.filter(
              (task) => task.valueOf() !== data.userID.valueOf()
            ),
          ];
          return getValue;
        });
        getHistory();
        Notificate(data1.status, data1.message);
      });
  };
  useEffect(() => {
    getHistory();
  }, [isCall]);

  const Notificate = (status, message) => {
    setSeverity(status);
    setMessage(message);
    setNotification(true);
  };

  return (
    isPageLoading ? <Loader /> :
    <Paper
      sx={{
        width: "100%",
        height: "calc(100vh - 120px)",
        padding: "0 20px",
        margin: "20px 0",
        overflow: "scroll",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {head.avatar == undefined ? null : (
        <BatchHead
          task={head}
          institionID={batch.institutionID}
          isCall={isCall}
          setCall={setCall}
        />
      )}

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
          <Tab label="Batch" {...a11yProps(0)} />
          <Tab label="Schedule Test" {...a11yProps(1)} />
          <Tab label="Requests" {...a11yProps(2)} />
          <Tab label="History" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {batch.length !== 0 ? (
          <Batch
            batch={batch}
            getRequestAccess={getRequestAccess}
            isLoading={isLoading}
            setLoading={setLoading}
          />
        ) : null}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1} sx={{ height: "100vh" }}>
        <ScheduleTest
          question={question}
          setChange={setChange}
          isChange={isChange}
          deleteBatchTopic={deleteBatchTopic}
          setQuestion={setQuestion}
          details={details}
          setDetails={setDetails}
          Notificate={Notificate}
          setCall={setCall}
          isCall={isCall}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Requests
          batch={batch}
          getRequestAccess={getRequestAccess}
          isLoading={isLoading}
          setLoading={setLoading}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <History batch={batch} history={history} Notificate={Notificate}    setCall={setCall}
          isCall={isCall} />
      </CustomTabPanel>
      <Notification
        setNotification={setNotification}
        notificate={notificate}
        message={message}
        severity={severity}
      />
    </Paper>
  );
}

const BatchHead = ({ task, institionID, setCall, isCall }) => {
  const text = task.batchCode;
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const clickCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const style = {
    image: {
      width: "40px",
      height: " 40px",
    },
    title: {
      color: "#000",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
    },
    batchName: {
      marginLeft: "auto",
      color: " #FEA800",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
    },
    batchCode: {
      color: "#187163",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
    },
    copyIcon: {
      width: "15px",
      height: "15px",
      color: "#187163",
    },
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ padding: "10px", height: "80px" }}
    >
      <Stack
        display="flex"
        gap="30px"
        flexDirection="row"
        justifyContent="center"
      >
        <Stack direction="row" alignItems="center" spacing="15px">
          <p
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate(`/admin/institution/page?=${institionID}`);
            }}
          >
            Institution
          </p>
          <p style={{ fontSize: "20px" }}>{">"}</p>
          <p style={{ ...style.batchName, marginLeft: "20px" }}>
            {task.batchName}
          </p>
        </Stack>
        {refresh ? (
          <LoadingButton
            loading
            sx={{
              width: "20px",
              height: "40px",
              margin: "0",
              padding: "0",
              minWidth: "20px",
              backgroundColor: "white",
              "& .MuiCircularProgress-root": { color: "#187163" },
            }}
          />
        ) : (
          <IconButton
            onClick={() => {
              setCall(!isCall);
              setRefresh(true);
              setTimeout(() => {
                setRefresh(false);
              }, 1000);
            }}
            sx={{
              width: "20px",
              height: "40px",
              ":hover": {
                background: "none",
              },
            }}
          >
            <Tooltip title="Refresh">
              <RefreshIcon sx={{ color: "#187163" }} />
            </Tooltip>
          </IconButton>
        )}
      </Stack>
      <Stack direction="column" justifyContent="center" spacing="10px">
        <Stack direction="row" alignItems="center" spacing="5px">
          <div>
            <span>Batch code :</span>{" "}
            <span style={style.batchCode}>{task.batchCode}</span>{" "}
          </div>
          <SvgIcon
            onClick={clickCopy}
            sx={style.copyIcon}
            component={FileCopyIcon}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
