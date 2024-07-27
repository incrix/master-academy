import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import AddOption from "./AddOption";
export default function FormDialog({ createBank,task,Notificate,checkPublish}) {

  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleClickOpen = () => {
    if(checkPublish !== 'publish')
    {setOpen(true);}
    else   Notificate('info', 'Please switch to publish mode');
  };
  const handleClose = () => {
    setOpen(false);
  };
  const getGroupName = (task) => {
    setGroupName(task)
  };
  const submit = () => {
    createBank(groupName);
    setGroupName("");
    setOpen(false);
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
        Add Topic
      </Button>
      <Dialog fullWidth maxWidth="sm"  open={open} >
        <DialogTitle sx={{ background: " #187163;", color: "white" }}>
          Add Topic
        </DialogTitle>
        <DialogContent  >

        <AddOption task={task} getGroupName={getGroupName} /> 

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
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
