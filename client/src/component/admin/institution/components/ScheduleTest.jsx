import { Button, Icon, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SetQuestion from "./SetQuestion";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useLocation } from "react-router-dom";
import AddTopic from "./AddTopic";
import dayjs from "dayjs";
import "../../../../App.css";
export default function ScheduleTest({
  setQuestion,
  question,
  details,
  setDetails,
  deleteBatchTopic,
  setChange,
  isChange,
  Notificate,
}) {
  console.log(details);
  const [task, setTask] = useState([]);
  const { search } = useLocation();
  const id = search.split("=")[1];
  const getBank = () => {
    fetch("/api/admin/getBatechTopic", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status == "success") {
          const check = [];
          const send = [];
          if (question.batchQues == 0) setTask(data.message);
          else {
            console.log("call");
            question.batchQues.map((task) => check.push(task._id.valueOf()));
            data.message.map((task) => {
              if (check.indexOf(task._id.valueOf()) == -1) send.push(task);
            });
            setTask(send);
          }
        }
      });
  };

  const saveChangeBatch = () => {
    const check = [];
    if (question.batchQues !== undefined) {
      if( details.setNegativeMark !== "" ){
      if (details.examDuration !== "0" && details.examDuration !== "") {
        if (details.setExamTitle !== "") {
          question.batchQues.map((task) => {
            if (
              task.level.easy == "" ||
              task.level.medium == "" ||
              task.level.hard == ""
            )
              check.push(task);
          });

          if (details.setMark == "0" || details.setMark == "")
            Notificate("info", "Please set the Mark");
          else if (details.setTimeFrom !== details.setTimeTo) {
            if (question.batchQues.length == 0)
              Notificate("info", "Please choose topic");
            else if (check.length !== 0)
              Notificate("info", "Please fill the level");
            else {
              fetch("/api/admin/createScheduleExam", {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify({ type:'schedule',id: id, data:question.batchQues,details:details}),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.status == "success") Notificate(data.status, data.message);
                });
            }
          } else Notificate("info", "Please check from time and to time");
        } else Notificate("info", "Please type exam title");
      } else Notificate("info", "Please enter exam duration");
    }
    else Notificate("info", "Please enter negative mark duration");
    }
  };

  const createBank = (data) => {
    console.log(data);

    setQuestion((preValue) => {
      const getValue = { ...preValue };
      const avalibleQues = getValue.avalibleQues;
      avalibleQues.push(data);
      getValue.avalibleQues = avalibleQues;
      getValue.batchQues.push({
        title: data.title,
        _id: data._id,
        level: {
          easy: "0",
          medium: "0",
          hard: "0",
        },
      });
      return getValue;
    });
    getBank();

  };

  useEffect(() => {
    getBank();
  }, [isChange]);

  return (
    <div>
      <Stack direction="row" sx={{ marginTop: "10px" }}>
        <Button
          sx={{
            width: "100px",
            height: "30px",
            fontSize: "14px",
            background: "#187163",
            color: "white",
            marginLeft: "auto",
            transformText: "lowercase",
            "&:hover": {
              backgroundColor: "#185C52",
            },
          }}
          onClick={saveChangeBatch}
        >
          Save
        </Button>
      </Stack>
      {details.setMark !== undefined ? (
        <SetDetailsExam setDetails={setDetails} details={details} />
      ) : null}
      <div style={{ marginTop: "20px" }}>
        <AddTopic createBank={createBank} task={task} question={question} />
      </div>
      <div
        className="scrollHide"
        style={{ height: "60vh", overflowY: "scroll" }}
      >
        {question.batchQues.length !== 0 ? (
          question.batchQues.map((task, index) => {
            return question.avalibleQues.map((avalible, avalibleIndex) => {
              if (task._id == avalible._id) {
                return (
                  <SetQuestion
                    deleteBatchTopic={deleteBatchTopic}
                    key={index}
                    avalibleIndex={avalibleIndex}
                    task={task}
                    index={index}
                    avalible={avalible}
                    setQuestion={setQuestion}
                  />
                );
              }
            });
          })
        ) : (
          <div
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
            {" "}
            Add Question{" "}
          </div>
        )}
      </div>
    </div>
  );
}

