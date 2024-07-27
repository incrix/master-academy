import { Paper, Stack, Chip, IconButton, Radio } from "@mui/material";
import { useState } from "react";
import { Refresh, BookmarkAddOutlined, Bookmark } from "@mui/icons-material";

export default function QuestionStateCard({
  index,
  mark,
  negativeMark,
  question,
  answer,
  imageUrl,
  setAnswer,
  isCorrect,
  isResult,
  isAnswered,
  isAnsweredCorrectly,
  isBookmarked,
  handleOptionClick,
  handleBookmarkClick,
  optionList,
  studentAnswers,
  isMobileView,
  clearAnswers
}) {
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        borderRadius: isMobileView ? "0px" : "20px",
        gap: "15px",
      }}
      elevation={isMobileView ? 0 : 2}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        {isMobileView ? (
          <div></div>
        ) : (
          <h1
            style={{
              fontSize: isMobileView ? "1rem" : "1.5rem",
            }}
          >
            Question {index + 1}
          </h1>
        )}
        <Stack direction="row" alignContent="center" spacing={2}>
          <Chip
            label={`+${mark} marks`}
            sx={{
              backgroundColor: "#D1E3E0",
              color: "#187163",
              borderRadius: "2px",
              padding: "0",
              margin: "0",
              fontSize: isMobileView ? "0.7rem" : "0.8rem",
            }}
            variant="contained"
          />
          <Chip
            label={`-${negativeMark} marks`}
            sx={{
              backgroundColor: "#FFEECC",
              color: "#FEA800",
              padding: "0",
              borderRadius: "2px",
              margin: "0",
              fontSize: isMobileView ? "0.7rem" : "0.8rem",
            }}
            variant="contained"
          />
          <IconButton
            title="bookmark"
            onClick={handleBookmarkClick}
            sx={{
              color: "#187163",
              width: "30px",
              height: "30px",
            }}
          >
            {isBookmarked ? <Bookmark /> : <BookmarkAddOutlined />}
          </IconButton>
          <IconButton
            title="clear"
            onClick={clearAnswers}
            sx={{
              color: "#187163",
              width: "30px",
              height: "30px",
            }}
          >
            <Refresh />
          </IconButton>
        </Stack>
      </Stack>
      <Stack
        gap={2}
        height={"100%"}
        maxHeight={"calc(100vh - 300px)"}
        sx={{
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
            width: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#187163",
            borderRadius: "5px",
          },
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "500",
          }}
        >
          {question}
        </h2>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="question"
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "300px",
              objectFit: "contain",
            }}
          />
        )}
        <Options
          options={optionList}
          answer={answer}
          setAnswer={setAnswer}
          isCorrect={isCorrect}
          isResult={isResult}
          isAnswered={isAnswered}
          isAnsweredCorrectly={isAnsweredCorrectly}
          handleOptionClick={handleOptionClick}
          studentAnswers={studentAnswers}
        />
      </Stack>
    </Paper>
  );
}

const Options = ({
  options,
  answer,
  setAnswer,
  isCorrect,
  isResult,
  isAnswered,
  isAnsweredCorrectly,
  handleOptionClick,
  studentAnswers,
}) => {
  return (
    <Stack direction="column" spacing={1}>
      {options.map((option, index) => (
        <Stack key={index} direction="row" alignItems="center" spacing={1}>
          <Radio
            checked={studentAnswers === index}
            onChange={() => handleOptionClick(index)}
            disabled={isResult}
          />
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "normal",
            }}
          >
            {option}
          </h3>
        </Stack>
      ))}
    </Stack>
  );
};
