import { Paper,Stack } from '@mui/material'
import React from 'react'

export default function UserAnalysis({totalUser}) {


  return (
    <Stack  width='80%' padding='20px' >
        <Stack display='flex' gap='20px' direction='row' justifyContent='space-between' width='90%' >
        {
        totalUser.map(task => <Paper sx={{width:'200px',height:'100px',textAlign:'center' ,padding:'10px' }} >
            <p style={{color:'#187163'}}>{task.type}</p>
            <p style={{color:'#FEA800',padding:'10px'}} >{task.total}</p>
              </Paper >)
      }
        </Stack>   
    </Stack>
  )
}
