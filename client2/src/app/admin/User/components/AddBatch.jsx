import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";

export default function AddBatch({id,ControlNotification,getTeacherAccess}) {

  const [open, setOpen] = useState(false);
  const [batchName, setBatchName] = useState("");
  const [Error,setError] = useState('')

  const handleClickOpen = () => {
    
    setOpen(true);
  };
  const handleClose = () => {
    setError('')
    setOpen(false);
  };
  const handChange = (event) => {
    setBatchName(event.target.value)
  };
  const submit = (data) => {
    setError("")
    setBatchName("");
  
    getTeacherAccess(data.status,data.message)
    ControlNotification(data.status,data.message)
    setOpen(false);
  };


  const createBatch =() =>{
   fetch('/api/institution/createBatch',{
    method:'POST',
    headers:{
        "content-type":"application/json"
    },
    body:JSON.stringify({id:id,batchName:batchName})
   })
   .then(res => res.json())
   .then(data => {
    
    if(data.status == 'success') submit(data)
    else if(data.status == 'error') setError(data.message)
   })
  }

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          marginRight: "20px",
          color: "white",
          backgroundColor: "#187163",
          "&:hover": {
            backgroundColor: "#187163",
          },
          textTransform: "none",
        }}
        onClick={handleClickOpen}
      >
        Add Batch
      </Button>
      <Dialog fullWidth maxWidth="sm"  open={open} >
        <DialogTitle sx={{ background: " #187163;", color: "white" }}>
          Add Batch 
        </DialogTitle>
        <DialogContent  >

       <TextField fullWidth label='Batch Name'  sx={{marginTop:'20px'}}   
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
            disabled={batchName === "" ? true : false}
            sx={{ color: "#187163" }}
            onClick={createBatch}
          >
            Add 
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
