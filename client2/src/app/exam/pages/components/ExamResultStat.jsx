import { Stack } from "@mui/material";

export default function ExamResultStat({
  totalMark,
  mark,
  attempted,
  unAttempted,
  isMobileView
}) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Stack
        direction="column"
        alignItems="center"
        sx={{ width: "100%" }}
        gap={1}
      >
        <h1
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            margin: "0",
            padding: "0",
          }}
        >
          Marks
        </h1>
        <p
          style={{
            fontSize: isMobileView ? "18px" : "24px",
            fontWeight: "500",
            margin: "0",
            padding: "0",
            color: "#187163",
          }}
        >
          {mark}/{totalMark}
        </p>
      </Stack>
      <Stack
        direction="column"
        alignItems="center"
        sx={{ width: "100%" }}
        gap={1}
      >
        <h1
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            margin: "0",
            padding: "0",
          }}
        >
          Attempted
        </h1>
        <p
          style={{
            fontSize: isMobileView ? "18px" : "24px",
            fontWeight: "500",
            margin: "0",
            padding: "0",
            color: "#187163",
          }}
        >
          {attempted}Q
        </p>
      </Stack>
      <Stack
        direction="column"
        alignItems="center"
        sx={{ width: "100%" }}
        gap={1}
      >
        <h1
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            margin: "0",
            padding: "0",
          }}
        >
          Unattempted
        </h1>
        <p
          style={{
            fontSize: isMobileView ? "18px" : "24px",
            fontWeight: "500",
            margin: "0",
            padding: "0",
            color: "#187163",
          }}
        >
          {unAttempted}Q
        </p>
      </Stack>
    </Stack>
  );
}
