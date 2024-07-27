import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
export default function AddOption({ quesTask, getGroupName, question }) {
  const [option, setOption] = useState("");

  const handleChange = (event) => {
  
    if(event.target.value !== 'on option') {
     
      getGroupName(event.target.value)
    }
    
  
    setOption(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, marginTop: "20px" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Choose Question Bank
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={option }
          label="Choose Question Bank"
          onChange={handleChange}
        >
          {question.length == quesTask.length ? (
            <MenuItem  value='on option' >
              no option
            </MenuItem>
          ) : (
            quesTask.map((task, index) => {
              const check = [];
              if (question.length > 0) {
                question.map((task1) => {
                  if (task.title == task1.title) check.push(task.title);
                });
                if (check.length == 0)
                  return (
                    <MenuItem key={index} value={task}>
                      {task.title}
                    </MenuItem>
                  );
              } else
                return (
                  <MenuItem key={index} value={task}>
                    {task.title}
                  </MenuItem>
                );
            })
          )}


        </Select>
      </FormControl>
    </Box>
  );
}
