import { FormControlLabel, Checkbox } from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect,useState } from "react";
import useWindowDimensions from "../../../util/useWindowDimensions";

export default function PracticeGroup({
  topic,
  setSelectGoal,
  index,
  isSelect,
  type,
  MD,
  selectGoal,
  ListTopic,
}) {
    const {width } = useWindowDimensions()
    const [expanded, setExpanded] = useState(false);
    const handleClick = () => {
        setExpanded(!expanded);
      };
useEffect(()=>{
  
 
},[])

const checkIsSelect = ()=>{
    const isSelect =[]
    selectGoal.topic[index].ListTopic.map(task => {
        if(task.isSelect == true) isSelect.push(task)
    })

if(selectGoal.topic[index].ListTopic.length == isSelect.length) { 
    setSelectGoal((PreValue) => {
        const getValue = { ...PreValue };
        getValue.topic[index].isSelect = true
        return getValue;
      })
}
else
{
    setSelectGoal((PreValue) => {
        const getValue = { ...PreValue };
        getValue.topic[index].isSelect = false
        return getValue;
      })
}
}

  return (
    <div style={{ width:{width : 500 ? '200px':"400px"} ,"&:hover":{background:'red'} }} key={index}>
      <Accordion     elevation={MD ? 0 : 1} expanded={ expanded} >
        <AccordionSummary expandIcon={<ExpandMoreIcon onClick={handleClick} />} sx={{borderRadius:'10px'}} >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                maxWidth: "calc(100% - 140px)",
                fontWeight: "500",
               
              }}
            >
                  <FormControlLabel
                control={
                  <Checkbox
                    checked={isSelect }
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
                            const getValue = { ...PreValue };
                            getValue.topic[index].isSelect = value;
                            getValue.topic[index].ListTopic.map(task => task.isSelect = value)
                            return getValue;
                          })
                        : setSelectGoal((PreValue) => {
                            const getValue = { ...PreValue };
                            getValue.topic[index].isSelect = value;
                            getValue.topic[index].ListTopic.map(task => task.isSelect = value)
                            return getValue;
                          });
                    }}
                  />
                }
                sx={{ '& .MuiFormControlLabel-label': { fontWeight:'bold'} }}
                label={topic}
              />
              
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: "10px",
            margin: "0",
          }}
        >
          {ListTopic.map((task,listIndex) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSelect == true || task.isSelect == true ? true : false}
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
                          
                            const getValue = { ...PreValue };
                           getValue.topic[index].ListTopic[listIndex].isSelect = value
                           checkIsSelect()
                            return getValue;
                          })
                        : setSelectGoal((PreValue) => {
                            
                            const getValue ={ ...PreValue };
                            getValue.topic[index].ListTopic[listIndex].isSelect = value
                            checkIsSelect()
                            return getValue;
                          });
                    }}
                  />
                }
                label={task.title}
              />
            );
          })}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
