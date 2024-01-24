import { Stack, Paper } from "@mui/material";
import useWindowDimensions from "../../../util/useWindowDimensions";
import ExamHeader from "./components/ExamHeader";
import ExamResultAction from "./components/ExamResultAction";
import ExamResultStat from "./components/ExamResultStat";
import ExamResultAnalytics from "./components/ExamResultAnalytics";
import LeaderBoard from "./components/LeaderBoard";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../../../util/Footer";
import { callProfileUrl } from "../../../util/callImageUrl";
export default function ExamResult() {
  const { search } = useLocation();
  const examID = search.split("=")[1];
  const { width } = useWindowDimensions();
  const [user, setUser] = useState([]);
  const [leaderBoardList, setLeaderBoardList] = useState([]);
  const [examResult, setExamResult] = useState([]);
  useEffect(() => {
    fetch(`/api/exam/get-exam-result/${examID}`)
      .then((res) => res.json())
      .then(async (data) => {
        setExamResult(data.examResult);
        data.userdetails.avatar = await callProfileUrl(data.userdetails.avatar);
        setUser(data.userdetails);
      });
    fetch(`/api/exam/rank/${examID}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.type !== "practice") {
         
         const getResult = await alignRank(data.rank,data.userID)
         
        if(getResult == 'success'){
          let getUserRank 
          let getUserMark 
           data.rank.map((task) => {
        if(task.userID.valueOf() == data.userID.valueOf()) {  
          getUserRank = (data.rank.length - data.rank.indexOf(task)  )
          getUserMark = task.mark
        }
          }) 
         await getListRank(data,examID,getUserRank,getUserMark)
        }
        }
      });
  }, [examID]);


const getListRank = (data,examID,getUserRank,getUserMark) => {

  fetch(`/api/exam/getListRank`,{
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body:JSON.stringify({data,examID,getUserRank,getUserMark})
  })
  .then((res) => res.json())
  .then( async (data) => {
 
     for(let i=0;i<data.rankList.length;i++){
          if(data.rankList[i].avatar !== '')
            data.rankList[i].avatar = await callProfileUrl(data.rankList[i].avatar)
          }
          setLeaderBoardList({
            rankList: data.rankList,
            userID: data.userID,
          });
  })
  .catch(error => console.log(error))

}

  function alignRank(ar,userID) {
    let i = 0,j;
    while (i < ar.length) {
      j = i + 1;
      while (j < ar.length) {
        if (ar[j].mark < ar[i].mark) {
          let temp = ar[i];
          ar[i] = ar[j];
          ar[j] = temp;
        }
        j++;
      }
      i++;
    }
    return 'success'
  }
  return (
    <Stack
      sx={{
        width: "100%",
        padding: width > 1024 ? "20px 20px" : "20px 10px",
        maxWidth: "1240px",

        backgroundColor: "#C5CFD3",
      }}
    >
      {width > 1024 ? (
        <DtView
          examResult={examResult}
          leaderBoardList={leaderBoardList}
          examID={examID}
          user={user}
        />
      ) : (
        <MobileView
          examResult={examResult}
          leaderBoardList={leaderBoardList}
          examID={examID}
          user={user}
        />
      )}
      <div style={{ marginTop: "20px" }}>
        <Footer />
      </div>
    </Stack>
  );
}

const DtView = ({ leaderBoardList, examResult, examID, user }) => {
  return (
    <Stack direction="column" spacing={2} width={"100%"}>
      <ExamHeader user={user} />
      <ExamResultAction examID={examID} type={examResult.type} />
      <Paper
        sx={{
          borderRadius: "20px",
          width: "100%",
          height: "calc(100vh - 250px)",
          padding: "20px",
          overflow: "hidden",
        }}
      >
        <Stack direction="row" sx={{ width: "100%" }} gap={2}>
          <Stack direction="column" sx={{ width: "100%" }} gap={2}>
            <ExamResultStat
              totalMark={examResult.totalMarks}
              mark={examResult.mark}
              attempted={examResult.questionAttempted}
              unAttempted={examResult.questionUnAttempted}
            />
            {examResult.topics && (
              <ExamResultAnalytics analyticsList={examResult.topics} />
            )}
          </Stack>
          {leaderBoardList.rankList && (
            <LeaderBoard leaderBoardList={leaderBoardList} />
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};

const MobileView = ({ leaderBoardList, examResult, examID, user }) => {
  return (
    <Stack direction="column" spacing={2}>
      <ExamHeader isMobileView={true} user={user} />
      <ExamResultAction examID={examID} type={examResult.type} />
      <Paper
        sx={{
          borderRadius: "20px",
          width: "100%",
          padding: "20px",
        }}
      >
        <ExamResultStat
          totalMark={examResult.totalMarks}
          mark={examResult.mark}
          attempted={examResult.questionAttempted}
          unAttempted={examResult.questionUnAttempted}
        />
      </Paper>
      {leaderBoardList.rankList && (
        <LeaderBoard leaderBoardList={leaderBoardList} isMobileView={true} />
      )}
      <Paper
        sx={{
          borderRadius: "20px",
          width: "100%",
          padding: "20px",
        }}
      >
        {examResult.topics && (
          <ExamResultAnalytics
            analyticsList={examResult.topics}
            isMobileView={true}
          />
        )}
      </Paper>
    </Stack>
  );
};
