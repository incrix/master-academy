import { Stack ,Paper,TextField} from '@mui/material'
import React from 'react'
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
export default function SearchBar({filter,setFilter,setSearchEmail}) {

  return (
  <Paper sx={{height:'100px',width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px'}}>
    <Stack sx={{width:'200px'}}>
    < FilterSelect filter={filter} setFilter={setFilter} />
    </Stack>
<TextField sx={{marginRight:'50px'}}  
 helperText={''}
 placeholder='Enter Email'
 onChange={(e)=>setSearchEmail(e.target.value)}
/>
      </Paper>
  )
}


function FilterSelect({setFilter,filter}) {

   const options = ['Student','Institution',"Teacher","Blocked"]
    return (
      <FormControl fullWidth   >
        <InputLabel id="demo-simple-select-label">
        {filter == '' ? 'Select Filter' : filter}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={(e) => {
           
            setFilter(e.target.value)
          }}
          label={filter == '' ? 'Select Filter' : filter}
        >
       {
        options.map(task => <MenuItem value={task}>{task}</MenuItem>)
       }
        </Select>
      </FormControl>
    );
  }