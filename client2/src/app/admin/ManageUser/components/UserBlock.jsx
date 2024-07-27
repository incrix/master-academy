import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Delete";
import {useState } from "react";
import { TextField } from "@mui/material";
import { useLocation } from "react-router-dom";
import Switch from '@mui/material/Switch';

export default function UserBlock({isCall,setCall,action,ControlNotification,userID,email}) {
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const { search } = useLocation();
  const [open, setOpen] = useState(false);
  const [blockName, setBlockName] = useState("");
  const [Error,setError] = useState('')
 // const [check,setCheck] = useState(false)
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setError('')
    setBlockName("");
    setOpen(false);
  };
  const handChange = (event) => {
    setError('')
    setBlockName(event.target.value)
  };
  const submit = (data) => {
    setError("")
    setBlockName("");
    ControlNotification(data.status,data.message)
    setOpen(false);
  };

const deleteExam = () =>{
    if(blockName == email)
   { 
    fetch('/api/admin/manageUserBlock',{
        method:'POST',
        headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({userID,action}),
    })
    .then(res => res.json())
    .then(data => {
      if(data.status == 'success'){
        setCall(!isCall)
        submit(data)
      }
      else setError(data.message)
    })
}
else setError('Please Enter Valid User Email Name')
}
  return (
    <div>
   
      <Switch {...label} 
checked={action}
      
                 sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#187163'
                      },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#187163',
                      },
                  }}
                  onClick={handleClickOpen}
                /> 
      <Dialog fullWidth maxWidth="sm"  open={open} >
        <DialogTitle sx={{ background: " #187163;", color: "white" }}>
        {action ? `UnBlock User ${' '} ${email}` :  `Block User ${' '} ${email}`}
        </DialogTitle>
        <DialogContent  >

       <TextField fullWidth label='Enter Email' sx={{marginTop:'20px'}}   
        InputProps={{
    sx: {
      '&:hover fieldset': {
        border: '1px solid #187163;!important',
        borderRadius: 0,
      },
      '&:focus-within fieldset, &:focus-visible fieldset': {
        border: `2px solid  ${Error} == '' ? #187163 : red !important`,
      },
    },
  }}
      inputProps={{
        sx: {
          paddingLeft: '15px',
          fontSize: '20px',
        },
      }} 
      onChange={handChange}
      helperText={Error}
      error={Error == '' ? false : true }
      />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#187163" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={setBlockName === "" ? true : false}
            sx={{ color: "#187163" }}
            onClick={deleteExam}
          >
            Add 
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
