import { Paper, Stack, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ScheduleTestCard({ batch }) {
  const style = {
    name: {
      color: " #000",
      marginBottom: "10px",
      fontFamily: "DM Sans",
      fontSize: "18px",
      fontStyle: " normal",
      fontWeight: "700",
      lineHeight: "normal",
    },
  };
  return (
    <Paper
      sx={{
        width: "100%",
        height: "200px",
        // maxHeight: "200px",
        overflowY: "scroll",
        "::-webkit-scrollbar": {
          display: "none",
        },
        padding: "10px 20px",
        "& .MuiPaper-root:hover, .MuiPaper-root:hover": {
          cursor: "default",
        },
      }}
    >
      {batch.map((task, index) => (
        <Stack key={index}>
          <p style={style.name}>{task.batchName}</p>
          {task.scheduleTest.length !== 0 ? (
            <div >
              {task.scheduleTest.map((task) => (
                <SheduleTest
                  name={task.name}
                  examID={task.examID}
                  key={index}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                height: "150px",
                fontWeight: "400",
                color: "gray",
              }}
            >
              No Active Test
            </div>
          )}
        </Stack>
      ))}
    </Paper>
  );
}

const SheduleTest = ({ name, examID }) => {
  const nevigator = useNavigate();
  const handleClick = () => {
    nevigator(`/exam/info?=${examID}`);
  };
  const style = {
    button: {
      textTransform: "none",
      background: "#187163",
      color: "white",
      cursor: "pointer",
      width: "20px",
    },
  };
  return (
    <Stack
    evaluation={2}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      borderRadius="15px"
      background="#FFF"
      boxShadow="0px 4px 15px 0px rgba(0, 0, 0, 0.10)"
      padding="10px"
      width="100%"
      height=" 70px"

     
    >
      <p style={{ fontWeight: "500" }}>{name}</p>
      <Button onClick={handleClick} style={style.button}>
        View
      </Button>
    </Stack>
  );
};
