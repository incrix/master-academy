import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function AddGoal({ isChange,id,addGoal }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [select, selectOption] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const submit = () => {
    callList();
 
    addGoal(select)
   
    setOpen(false);
  };
  const callList = async () => {
    fetch(`/api/user/getGoal`,{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify({id})
    
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.status == 'ok')
      {  
        setList(data.message);
      }
      });
  };
  const handleChange = (event, value) => {
    if (value !== null)
      selectOption((preValue) => {
        const getvalue = { ...preValue };
        getvalue.goalName = value.label;
        getvalue.id = value.id;
        return getvalue;
      });
    else
      selectOption((preValue) => {
        const getvalue = { ...preValue };
        getvalue.goalName = "";
        getvalue.id = "";
        return getvalue;
      });
  };
  useEffect(() => {
    callList();
  }, [isChange]);

  return (
    <div>
      <Button
        variant="contained"
        sx={{
          textTransform: "none",
          backgroundColor: "#187163",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#187163",
            color: "#fff",
          },
        }}
        onClick={handleClickOpen}
      >
        Add More
      </Button>
      <Dialog fullWidth maxWidth="sm" open={open}>
        <DialogTitle sx={{ background: " #187163;", color: "white" }}>
          Add Goal
        </DialogTitle>
        <DialogContent sx={{ marginTop: "20px" }}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={list}
            sx={{ width: "100%", height: "100px", marginTop: "10px" }}
            renderInput={(params) => (
              <TextField {...params}  label="Select Goal" />
            )}
            getOptionLabel={(option) => {
              return option.label;
            }}
            onChange={handleChange}
            filterSelectedOptions
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#187163" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={select == null  ? true : false}
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
