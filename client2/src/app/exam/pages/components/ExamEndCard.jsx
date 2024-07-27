import { Paper, Stack, Button } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import BVquestionActionCard from "./BVquestionActionCard";
export default function ExamEndCard({
  title,
  isMobileView,
  toggleDrawer,
  questionLength,
  handleDialogOpen,
  handleNextQuestion,
  handlePreviousQuestion,
  currentQuestionIndex
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        height: isMobileView ? "60px" : "70px",
        borderRadius: isMobileView ? 0 : "20px",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          padding: isMobileView ? "0 0" : "10px 30px",
          height: isMobileView ? "50px" : "70px",
        }}
      >
        {!isMobileView ? (
          <h2
            style={{
              fontWeight: "500",
              fontSize: "20px",
            }}
          >
            {title}
          </h2>
        ) : (
          <BVquestionActionCard 
          handleNextQuestion={handleNextQuestion}
          handlePreviousQuestion={handlePreviousQuestion}
          isMobileView={true}
          questionLength={questionLength}
          currentQuestionIndex={currentQuestionIndex == undefined ? 0 : currentQuestionIndex}
          toggleDrawer={toggleDrawer}
          />
       
        )}
        {!isMobileView ? (
          <Button
            variant="contained"
            onClick={handleDialogOpen}
            sx={{
              textTransform: "none",
              backgroundColor: "#187163",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#187163",
                color: "#fff",
              },
            }}
          >
            End Test
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}
