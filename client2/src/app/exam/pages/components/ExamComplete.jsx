import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ExamComplete({ examState,message }) {
    const navigate = useNavigate()
  const [open, setOpen] = useState(false);
 


  const handleClose = () => {
    // setOpen(false);
    navigate('/login')
  };

  

  useEffect(()=>{
    setOpen(examState)
  },[examState])


  return (
    <div>
   
      <Dialog fullWidth maxWidth="sm" open={open}>
        <DialogTitle sx={{ textAlign:'center', background: " #187163;", color: "white" }}>
       { message}
        </DialogTitle>
      
        <DialogActions sx={{display:'flex',alignItems:'center',justifyContent:'center',height:'10vh'}}>
          <Button style={{ color: "white",background:'#187163',width:'50px',height:'30px'}} onClick={handleClose}>
            Ok
          </Button>
        
        </DialogActions>
      </Dialog>
    </div>
  );
}
