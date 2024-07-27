import { Paper } from "@mui/material";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function MockTest({
  task,
  index,
  setCourse,
  course,
  setMock,
  courseTopicIndex,
  courseAvalile,
  setPageController
}) {

  useEffect(()=>{

  setPageController({
    mockPage:true,
    courseSettingPage:false
  })
  handleChange()
},[])
 


  const [limit, setLimit] = useState({
    easy: false,
    medium: false,
    hard: false,
  });
  const handleChange = (e) => {
    setMock(course)
   
  };
 
  const styleMock = {
    height:'56px',
    "& label.Mui-focused": {
      color: "#187163",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#187163",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#187163",
      },
      "&:hover fieldset": {
        borderColor: "#187163",
      },
      "&.Mui-focused fieldset": {
        borderColor: "187163",
      },
    },
  };

  return (
    <div style={{ paddingTop: "30px" }}>
      <Paper
        sx={{
          width: "100%",
          height: "100px",
          boxShadow: "0 4px 6px rbga(0,0,0,0.25) ",
          padding: "10px",
          display: "flex",
          alignItems:'center',
          gap: "50px",
      
        }}
        key={index}
      >
        <TextField
          sx={styleMock}
          value={courseAvalile.title}
          label="Topic"
          variant="outlined"
          disabled
        />

        <div style={{ display: "flex", gap: "15px" }}>
          <TextField
            sx={styleMock}
            value={task.level.easy}
            error={limit.easy == false ? false : true}
            onChange={(e) => {
             
        
            if(0 <= e.target.value) {
              
              if (courseAvalile.level.easy >= e.target.value) {
                setCourse((preValue) => {
                  const getValue = [...preValue];
                  getValue[index].topic[courseTopicIndex].level.easy =e.target.value
                 return getValue;
                });

                handleChange();

                setLimit((preValue) => {
                  const limit = { ...preValue };
                  limit.easy = false;
                  return limit;
                });
              } else { 
                setLimit((preValue) => {
                  const limit = { ...preValue };
                  limit.easy = true;
                  return limit;
                });
              }
            }
          
            
            }}
            label="Easy"
            variant="outlined"
            type="number"
            helperText={`Avalible ${courseAvalile.level.easy}`}
          />

          <TextField
            error={limit.medium == false ? false : true}
            sx={styleMock}
            value={
              task.level.changeMedium == undefined
                ? task.level.medium
                : task.level.changeMedium
            }
            onChange={(e) => {
              if(0 <= e.target.value) {
              if (courseAvalile.level.medium >= e.target.value) {
                setCourse((preValue) => {
                  const getValue = [...preValue];
                  getValue[index].topic[courseTopicIndex].level.medium = e.target.value;
                 return getValue;
                });

                handleChange();

                setLimit((preValue) => {
                  const limit = { ...preValue };
                  limit.medium = false;
                  return limit;
                });
              } else {
                setLimit((preValue) => {
                  const limit = { ...preValue };
                  limit.medium = true;
                  return limit;
                });
              }
            }
            }}
            label="Medium"
            variant="outlined"
            type="number"
            helperText={`Avalible ${courseAvalile.level.medium}`}
          />

          <TextField
            error={limit.hard == false ? false : true}
            sx={styleMock}
            value={
              task.level.changeHard == undefined
                ? task.level.hard
                : task.level.changeHard
            }
            onChange={(e) => {
              if(0 <= e.target.value) {
              if (courseAvalile.level.hard >= e.target.value) {
                setCourse((preValue) => {
                  const getValue = [...preValue];
                  getValue[index].topic[courseTopicIndex].level.hard = e.target.value;
                 return getValue;
                });
                handleChange();
                setLimit((preValue) => {
                  const limit = { ...preValue };
                  limit.hard = false;
                  return limit;
                });
              } else {
                setLimit((preValue) => {
                  const limit = { ...preValue };
                  limit.hard = true;
                  return limit;
                });
              }
            }
            }}
            label="Hard"
            variant="outlined"
            type="number"
            helperText={`Avalible ${courseAvalile.level.hard}`}
          />
        </div>
      </Paper>
    </div>
  );
}
