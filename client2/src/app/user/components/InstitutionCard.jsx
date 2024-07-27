import Avater from "../../../util/Avater";
import {
  Paper,
  Accordion,
  AccordionSummary,
  Button,
  Stack,
  Autocomplete,
  TextField,
  SvgIcon,
  
} from "@mui/material";
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ScheduleTestCard from "./ScheduleTestCard";
import { useEffect, useState, } from "react";


export default function InstitutionCard({
  MD,
  institute,
  setDetails,
  details,
  Notificate,
  instituteDetails
}) {

  const [expanded, setExpanded] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [isOpen,isClose] = useState(false)

  const handleClick = () => {
    setExpanded(!expanded);
  };
  const handleSelect = (event, value) => {
    if(value !== null)
    setDetails((preValue) => {
      const getValue = { ...preValue };
      getValue.instituteName = value.label;
      getValue.instituteID = value.id;
      return getValue;
    });
  };
  const handleRoll = (e) => {
    setDetails((preValue) => {
      const getValue = { ...preValue };
      getValue.rollNumber = e.target.value;

      return getValue;
    });
  };
  
  const handleDept = (e) => {
    setDetails((preValue) => {
      const getValue = { ...preValue };
      getValue.Dept = e.target.value;

      return getValue;
    });
  };
  const handleBatchCode = (e) => {
    setDetails((preValue) => {
      const getValue = { ...preValue };
      getValue.batchCode = e.target.value;

      return getValue;
    });
  };

  useEffect(()=>{

    if(instituteDetails.name !== undefined)
  {  instituteDetails.collectBatch.map(task =>{ if(task.scheduleTest.length > 0) isClose(true) })}
  
 
  },[instituteDetails])
  const handleSubmit = () =>{
    
    fetch('/api/user/request',{
      method:"POST",
      headers:{
        "Content-type":"application/json"
      },
      body:JSON.stringify({data:details})
    })
    .then(res => res.json())
    .then((data) => {
    Notificate(data.status,data.message)
    }
    )
  }
  useEffect(() => {
    if (
      details.Dept !== "" &&
      details.batchCode !== "" &&
      details.instituteID !== "" &&
      details.instituteName !== "" &&
      details.rollNumber !== ""
    ) setSubmit(true)
    else setSubmit(false)
  },[details]);
  return (
    <Paper
      elevation={MD ? 0 : 1}
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        cursor:'default'
      }}
    >
      <Accordion sx={{ '& .MuiAccordionSummary-root:hover,.MuiButtonBase-root:hover': {
          cursor: 'default',
        }}} expanded={MD ? true : expanded}>
        {instituteDetails.name == undefined ?  
        <AccordionSummary
          sx={{
            borderRadius: "20px 20px 0 0",
            padding: "10px 20px",
            '& .MuiAccordionSummary-root:hover,.MuiButtonBase-root:hover': {
              cursor: 'default',
            }

          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            cursor='default'
          >
            <h2
              style={{
                fontSize: MD ? "18px" : "20px",
                fontWeight: "500",
              }}
            >
              {MD ? "Join an Institution" : "Click here to Join an Institution"}
            </h2>
            {MD ? null : (
              <Button
                variant="contained"
                onClick={handleClick}
                sx={{
                  textTransform: "none",
                  backgroundColor: !expanded ? "#187163" : "red",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: !expanded ? "#187163" : "red",
                    color: "#fff",
                  },
                  zIndex: "1",
                }}
              >
                {!expanded ? "Tap to Join" : "Close"}
              </Button>
            )}
          </Stack>
          <img
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              zIndex: "0",
          
            }}
            src={Avater.cardBg}
            alt=""
          />
        </AccordionSummary>
        : <AccordionSummary
        sx={{
          borderRadius: "20px 20px 0 0",
          padding: "10px 20px",
          height:'80px',
          "& .muiexpansionpanelsummary-root:hover": {
            cursor: "default"
          }
        
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          height='80px'
        >

          <Stack  alignItems='center'   height='80px'  position='relative' spacing='10px' direction='row'>
          <img src={instituteDetails.avatar} style={{maxWidth:'60px',borderRadius:'30px'}} alt="" />
          <h2
            style={{
              fontSize: MD ? "18px" : "20px",
              fontWeight: "500",
            }}
          >
            {instituteDetails.name}
          </h2>
       {  isOpen == false ? null : <SvgIcon sx={{position:'absolute',left:'30px',bottom:'10px', }} >< AnnouncementIcon sx={{color:'red'}} /></SvgIcon>}
          </Stack>
          {MD ? null : <div>

            <Button
              variant="contained"
              onClick={handleClick}
              sx={{
                textTransform: "none",
                backgroundColor: !expanded ? "#187163" : "red",
                color: "#fff",
                "&:hover": {
                  backgroundColor: !expanded ? "#187163" : "red",
                  color: "#fff",
                },
                zIndex: "1",
              }}
            >
              {!expanded ? "Tap to View" : "Close"}
            </Button>
             
             </div>
          }
        </Stack>
        <img
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            zIndex: "0",
             height:'200px',
            cursor:'default'
          }}
          src={Avater.cardBg}
          alt=""
        />
      </AccordionSummary> }
       {
        instituteDetails.name == undefined ?
       
        <Stack padding={3}>
          <Autocomplete
             disablePortal
        
            options={institute}
            onChange={handleSelect}
            renderInput={(params) => (
              <TextField
           
                fullWidth
                {...params}
                sx={{
                  
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
                      borderColor: "#187163",
                    },
                  },
                }}
                label="Institution Name"
                placeholder="Enter Institution name"
              />
            )}
          />
          <Stack direction="row" gap={2} marginTop={2}>
            <TextField
              fullWidth
              sx={{
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
                    borderColor: "blue",
                  },
                },
              }}
              onChange={handleRoll}
              label="Roll Number"
              placeholder="Enter Roll Number"
            />
            <TextField
              fullWidth
              sx={{
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
                    borderColor: "#187163",
                  },
                },
              }}
              onChange={handleDept}
              label="Department"
              placeholder="Enter Department"
            />
            <TextField
              fullWidth
              sx={{
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
                    borderColor: "#187163",
                  },
                },
              }}
              onChange={handleBatchCode}
              label="Batch Code"
              placeholder="Enter Batch Code"
            />
          </Stack>
          <Stack direction="column" alignItems={"center"} marginTop={2}>
            <Button
              variant="contained"
              disabled={isSubmit == true ? false : true}
              fullWidth={MD ? true : false}
              sx={{
                textTransform: "none",
                backgroundColor: "#187163",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#187163",
                  color: "#fff",
                },
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
        : <ScheduleTestCard batch={instituteDetails.collectBatch} />  }
      </Accordion>
    </Paper>
  );
}



