import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
} from '@mui/material';

import UserBlock from './UserBlock';
const ManageUser = ({ isCall,setCall,userList,nextPage,ControlNotification,filter,seachEmail}) => {
  const [page, setPage] = useState(0);
  const [savePageNum,setPageNum] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Sample list of names
  
  const handleChangePage = (event, newPage) => {

   if(savePageNum < newPage)
    {
       
        nextPage(newPage)
        setPageNum(newPage)
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  useEffect(()=>{setPageNum(0)},[filter])

  return (
    <Paper sx={{padding:'20px'}} >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Type</TableCell>
              <TableCell >Block</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : userList
            ).map((name, index) => (
              <TableRow key={index}>
                <TableCell  >{name.name}</TableCell>
                <TableCell>{name.email}</TableCell>
                <TableCell>{name.type}</TableCell>
                <TableCell > 
                    <UserBlock action={name.action} isCall={isCall} setCall={setCall} userID={name.userID} email={name.email} ControlNotification={ControlNotification} />
                    {/* <Switch {...label} defaultChecked = {name.action}
                 sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#187163'
                      },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#187163',
                      },
                  }}
                /> */}
                </TableCell>
              </TableRow>
            ))  }  
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[2]}
        component="div"
        count={userList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};



// function UserList  ({users}) {
//     return users.map((name, index) => (
//       <TableRow key={index}>
//         <TableCell  >{name.name}</TableCell>
//         <TableCell>{name.email}</TableCell>
//         <TableCell>{name.type}</TableCell>
//         <TableCell > <Switch {...label} defaultChecked = {name.action}
//          sx={{
//             '& .MuiSwitch-switchBase.Mui-checked': {
//                 color: '#187163'
//               },
//             '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//                 backgroundColor: '#187163',
//               },
//           }}
//         /></TableCell>
//       </TableRow>
//     ) )  
// }

export default ManageUser;
