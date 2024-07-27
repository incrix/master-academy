import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function AddNew({changeRoll,isChange}) {

  const [open, setOpen] = useState(false);
  const [list,setList] = useState([])
  const [select,selectOption] = useState({email:'',id:'',name:'',})

  const handleClickOpen = () => {
    setOpen(true)
  };
  const handleClose = () => {
    setOpen(false);
  };

  const submit = () => {
    callList()
    changeRoll(select)
    setOpen(false);
  };
  const callList = async () =>{
    
     fetch('/api/institution/getuserID')
    .then(res => res.json())
    .then(data => {  
        const userList =[] 
        data.message.map(task => userList.push({email:task.email,id:task._id}))
      setList(userList)
          
    })
    
}
const handleChange = (event, value) => {if(value !== null) selectOption((preValue)=>{
    const getvalue ={...preValue}
    getvalue.email = value.email
    getvalue.id = value.id
    return getvalue
})
else  selectOption((preValue)=>{
    const getvalue ={...preValue}
    getvalue.email = ''
    getvalue.id = ''
    return getvalue
})
}
  useEffect(()=>{
  callList()
  },[isChange])



  return (
    <div >
      <Button
      
        variant="contained"
     
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
        Add New
      </Button>
      <Dialog fullWidth maxWidth="sm"   open={open}  >
        <DialogTitle sx={{ background: " #187163;", color: "white" }}>
          
        Add New
        </DialogTitle>
        <DialogContent sx={{marginTop:'20px' }}  >
        <Autocomplete
      disablePortal
    
      id="combo-box-demo"
      options={list}
    
      sx={{ width:'100%' ,height:'100px',marginTop:'10px' }}
      renderInput={(params) =>   <TextField {...params}   label= "Account ID" /> }
      getOptionLabel={(option) => {
      
      return    option.email
    }}
    onChange={handleChange}
    filterSelectedOptions
    />

     <TextField label='Institute Name' onChange={(e) => selectOption((preValue)=> {
        const getValue = {...preValue}
        getValue.name = e.target.value
        return getValue
     }) } />

        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#187163" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={select.name == '' || select.email == '' ? true : false}
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

