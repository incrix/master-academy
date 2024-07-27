import { Paper, Stack, Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function QuestionActionCard({
  handleNextQuestion,
  handlePreviousQuestion,
  isMobileView,
  questionLength,
  currentQuestionIndex
}) {
  
  const [count,setCount] = useState(currentQuestionIndex == undefined ? 0 : currentQuestionIndex)
useEffect(()=>{
  setCount(currentQuestionIndex == undefined ? 0 : currentQuestionIndex)
},[currentQuestionIndex]) 

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "20px 20px",
        borderRadius: isMobileView ? 0 : "20px",
        height: "80px",
        margin: isMobileView ? "30px" : 0,
      }}
    >
      <Stack direction="row" alignItems="center" >
    
  { 0 == count ? null : 
        <Button
          variant="contained"
          onClick={handlePreviousQuestion}
          sx={{
            textTransform: "none",
            backgroundColor: "#D1E3E0",
            color: "#187163",
            marginRight:'auto',
            "&:hover": {
              backgroundColor: "#D1E3E0",
              color: "#187163",
            },
            border: "2px solid #187163",
          }}
        >
          Previous
        </Button>
        }
{questionLength-1 == count ? 
        null
      :
      <Button
      variant="contained"
      onClick={handleNextQuestion}
      sx={{
        textTransform: "none",
        backgroundColor: "#187163",
        color: "#fff",
        marginLeft:'auto',
        "&:hover": {
          backgroundColor: "#187163",
          color: "#fff",
        },
        border: "2px solid #187163",
      }}
    >
      Next
    </Button>
      }
      </Stack>
    </Paper>
  );
}
