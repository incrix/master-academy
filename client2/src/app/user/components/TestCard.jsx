import { Paper } from "@mui/material";
import PracticeTest from "./PracticeTest";
import MockTest from "./MockTest";

export default function TestCard(
{  selectGoal,
  setSelectGoal,
  Notificate,
  createMockExam,
  createPracticesExam,
  isWaitingPra,
  isWaitingMock,
}
) {
  
  return selectGoal && (
      <Paper
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          padding: "20px",
          margin: "20px 0",
        }}
      >
        <PracticeTest
          selectGoal={selectGoal}
          setSelectGoal={setSelectGoal}
          Notificate={Notificate}
          createPracticesExam={createPracticesExam}
          isWaitingPra={isWaitingPra}
        
        />
        <MockTest selectGoal={selectGoal} createMockExam={createMockExam} setSelectGoal={setSelectGoal}    
          isWaitingMock={isWaitingMock}/>
      </Paper>
    // )
  );
}
