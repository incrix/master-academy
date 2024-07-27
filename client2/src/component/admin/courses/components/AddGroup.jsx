import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export default function FormDialog({ createGroup ,task ,Notificate,checkPublish}) {

  const [notificate,setNotification] = useState(false)
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const handleClickOpen = () => {
if(checkPublish !== 'publish') setOpen(true);
    else  Notificate('info', 'Please switch to publish mode');
  };
  const handleClose = () => {
    setOpen(false);
  };
  const getGroupName = (e) => {
    setGroupName(e.target.value);   
  };
  const submit = () => {
    task.map(task => {
      if(task.fileName !== undefined) 
    {
      if(task.fileName.indexOf(groupName) == -1){
        createGroup(groupName);
        setGroupName("");
        setOpen(false);
      }
      else{
         setNotification(true)
      }
    }
    })
  
  };

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
        Add Group
      </Button>
      <Dialog fullWidth maxWidth={"sm"} open={open}>
        <DialogTitle sx={{ background: " #187163;", color: "white" }}>
           Create Group
        </DialogTitle>
        
        <DialogContent>
      {notificate == false ? null : <DialogTitle sx={{ background: "red", color: "white" }}>
          The Group Name Already Taken
        </DialogTitle> }  
          <TextField
            autoFocus
            sx={{
              margin: "40px 0 20px 0",
              padding: "20px",
              fontSize: "22px",
              "& .MuiFilledInput-underline:before": {
                borderBottom: "#D1D7DD solid 2px",
              },
              "& .MuiFilledInput-underline:after": {
                borderBottom: "#187163 solid 2px",
              },
              "& .MuiFilledInput-underline:hover:before": {
                borderBottom: "#187163 solid 2px",
              },
              "& .MuiFilledInput-input": {
                color: "#787486",
                background: "#F5F5F5",
              },
            }}
            id="name"
            placeholder="Enter Group Name"
            onChange={getGroupName}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#187163" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={groupName === "" ? true : false}
            sx={{ color: "#187163" }}
            onClick={submit}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