const SetDetailsExam = ({ setDetails, details }) => {
  const [from, setFromValue] = useState(
    dayjs(`2022-04-17T${details.setTimeFrom}`)
  );
  const [to, setToValue] = useState(dayjs(`2022-04-17T${details.setTimeTo}`));
  const [date, setDate] = useState(new Date());
  const handleChange = (e) => {
    console.log(e.$d);
    const date = new Date(e.$d);
    var finaldate =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    setDetails((preValue) => {
      const getValue = { ...preValue };
      getValue.setDate = e.$d;
      return getValue;
    });
  };
  const handleFromTimeChange = (e) => {
    const date = new Date(e.$d);
    var setTimeFrom = date.getHours() + ":" + date.getMinutes();

    console.log(`2022-04-17T${setTimeFrom}`);

    setDetails((preValue) => {
      const getValue = { ...preValue };
      getValue.setTimeFrom = setTimeFrom;
      return getValue;
    });
  };

  const handleToTimeChange = (e) => {
    const date = new Date(e.$d);
    var setTimeTo = date.getHours() + ":" + date.getMinutes();

    console.log(`2022-04-17T${setTimeTo}`);

    setDetails((preValue) => {
      const getValue = { ...preValue };
      getValue.setTimeTo = setTimeTo;
      return getValue;
    });
  };

  const handleMark = (e) => {
    if (e.target.value >= 0)
      setDetails((preValue) => {
        const getValue = { ...preValue };
        getValue.setMark = e.target.value;
        return getValue;
      });
  };
  const handleNegative = (e) => {
    console.log(date);
    if (e.target.value >= 0)
      setDetails((preValue) => {
        const getValue = { ...preValue };
        getValue.setNegativeMark = e.target.value;
        return getValue;
      });
  };

  const handleSetExamTitle = (e) => {
    setDetails((preValue) => {
      const getValue = { ...preValue };
      getValue.setExamTitle = e.target.value;
      return getValue;
    });
  };

  const handleExamDuration = (e) => {
    if (e.target.value >= 0)
      setDetails((preValue) => {
        const getValue = { ...preValue };
        getValue.examDuration = e.target.value;
        return getValue;
      });
  };

  return (
    <Stack>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={[]}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
            overflow: "hidden",
            flexWrap: "wrap",
            "::-webkit-scrollbar": {
              display: "none",
            },
            "@media (min-width: 580px)": {
              flexDirection: "row",

              overflowX: "scroll",
              alignItems: "center",
              webkitAlignItems: "center",
              webkitFlexDirection: "row",
              webkitBoxAlign: "center",
            },
          }}
        >
          <TextField
            type="text"
            value={details.setExamTitle}
            sx={{
              background: "#FFF",
              "&:hover fieldset": {
                border: "1px solid #187163!important",
              },
              "&:focus-within fieldset, &:focus-visible fieldset": {
                border: "1px solid #187163!important",
              },
            }}
            onChange={handleSetExamTitle}
            label="Exam title"
          />

          <MobileDatePicker
            label="select date"
            defaultValue={
              details.setDate == "0" ? dayjs(date) : dayjs(details.setDate)
            }
            sx={{
              background: "#FFF",
              "&:hover fieldset": {
                border: "1px solid #187163!important",
              },
              "&:focus-within fieldset, &:focus-visible fieldset": {
                border: "1px solid #187163!important",
              },
            }}
            onChange={handleChange}
          />

          <TimePicker
            label="Time from"
            value={from}
            onChange={handleFromTimeChange}
            sx={{
              background: "#FFF",
              "&:hover fieldset": {
                border: "1px solid #187163!important",
              },
              "&:focus-within fieldset, &:focus-visible fieldset": {
                border: "1px solid #187163!important",
              },
            }}
          />
          <TimePicker
            label="Time to"
            value={to}
            onChange={handleToTimeChange}
            sx={{
              background: "#FFF",
              "&:hover fieldset": {
                border: "1px solid #187163!important",
              },
              "&:focus-within fieldset, &:focus-visible fieldset": {
                border: "1px solid #187163!important",
              },
            }}
          />
          <TextField
            type="Number"
            value={details.setMark}
            sx={{
              background: "#FFF",
              "&:hover fieldset": {
                border: "1px solid #187163!important",
              },
              "&:focus-within fieldset, &:focus-visible fieldset": {
                border: "1px solid #187163!important",
              },
            }}
            label="Mark per question"
            placeholder="Enter Mark"
            onChange={handleMark}
          />

          <TextField
            type="Number"
            value={details.setNegativeMark}
            sx={{
              background: "#FFF",
              "&:hover fieldset": {
                border: "1px solid #187163!important",
              },
              "&:focus-within fieldset, &:focus-visible fieldset": {
                border: "1px solid #187163!important",
              },
            }}
            onChange={handleNegative}
            label="Negative mark "
            placeholder="Enter Mark"
          />

          <TextField
            type="number"
            value={details.examDuration}
            sx={{
              background: "#FFF",
              "&:hover fieldset": {
                border: "1px solid #187163!important",
              },
              "&:focus-within fieldset, &:focus-visible fieldset": {
                border: "1px solid #187163!important",
              },
            }}
            onChange={handleExamDuration}
            label="Exam Duration"
            placeholder="Enter minutes"
          />
        </DemoContainer>
      </LocalizationProvider>
    </Stack>
  );
};