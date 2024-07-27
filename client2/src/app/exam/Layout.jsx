import ExamInfo from "./pages/ExamInfo";
import ExamState from "./pages/ExamState";
import ExamResult from "./pages/ExamResult";
import { useState, useEffect } from "react";
import { Stack } from "@mui/material";
import ResultSolution from "./pages/components/ResultSolution";
import Footer from "../../util/Footer";
import useWindowDimensions from "../../util/useWindowDimensions";
export default function Exam() {
  const path = window.location.pathname;
  window.oncontextmenu = () => {
    return false;
  };
  const {width} = useWindowDimensions()
  let h = window.innerHeight;
  let w = window.innerWidth;

  // window.addEventListener("beforeunload", (ev) => {
  //   ev.preventDefault();
  //   return (ev.returnValue = "Are you sure you want to close?");
  // });

  window.onresize = () => {
    if (h !== window.innerHeight || w !== window.innerWidth) {
    }
  };

  const disableTextSelection = {
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    width: "100%",
    height: "100vh",
    overFlow: "hidden",
    background: "#C5CFD3",
  };

  return (
    <Stack style={disableTextSelection}>
      <Stack
        direction="column"
        alignItems="center"
        sx={{ backgroundColor: "#C5CFD3"}}
     padding={'5px'}
      >
        {path === "/exam/info" && <ExamInfo />}
        {path === "/exam/state" && <ExamState />}
        {/* {examInfo == null ? null : path === "/exam/state" && <ExamState exam={examInfo}/>} */}
        {path === "/exam/result" && <ExamResult />}
        {path === "/exam/solution" && <ResultSolution />}
        {/* {path === "/exam/result" ? 
        <div style={{width: '80%',height:'100%'}}>
        <Footer />
        </div>
 : null} */}
       
      </Stack>
    </Stack>
  );
}
