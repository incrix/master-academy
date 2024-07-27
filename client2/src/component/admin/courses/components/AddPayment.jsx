import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Stack } from "@mui/material";

export default function AddPayment({courseSetting,setSetting}) {
  const [open, setOpen] = useState(false);
  const [pay,setPay] = useState({month:'',amount:'',discount:''})
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const submit = () => {
    
    setSetting((preValue)=>{
        let getValue = {...preValue}
        getValue.Payment.push({month:pay.month,amount:pay.amount,discount:pay.discount})
        let array = []
        getValue.Payment.map(task =>{
                array.push(task.month)
              })
            let i = 0, j;
            while (i < array.length) {
                j = i + 1;
                while (j < array.length) {
         
                    if (eval(array[j]) < eval(array[i])) {
                        let temp = array[i];
                        array[i] = array[j];
                        array[j] = temp;
                    }
                    j++;
                }
                i++;
            }
      
            const ascendingOrder = []
            array.map(order => {
              getValue.Payment.map(task =>  {
                if(order == task.month && ascendingOrder.indexOf(task) == -1)  ascendingOrder.push(task)
              })
            })
            getValue.Payment = ascendingOrder
        return getValue
    })
  //   setSetting((preValue)=>{
  //     let getValue = {...preValue}
  //     getValue.Payment.push({month:pay.month,amount:pay.amount,discount:pay.discount})
  //     let array = []
  //     getValue.Payment.map(task =>{
  //       array.push(task.month)
  //     })
  //     array = array.sort()
  //     const ascendingOrder = []
  //     getValue.Payment.map(task => {
  //     if(array.indexOf(task.month) ) ascendingOrder.push(task)
  //    })
  //    getValue.Payment = ascendingOrder
  //     return getValue
  // })
    setPay({month:'',amount:'',discount:''})
    setOpen(false);
  };
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
        Add Details
      </Button>
      <Dialog fullWidth maxWidth="sm" open={open}>
        <DialogTitle sx={{ background: " #187163;", color: "white" }}>
          Add Payment
        </DialogTitle>
        <DialogContent sx={{ marginTop: "20px" }}>
        <Stack>
            <p>
                Month
            </p>
        <TextField type='number' value={pay.month} onChange={(e)=>{
         setPay((preValue) =>{
            const getValue = {...preValue}
            getValue.month = e.target.value
            return getValue
         })
        }} />

        </Stack>
    
        <Stack>
            <p>
                Amount
            </p>
        <TextField type="number" value={pay.amount} onChange={(e)=>{
         setPay((preValue) =>{
            const getValue = {...preValue}
            getValue.amount = e.target.value
            return getValue
         })
        }} />

        </Stack>
        <Stack>
            <p>
            Discount
            </p>
        <TextField type='number' placeholder="" value={pay.discount} onChange={(e)=>{
            if(e.target.value < 100)
         setPay((preValue) =>{
            const getValue = {...preValue}
            getValue.discount = e.target.value
            return getValue
         })
        }} />

        </Stack>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#187163" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={pay.month !== '' && pay.amount !== '' && pay.discount !== '' ? false : true}
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
