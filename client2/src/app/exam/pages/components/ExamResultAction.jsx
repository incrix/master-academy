import { Paper, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function ExamResultAction({examID,type}) {
  const navigate = useNavigate()
  return (
    <Paper sx={{
        borderRadius: "20px",
    }}>
      <Stack
        direction="row"
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"30px 20px"}
        borderRadius={"20px"}
      >
        <Stack direction="column" gap={0.5}>
          <h1 style={{
            fontSize: "20px",
            fontWeight: "bold",
            margin: "0",
            padding: "0",
          }}>Exam Result</h1>
          <p style={{
            fontSize: "14px",
            margin: "0",
            padding: "0",
            color: "#787486",
          }}>Exam Result</p>
        </Stack>
        {
          type == 'schedule' ? 
        null:
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#187163",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#187163",
              color: "#fff",
            },
            border: "2px solid #187163",
          }}
          onClick={() => {navigate(`/exam/solution?=${examID}`)}}
        >
          View Solutions
        </Button>

}
      </Stack>
    </Paper>
  );
}

