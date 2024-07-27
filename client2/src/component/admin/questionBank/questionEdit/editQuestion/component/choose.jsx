import React from "react";
import Icon from "@mui/material/Icon";
import ClearIcon from "@mui/icons-material/Clear";
import ColorRadioButtons from "./selectOption";
import TextField from "@mui/material/TextField";

function Choose({
  addOptionList,
  deleteOption,
  editOptionList,
  index,
  setCorrectOption,
  actValue,
}) {
  const style = {
    outerLayer: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
    },
    textField: {
      width: "40%",
    },
    textFieldTD:{
      width: "40%",
    }
  };

  const sendAnswer = () => {
    addOptionList();
  };

  return (
    <div style={style.outerLayer}>
      <ColorRadioButtons
        isCorrect={actValue.isCorrect}
        index={index}
        setCorrectOption={setCorrectOption}
      />
      <TextField
        label=""
        multiline
        maxRows={4}
        variant="filled"
        onChange={(e) => {
          editOptionList(index, e.target.value);
        }}
        sx={{
          background: "#F5F5F5",
          "& .MuiFilledInput-root:focus-within": { background: "#F5F5F5" },
          "& .MuiFilledBase-root:focus": { background: "#F5F5F5" },
          "& .MuiFilledInput-root:hover": { background: "#F5F5F5" },
          "& .MuiFilledInput-root": { background: "#F5F5F5" },
          "& .MuiFilledInput-underline:before": {
            borderBottom: "#D1D7DD solid 2px",
          },
          "& .MuiFilledInput-underline:after": {
            borderBottom: "#187163 solid 2px",
          },
          "& .MuiFilledInput-underline:hover:before": {
            borderBottom: "#187163 solid 2px",
          },
          "& .MuiFilledInput-input": {
            color: "#787486",
            background: "#F5F5F5",
          },
        }}
        style={style.textField}
        value={actValue.option}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendAnswer();
          }
        }}
      />

<Icon
        component={ClearIcon}
        sx={{
          width: "25px",
          height: "25px",
          color: "gray",
          cursor: "pointer",
          ":hover": { color: "#187163" },
        }}
        onClick={() => {
          deleteOption(index);
        }}
      />
    </div>
  );
}

export default Choose;
