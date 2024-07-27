import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { TextField } from "@mui/material";
import { useLocation } from "react-router-dom";
export default function DeleteExam({examID,Notificate,examName, setCall,isCall}) {
  const { search } = useLocation();
  const [open, setOpen] = useState(false);
  const [deleteName, setDeleteName] = useState("");
  const [Error,setError] = useState('')
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setError('')
    setDeleteName("");
    setOpen(false);
  };
  const handChange = (event) => {
    setError('')
    setDeleteName(event.target.value)
  };
  const submit = (data) => {
    setError("")
    setDeleteName("");
    Notificate(data.status,data.message)
    setOpen(false);
  };

const deleteExam = () =>{
    if( examName == deleteName && examID)
   { 
    fetch('/api/institution/deleteExam',{
        method:'POST',
        headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ examID,batchID:search.split('=')[1]}),
    })
    .then(res => res.json())
    .then(data => {
      if(data.status == 'success'){
        setCall(!isCall)
        submit(data)
      }
    })
}
else setError('Please Enter Valid Exam Name')
}
  return (
    <div>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          marginRight: "20px",
          color: "white",
          backgroundColor: "#FF2E2E",
          "&:hover": {
            backgroundColor: "#FF2E2E",
          },
          textTransform: "none",
        }}
        onClick={handleClickOpen}
      >
        Delete
      </Button>
      <Dialog fullWidth maxWidth="sm"  open={open} >
        <DialogTitle sx={{ background: " #187163;", color: "white" }}>
         Delete  {examName} Exam
        </DialogTitle>
        <DialogContent  >

       <TextField fullWidth label='Enter Exam Name'  sx={{marginTop:'20px'}}   
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
            disabled={deleteName === "" ? true : false}
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
