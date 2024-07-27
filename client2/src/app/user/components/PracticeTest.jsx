import {
  Paper,
  Stack,
  FormGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from "react";
import PracticeGroup from './practiceGroup'
export default function PracticeTest({
  MD,
  selectGoal,
  setSelectGoal,
  Notificate,
  createPracticesExam,
  isWaitingPra
}) {
  const [isSelect, setSelect] = useState(false);
  const [questionCount, setQuestionCount] = useState([]);
  const [value, setValue] = useState({ value: "", selectLevel: "" });
  
 const [isSelectAll,setSelectAll] = useState(false)
  let calLength = [];
  useEffect(() => {
    const check = [];
    calLength = [];
    const isSelect = []  
    // if (MD !== true)
      selectGoal.topic.map((task) => {
    if(task.type == 'group')
      { 
        if (task.isSelect == true){
          calLength.push(task);
          isSelect.push(task)
          setSelect(true);  
        }
       if (task.isSelect == false)
    {        
       check.push(task);
      task.ListTopic.map(task => {

          if (task.isSelect == true) {
            check.shift();
            calLength.push(task);
            setSelect(true);
          }
  
        })
      }
        if (selectGoal.topic.length == check.length) setSelect(false);
      
      }
      else  if(task.type == 'topic') {
        if (task.isSelect == true) {
          calLength.push(task);
          isSelect.push(task)
          setSelect(true);
        }

        if (task.isSelect == false || task.isSelect == undefined)
         { 
          check.push(task);
     
        }
        if (selectGoal.topic.length == check.length) setSelect(false);
      }
       
      });
    // else
    //   selectGoal.topic.map((task) => {
    //     if (task.isSelect == true) {
    //       calLength.push(task);
    //       setSelect(true);
    //     }
    //     if (task.isSelect == false || task.isSelect == undefined) check.push(task);
          
    //     if (selectGoal.topic.length == check.length) setSelect(false);
    //   });

    setQuestionCount((preValue) => {
      
      const count = [];
      let calcTopicLength = 0
    
     selectGoal.topic.map(task => {
      if(task.isSelect == true) calcTopicLength +=task.topicLength
      else if(task.isSelect == false && task.type == 'group') {
        task.ListTopic.map(task => {
          if(task.isSelect == true ) calcTopicLength += 1
        })
      }
     })
   
    //  const num = 5 * (calcTopicLength-1);
    //   //  const num = 5 * (calLength.length-1);
    // {  for (let i = 1 ,j=5; i < 7 +1 ; i++,j+=5) {
    //     const max = num + j   
    //       if(max < 76) count.push(max)
    //   }}
 
    const num = 5 

    //  const num = 5 * (calLength.length-1);
  {  for (let i = 1 ,j=0; i < (calcTopicLength *4) +1 ; i++,j+=5) {
      const max = num + j   
        if(max < selectGoal.noOfQuestion) count.push(max)
    }}
 
      return count;
    });

    if(selectGoal.topic.length == isSelect.length) setSelectAll(true)
  else setSelectAll(false)
 
     setValue({ value: "", selectLevel: "" });

  },[selectGoal]);



  const handleAttempt = () => {
    const isSelect = [];
    const check = [];
    const isCheck = []
    if (value.value == "") {
      check.push(value);
       Notificate('info','Please select no of questions')
    }
    if (value.selectLevel == "") {
      check.push(value);
         Notificate('info','Please select level')
    }
    // if (MD !== true)
      selectGoal.topic.map((task) => {
        if (task.isSelect == false || task.isSelect == undefined)
         { isSelect.push(task);}
       if (task.isSelect == false && task.type == 'group')
      {
          task.ListTopic.map(task => {
        
            if(task.isSelect == true) {
              
              isSelect.push(task)
              isCheck.push(task)
            }
          })
      }
  
        if (selectGoal.topic.length == isSelect.length && isCheck.length == 0) {
          check.push(task);
          Notificate('info','Please select question')
        }
      });
    // else
    //   selectGoal.topic.map((task) => {
    //     if (task.isSelect == false || task.isSelect == undefined)
    //       isSelect.push(task);
    //     if (selectGoal.topic.length == isSelect.length) {
    //       check.push(task);
    //         Notificate('info','Please select question')
    //     }
    //   });

    if (check.length == 0) {
      createPracticesExam(value, selectGoal);
    }
  };
  return (
    <Paper
      elevation={MD ? 0 : 2}
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <Stack
        paddingBottom={"20px"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <h3
          style={{
            fontSize: MD ? "18px" : "22px",
            fontWeight: "600",
            color: "#656565",
            marginBottom: "10px",
          }}
        >
          Practice Test Series
        </h3>
        <FormControlLabel
       
          control={
            <Checkbox
              onChange={(e, value) => {
                setSelectAll(value)
                setSelectGoal((PreValue) => {
                  const getValue = { ...PreValue };
                  getValue.topic.map((task) => {
                    task.isSelect = value
                    if(task.type == 'group')
                    task.ListTopic.map(task => task.isSelect = value)
                  });

                  return getValue;
                });
              }}
              sx={{
                "&.Mui-checked": {
                  color: "#187163",
                },
                "&.MuiCheckbox-root": {
                  color: "#187163",
                },
              }}

              checked={isSelectAll}
                        />
                      
          }
          label={"Select All"}
        />
      </Stack>
      <TopicList
        MD={MD}
        setSelectGoal={setSelectGoal}
        selectGoal={selectGoal}
      />
      <Stack direction="row" gap="10px" margin="20px 0">
        <FormControl fullWidth>
          <InputLabel
            sx={{
              color: "#187163",
            }}
            id="demo-simple-select-label"
          >
            No of questions
          </InputLabel>
          <Select
            disabled={isSelect == false ? true : false}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={"select"}
            label="No of questions"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderColor: "green !important",
              },
              "& .MuiSvgIcon-root": {
                color: "#187163 !important",
              },
            }}
            onChange={(e, value) =>
              setValue((preValue) => {
                const getValue = { ...preValue };
                getValue.value = e.target.value;
                return getValue;
              })
            }
            // onChange={handleChange}
          >
            <MenuItem disabled value={"select"}>
              {value.value == "" ? "Select Questions" : value.value}
            </MenuItem>

            {questionCount.length !== 0
              ? questionCount.map((task,index) => (
                  <MenuItem value={task} key={index}>{task}</MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel
            sx={{
              color: "#187163",
            }}
            id="demo-simple-select-label"
          >
            Difficulty level
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={"select"}
            label="Difficulty level"
            sx={{
              textTransform:"capitalize",
              "& .MuiOutlinedInput-root": {
                borderColor: "green !important",
              },
              "& .MuiSvgIcon-root": {
                color: "#187163 !important",
              },
            }}
            onChange={(e, value) =>
              setValue((preValue) => {
           
                const getValue = { ...preValue };
               
                getValue.selectLevel = e.target.value;
                return getValue;
              })
            }
          >
            <MenuItem disabled value={"select"}>
              {value.selectLevel == "" ? "Select Level" : value.selectLevel}
            </MenuItem>
            <MenuItem value={"easy"}>Easy</MenuItem>
            <MenuItem value={"medium"}>Medium</MenuItem>
            <MenuItem value={"hard"}>Hard</MenuItem>
          </Select>
        </FormControl>
      </Stack>
     { isWaitingPra  ? 
      <LoadingButton loading   sx={{ width:'100%',height:'40px' ,backgroundColor:"#187163", "& .MuiCircularProgress-root": { color: "white", } }} />
      :
      <Button
        variant="contained"
        fullWidth
        onLoad
        sx={{
          textTransform: "none",
          backgroundColor: "#187163",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#187163",
            color: "#fff",
          },
          padding: "10px",
        }}
        onClick={handleAttempt}
      >
        Attempt Test
      </Button>}
    </Paper>
  );
}

function TopicList({ setSelectGoal, selectGoal, MD }) {
 
  return (
    <FormGroup>
      <Stack direction={"row"} flexWrap={"wrap"} gap={2}>
        {MD == undefined
          ? selectGoal.topic.map((topic, index) => {
              return (
                <TopicListCard
                  key={index}
                  selectGoal={selectGoal}
                  type={topic.type}
                  topic={topic.title}
                  
                  setSelectGoal={setSelectGoal}
                  isSelect={topic.isSelect}
                  index={index}
                  ListTopic={topic.type == 'group' ? topic.ListTopic : ''}
                  MD={MD}
                />
              );
            })
          : selectGoal.topic.map((topic, index) => {
              return (
                <TopicListCard
                  key={index}
                  selectGoal={selectGoal}
                  type={topic.type}
                  topic={topic.title}
                
                  setSelectGoal={setSelectGoal}
                  isSelect={topic.isSelect}
                  index={index}
                  ListTopic={topic.type == 'group' ? topic.ListTopic : ''}
                  MD={MD}
                />
              );
            })}
      </Stack>
    </FormGroup>
  );
}

function TopicListCard({
  topic,
  setSelectGoal,
  index,
  isSelect,
  MD,
  ListTopic,
  type,
  selectGoal
}) {
  
  return (
    
      type == 'group'  ? <PracticeGroup  
      topic ={topic}
      setSelectGoal = {setSelectGoal}
      index ={index}
      isSelect = {isSelect}
      type ={isSelect}
      MD ={MD}
      selectGoal={selectGoal}
      ListTopic={ListTopic}
      />  : 
    <Paper
      elevation={MD ? 0 : 1}
      key={index}
      sx={{
         width: MD ? "100%" : "fit-content",
        padding: "5px 10px",
        borderRadius: "10px",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: MD ? "none" : "#e5e5e5",
        },
      }}
    >
 
      
      <FormControlLabel
        control={
          <Checkbox
            checked={isSelect == true ? true : false}
            // checked = {isSelect}
            sx={{
              "&.Mui-checked": {
                color: "#187163",
              },
              "&.MuiCheckbox-root": {
                color: "#187163",
              },
            }}
            onChange={(e, value) => {
              MD == undefined
                ? setSelectGoal((PreValue) => {
                    const getValue = { ...PreValue }
                    getValue.topic[index].isSelect = value;
                    return getValue;
                  })
                : setSelectGoal((PreValue) => {
                    const getValue = { ...PreValue }
                    getValue.topic[index].isSelect = value;
                    return getValue;
                  });
            }}
          />
        }
        label={topic}
      />
       
    </Paper>
  );
}
