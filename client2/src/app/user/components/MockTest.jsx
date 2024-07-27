import { Paper, Stack, Button } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
export default function MockTest({ MD,selectGoal,createMockExam, isWaitingMock} ) {

   
  const handleStartMock = () =>{
    createMockExam(selectGoal)
  }

  return (
    <Paper
      elevation={MD ? 0 : 2}
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      <h3
        style={{
          fontSize: MD ? "18px" : "22px",
          fontWeight: "600",
          color: "#656565",
          marginBottom: "10px",
        }}
      >
        Mock Test Series
      </h3>
      <h4
        style={{
          fontSize: MD ? "16px" : "18px",
          fontWeight: "400",
          color: "#656565",
          marginBottom: "10px",
        }}
      >
       {selectGoal.courseName}
      </h4>
      <Stack direction="row" justifyContent="space-between" margin={"20px 0"}>
        <div>
          <div
            style={{
              fontSize: MD ? "16px" : "18px",
              fontWeight: "500",
              color: "#187163",
              marginBottom: "5px",
            }}
          >
            Time allowed
          </div>
          <div
            style={{
              fontSize: MD ? "18px" : "22px",
              fontWeight: "600",
              marginBottom: "5px",
            }}
          >
            {selectGoal.duration} Mins
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: MD ? "16px" : "18px",
              fontWeight: "500",
              color: "#187163",
              marginBottom: "5px",
            }}
          >
            No of Questions
          </div>
          <div
            style={{
              fontSize: MD ? "18px" : "22px",
              fontWeight: "600",
              marginBottom: "5px",
            }}
          >
            {selectGoal.noOfQuestion}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: MD ? "16px" : "18px",
              fontWeight: "500",
              color: "#187163",
              marginBottom: "5px",
            }}
          >
            Total Marks
          </div>
          <div
            style={{
              fontSize: MD ? "18px" : "22px",
              fontWeight: "600",
              marginBottom: "5px",
            }}
          >
           {selectGoal.totalMArk}
          </div>
        </div>
      </Stack>
      {
        isWaitingMock ? <LoadingButton loading   sx={{ width:'100%',height:'40px' ,backgroundColor:"#187163", "& .MuiCircularProgress-root": { color: "white", } }} />
     :
      <Button
        variant="contained"
        fullWidth
        sx={{
          textTransform: "none",
          backgroundColor: "#187163",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#187163",
            color: "#fff",
          },
          padding: "10px",
        }}
        onClick={handleStartMock}
      >
        Start Mock
      </Button>
       }
    </Paper>
  );
}
