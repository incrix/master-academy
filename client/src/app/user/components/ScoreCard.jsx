import { Stack, Paper, Button } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useNavigate } from "react-router-dom";

export default function ScoreCard({
  studentsPerformance,
  scorecard = [
    {
      name: "Practice Test 2",
      score: 140,
      maxScore: 160,
      dateTime: "05:43PM 30 Jul 2023",
    },
    {
      name: "Mock Test 1",
      score: 50,
      maxScore: 100,
      dateTime: "05:43PM 30 Jul 2023",
    },
    {
      name: "Practice Test 1",
      score: 45,
      maxScore: 120,
      dateTime: "05:43PM 30 Jul 2023",
    },
    {
      name: "Practice Test 1",
      score: 45,
      maxScore: 120,
      dateTime: "05:43PM 30 Jul 2023",
    },
  ], MD
}) 

{
console.log(studentsPerformance)
  return (
    <Paper
      elevation={MD ? 0 : 2}
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        padding: "20px",
        marginTop: "20px",
      }}
    >
      {MD ? 
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "400",
          color: "#656565",
          marginBottom: "10px",
        }}
      >
        History
      </h3>
       :<h3>Scorecard</h3>}
      <Stack
        overflow={"scroll"}
        height= {MD? "100%":"300px"}
        direction="column"
        gap={2}
        p={0.5}
        marginTop={2}
        className="scrollHide"
      >
        {studentsPerformance.map((item, index) => (
          <ScoreCardItem key={index} {...item} />
        ))}
      </Stack>
    </Paper>
  );
}

function ScoreCardItem({ examName , score, totalMarks , date, examId }) {
  const navigate = useNavigate();
  const scorePercentage = (score / totalMarks) * 100;
  return (
    <Paper
      sx={{
        borderRadius: "20px",
        padding: "10px 20px",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={1}
      >
        <h4>{examName}</h4>
        <h4>{date}</h4>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap={2}>
          <LinearProgress
            variant="determinate"
            value={scorePercentage}
            sx={{
              height: "10px",
              width: {
                xs: "100px",                
                sm: "300px",
                md: "200px",
                ml: "200px",
                lg: "280px",
              },
              borderRadius: "10px",
              [`&.${linearProgressClasses.colorPrimary}`]: {
                backgroundColor:
                  scorePercentage < 50
                    ? "#F33B1240"
                    : scorePercentage >= 50 && scorePercentage < 80
                    ? "#FEA80040"
                    : "#128E2E40",
              },
              [`& .${linearProgressClasses.bar}`]: {
                borderRadius: 10,
                backgroundColor:
                  scorePercentage < 50
                    ? "#F33B12"
                    : scorePercentage >= 50 && scorePercentage < 80
                    ? "#FEA800"
                    : "#187163",
              },
            }}
          />
          <div>
            {score}/{totalMarks}
          </div>
        </Stack>
        <Button
          variant="contained"
          onClick={() => {
            navigate(`/exam/result?=${examId}`);
          }}
          sx={{
            textTransform: "none",
            backgroundColor:
              scorePercentage < 50
                ? "#F33B12"
                : scorePercentage >= 50 && scorePercentage < 80
                ? "#FEA800"
                : "#187163",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#187163",
              color: "#fff",
            },
            zIndex: "1",
          }}
        >
          View Result
        </Button>
      </Stack>
    </Paper>
  );
}
