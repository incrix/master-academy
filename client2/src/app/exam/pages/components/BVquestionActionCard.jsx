import { Paper, Stack, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { ExpandMore } from "@mui/icons-material";
export default function BVquestionActionCard({
  handleNextQuestion,
  handlePreviousQuestion,
  isMobileView,
  questionLength,
  currentQuestionIndex,
  toggleDrawer,
}) {
  const [count, setCount] = useState("");
  useEffect(() => {
    setCount(currentQuestionIndex == undefined ? 0 : currentQuestionIndex);
  }, [currentQuestionIndex]);

  return (
    <Paper
      sx={{
        padding: "20px 20px",
        height: "80px",
        width: "100%",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent={"center"}>
        <div style={{ width: "80px", height: "40px", marginRight: "auto" }}>
          {0 == count ? (
            ""
          ) : (
            <Button
              variant="contained"
              onClick={handlePreviousQuestion}
              sx={{
                width: "80px",
                height: "40px",
                textTransform: "none",
                backgroundColor: "#D1E3E0",
                color: "#187163",

                "&:hover": {
                  backgroundColor: "#D1E3E0",
                  color: "#187163",
                },
                border: "2px solid #187163",
              }}
            >
              Previous
            </Button>
          )}
        </div>
        <Button
          variant="text"
          onClick={toggleDrawer(true)}
          sx={{
            textAlign: "center",
            textTransform: "none",
            color: "#187163",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {`Q${currentQuestionIndex + 1} of ${questionLength}`}
          <ExpandMore sx={{ fontSize: "20px" }} />
        </Button>
        <div style={{ width: "60px", height: "40px", marginLeft: "auto" }}>
          {questionLength - 1 <= count ? (
            ""
          ) : (
            <Button
              variant="contained"
              onClick={handleNextQuestion}
              sx={{
                width: "60px",
                height: "40px",
                textTransform: "none",
                backgroundColor: "#187163",
                color: "#fff",

                "&:hover": {
                  backgroundColor: "#187163",
                  color: "#fff",
                },
                border: "2px solid #187163",
              }}
            >
              Next
            </Button>
          )}
        </div>
      </Stack>
    </Paper>
  );
}
