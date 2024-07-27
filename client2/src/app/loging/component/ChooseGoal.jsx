import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Image from "../../../util/Avater";
import LoadingButton from "@mui/lab/LoadingButton";
import "../../../App.css";
import useWindowDimensions from "../../../util/useWindowDimensions";
export default function ChooseGoal({ controlNotification }) {
  const { width } = useWindowDimensions();

  const navigator = useNavigate();

  const [isWaitVerify, setWatiVerify] = useState(false);
  const [goal, setGoal] = useState([]);

  useEffect(() => {
    fetch("/api/user/getCourse")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ok") {
          setGoal(data.message);
          setGoal((preValu) => {
            const getValue = [...preValu];
            getValue.map((task) => (task.isSelect = false));
            return getValue;
          });
        }
      });
  }, []);
  const finish = () => {
    const check = [];
    const check2 = [];
    goal.map((task) => {
      if (task.isSelect == false) check.push(task);
      else check2.push(task);
    });
    if (goal.length == check.length)
      controlNotification("info", "Please choose goal");
    else {
      setWatiVerify(true);
      fetch("/api/user/chooseGoal", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ goal: check2 }),
      })
        .then((res) => res.json())
        .then((data) => {
          controlNotification(data.status, data.message);
          if (data.status == "success") {
            fetch("/logout")
              .then((res) => res.json())
              .then((data) => {
                if (data.status == "logout") {
                  navigator("/login");
                  setWatiVerify(false);
                }
              });
          }
        });
    }
  };
  const style = {
    heading: {
      color: "#000",
      fontFamily: " DM Sans",
      fontSize: " 25px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: " normal",
    },
    scroll: {
      overflowY: "scroll",
      minHeight: width > 1000 ? "350px" : "310px",
    },
  };
  return (
    <Paper
      sx={{
        borderRadius: "7px",
        background: "#FFF",
        boxShadow: "0px 4px 14px 0px rgba(0, 0, 0, 0.15)",
        width: "423px",
        height: "500px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...(width < 1000 && {
          width: "80%",
          height: "443px",
        }),
      }}
    >
      <Stack
        direction="column"
        spacing="15px"
        width={width > 1000 ? "80%" : "90%"}
        height={width > 1000 ? "90%" : "90%"}
      >
        <h1 style={style.heading}>Select Goal</h1>
        <div className="scrollHide" style={style.scroll}>
          <Stack direction="column" spacing="10px">
            {goal.map((task, index) =>
              task.status == "publish" ? (
                <Stack
                  key={index}
                  direction="row"
                  spacing="10px"
                  alignItems="center"
                  padding="10px"
                  sx={{
                    borderRadius: "4px",
                    border: !task.isSelect
                      ? "1px solid #CDCDCD"
                      : "1px solid #187163",
                    background: "#FFF",
                  }}
                  onClick={() => {
                    const select = !task.isSelect;
                    setGoal((preValue) => {
                      const getValue = [...preValue];
                      getValue[index].isSelect = select;
                      return getValue;
                    });
                  }}
                >
                  <img src={Image.FileImage} alt="" />
                  <label htmlFor="">{task.title}</label>
                </Stack>
              ) : null
            )}
          </Stack>
        </div>

        {isWaitVerify ? (
          <LoadingButton
            loading
            sx={{
              width: "100%",
              height: "40px",
              backgroundColor: "#187163",
              "& .MuiCircularProgress-root": { color: "white" },
            }}
          />
        ) : (
          <Button
            style={{
              borderRadius: "4px",
              width: "100%",
              color: "white",
              background: "#187163",
              color: width < 1000 ? "#187163" : "white",
              background: width > 1000 ? "#187163" : "white",
            }}
            onClick={finish}
          >
            Finish
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
