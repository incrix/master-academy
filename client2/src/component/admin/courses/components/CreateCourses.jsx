import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import AddOption from "./AddOption";
export default function CreateCourses({ createBank }) {
  const [open, setOpen] = useState(false);
  const [bankName, setName] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getBankName = (e) => {
    setName(e.target.value);
  };
  const submit = () => {
    createBank(bankName);
    setName("");
    setOpen(false);
  };
  return (
    <div>
      <Button
        variant="outlined"
        style={{ border: "none", backgroundColor: "#FEA800", color: "white" }}
        onClick={handleClickOpen}
      >
        Create Course
      </Button>
      <Dialog fullWidth maxWidth={"sm"} open={open}>
        <DialogTitle sx={{ background: " #187163;", color: "white" }}>
          Create Course
        </DialogTitle>
        <DialogContent>

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
            placeholder="Enter Course Name"
            onChange={getBankName}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#187163" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={bankName === "" ? true : false}
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
