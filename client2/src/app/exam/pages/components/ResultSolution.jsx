import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Paper, Stack } from "@mui/material";
import ExamHeader from "./ExamHeader";
import Loader from "../../../../util/Loader";
import Choose from "./Choose";
import "../../../../App.css";
import useWindowDimensions from "../../../../util/useWindowDimensions";
import { callProfileUrl } from "../../../../util/callImageUrl";
export default function ResultSolution() {
  const { search } = useLocation();
  const examID = search.split("=")[1];
  const [user, setUser] = useState([]);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  setLoading(true)
    fetch(`/api/exam/solution/${examID}`)
      .then((res) => res.json())
      .then(async(data) => {
        setResult(data);
        data.userdetails.avatar = await callProfileUrl(data.userdetails.avatar)
        setUser(data.userdetails);
        setLoading(false)
      });
  }, []);
  return loading == true ? (
    <Loader />) :
  (
    <div
      style={{
        width: "90%",
        height: "95vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "center",
      }}
    >
      <ExamHeader user={user} />
      <div
        // className="scrollHide"
        style={{
          width: "100%",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflowY: "scroll",
        }}
      >
        {result.length !== 0
          ? result.questions.map((task, index) => (
              <Solution
                key={index}
                index={index}
                actualAns={result.actualAns}
                studentAns={result.studentAns}
                question={task.question}
                options={task.options}
                imageUrl={task.imageUrl}
                type={task.type}
                expalanationImage={task.expalanationImage}
                explanation={task.explanation}
              />
            ))
          : null}
      </div>
    </div>
  );
}

const Solution = ({
  question,
  type,
  options,
  actualAns,
  studentAns,
  imageUrl,
  index,
  expalanationImage,
  explanation,
}) => {
  const { width } = useWindowDimensions();
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "20px",
        width: "100%",
      }}
      elevation={3}
    >
      <p style={{ fontWeight: "400", fontSize: "18px" }}>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>
          {" "}
          {index + 1} .{" "}
        </span>
        {question}
      </p>
      {imageUrl !== "" ? (
        <div>
          <p style={{ fontWeight: "700", fontSize: "16px" }}>
            Question Image :
          </p>
          <center>
            <img
              style={{
                width: width < 500 ? "300px" : "400px",
                height: width < 500 ? "250px" : "200px",
              }}
              src={imageUrl}
              alt=""
            />
          </center>
        </div>
      ) : null}

      <Stack>
        {options.map((task, opIndex) => (
          <Choose
            key={opIndex}
            option={task}
            studentAns={studentAns}
            actualAns={actualAns}
            index={index}
            opIndex={opIndex}
          />
        ))}
      </Stack>
      {expalanationImage !== "" ? (
        <div>
          <p style={{ fontWeight: "700", fontSize: "16px" }}>
            Explanation Image :
          </p>
          <center>
            <img
              style={{
                width: width < 500 ? "300px" : "400px",
                height: width < 500 ? "250px" : "200px",
              }}
              src={expalanationImage}
              alt=""
            />
          </center>
        </div>
      ) : null}

      {explanation !== "" ? (
        <div>
          <p style={{ fontWeight: "700", fontSize: "16px" }}>Explanation :</p>
          <p>{explanation}</p>
        </div>
      ) : null}
    </Paper>
  );
};
