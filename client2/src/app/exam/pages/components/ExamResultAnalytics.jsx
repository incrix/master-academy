import { Paper, Stack } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

export default function ExamResultAnalytics({analyticsList, isMobileView}) {
 
  return (
    <Stack direction="column" sx={{ width: "100%" }} spacing={2}>
      <h1
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          margin: "0",
          padding: "0",
        }}
      >
        Analytics
      </h1>
      <Stack
        className="scrollHide"
        direction="column"
        sx={{ width: "100%" }}
        gap={2}
        height= {!isMobileView ? "calc(100vh - 400px)" : "auto"}
        padding="0 2px 20px 2px"
        overflow="scroll"
      >
        {analyticsList.map((item, index) => (
          <ProgressCard key={index} title={item.topicName} value={item.accuracy} />
        ))}
      </Stack>
    </Stack>
  );
}

const ProgressCard = ({ title, value }) => {
 
  return (
    <Paper
      sx={{
        padding: "20px",
        borderRadius: "20px",
      }}
    >
      <Stack direction="column" sx={{ width: "100%" }} gap={1}>
        <h1
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            margin: "0",
            padding: "0",
          }}
        >
          {title}
        </h1>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%" }}
          gap={1}
        >
          <Stack sx={{ width: "100%" }}>
            <BorderLinearProgress variant="determinate" value={value} />
          </Stack>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#656565",
            }}
          >
            {Math.floor(value)}/100
          </p>
        </Stack>
      </Stack>
    </Paper>
  );
};

const BorderLinearProgress = (props) => {
  const value = props.value;
  return (
    <LinearProgress
      variant="determinate"
      {...props}
      width={"100%"}
      sx={{
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor:
            value > 79 ? "#C4E3CB" : value > 49 ? "#FFE9BF" : "#FCCEC4",
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor:
            value > 79 ? "#187163" : value > 49 ? "#FEA800" : "#F33B12",
        },
      }}
    />
  );
};
