import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";

export default function AddBatch({ id, ControlNotification, teacher ,getTeacherAccess}) {

  const [open, setOpen] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [Error, setError] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setError("");
    setOpen(false);
  };
  const handleSelect = (event,value) => {
    if(value !== null)
    setTeacherName(value);
  };
  const submit = (data) => {
    setError("");
    setTeacherName("");
    getTeacherAccess(data.status,data.message)
    ControlNotification(data.status, data.message);
    setOpen(false);
  };

  const createBatch = () => {
    fetch("/api/admin/createTeacher", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ id: id, teacherName: teacherName }),
    })
      .then((res) => res.json())
      .then((data) => {
       
        if (data.status == "success") {
          submit(data);
          
        }
        else if (data.status == "already") setError(true)
        else if(data.status == "error") submit(data);
      });
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
        Add Teacher
      </Button>
      <Dialog fullWidth maxWidth="sm" open={open}   >
        <DialogTitle sx={{ background: " #187163;", color: "white" }}>
          Add Teacher
        </DialogTitle>
        <DialogContent sx={{height:'200px'}} >
            
          <Autocomplete
            disablePortal
        
            options={teacher}
            onChange={handleSelect}
            renderInput={(params) => (
              <TextField
                fullWidth
                error ={Error == false ? false : true }
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
              marginTop:'10px'
                }}
                label="Add teacher"
                placeholder="Enter Email"
                helperText={ Error == false ? '' : 'The teacher name is already exists'}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#187163" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={teacherName === "" ? true : false}
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