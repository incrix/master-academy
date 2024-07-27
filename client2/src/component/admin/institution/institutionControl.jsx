import React, { useState } from "react";
import { Paper } from "@mui/material";
import AddNew from './components/AddNew.jsx'
function InstitutionControl({changeRoll,isChange,searchInstitution}) {
  const [search,setSearch] = useState('')
  const style = {
    AddBtn: {
      width: " 96px",
      height: "34px",
      borderRadius: "4px",
      background: "#187163",
      color: "white"
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
            onChange={(e)=>{
              setSearch(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" ) {
                searchInstitution(search);
              }
             
            }}
            placeholder="Search"
          />
          <AddNew changeRoll={changeRoll} isChange={isChange} />    
        </div>
      </Paper>
    </div>
  );
}

export default InstitutionControl;
