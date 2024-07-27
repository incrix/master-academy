import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function EditGroupNameCourseCollection({task ,Notificate,collectionsID,courseID,title,checkPublish}) {

  const [notificate,setNotification] = useState(false)
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const handleClickOpen = () => {
    if(checkPublish !== 'publish')
   { setOpen(true);}
   else{
    Notificate('info', 'Please switch to publish mode');
   }
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
        editGroup(groupName)
        setGroupName("");
        setOpen(false);
      }
      else{
         setNotification(true)
      }
    }
    })
  
  };

  const editGroup = (changeName) =>{
    setOpen(true);
    fetch("/api/admin/editGroupNameCourseCollection", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        courseID: courseID,
        title: title,
        changeName:changeName,
        collectionsID: collectionsID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
       
        Notificate(data.status, data.message);
      });
  }

  return (
    <div >
     
          <IconButton title="Edit Group Title" onClick={handleClickOpen}>
                <EditIcon />
              </IconButton>
  

      <Dialog fullWidth maxWidth={"sm"} open={open}>
        <DialogTitle sx={{ background: " #187163;", color: "white" }}>
           Change Group Name
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
