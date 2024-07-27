import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { TextField, Autocomplete, Stack } from "@mui/material";

export default function Address({ isChange, setChange, color }) {
  const [address, setAddress] = useState({
    city: "",
    address: "",
    state: "",
    pincode: "",
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const submit = (data) => {
    setOpen(false);
  };

  const createAddress = () => {
  
    fetch("/api/user/createAddress", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(address),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") {
        
          setChange(!isChange);
          setOpen(false);
        }
      });
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{
          width: "100%",
          height: "30px",
          background: color,
          borderRadius: "4px",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginRight: "20px",
          color: "white",
          "&:hover": {
            backgroundColor: "#187163",
          },
          textTransform: "none",
        }}
        onClick={handleClickOpen}
      >
        Proceed to Payment
      </Button>
      <Dialog fullWidth maxWidth="sm" open={open}>
        <DialogTitle sx={{ background: " #187163;", color: "white" }}>
          Add Address
        </DialogTitle>
        <DialogContent sx={{ minHeight: "300px" }}>
          <Stack padding="10px" gap="10px">
            <TextField
              placeholder="Enter Address"
              type="text"
              label="Address"
              onChange={(e) =>
                setAddress((preValue) => {
                  const getValue = { ...preValue };
                  getValue.address = e.target.value;
                  return getValue;
                })
              }
            />
            <TextField
              placeholder="Enter City"
              label="City"
              type="text"
              onChange={(e) =>
                setAddress((preValue) => {
                  const getValue = { ...preValue };
                  getValue.city = e.target.value;
                  return getValue;
                })
              }
            />
            <TextField
              placeholder="Enter State"
              label="State"
              type="text"
              onChange={(e) =>
                setAddress((preValue) => {
                  const getValue = { ...preValue };
                  getValue.state = e.target.value;
                  return getValue;
                })
              }
            />
            <TextField
              placeholder=" Enter Pincode"
              label="Pincode"
              type="number"
              onChange={(e) =>
                setAddress((preValue) => {
                  const getValue = { ...preValue };
                  getValue.pincode = e.target.value;
                  return getValue;
                })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#187163" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={
              address.city == "" ||
              address.state == "" ||
              address.pincode == "" ||
              address.address == ""
                ? true
                : false
            }
            sx={{ color: "#187163" }}
            onClick={createAddress}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
