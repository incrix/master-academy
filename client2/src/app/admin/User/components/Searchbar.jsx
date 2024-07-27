import React from "react";
import { Button, Paper, Stack, TextField } from "@mui/material";

function SearchBar() {
  const style = {
    AddBtn: {
      width: " 96px",
      height: "34px",
      borderRadius: "4px",
      background: "#187163",
      color: "white",
    },
  };

  return (
    <div>
      <Paper
        sx={{
          borderRadius: "5px",
          background: "#FFF",
          boxShadow: "0px 15px 62px 0px rgba(0, 0, 0, 0.08)",
          width: "100%",
          height: "70px",
          padding: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <input
            type="text"
            style={{
              width: " 253px",
              height: "34px",
              borderRadius: "5px",
              border: "1px solid #CACACA",
              padding:'15px'
            }}
            placeholder="Search"
          />
        </div>
      </Paper>
    </div>
  );
}

export default SearchBar;
