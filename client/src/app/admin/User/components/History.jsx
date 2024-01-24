
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Stack } from "@mui/material";

import "../../../../App.css";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import DeleteExam from "./deleteExam";
import LoadingButton from "@mui/lab/LoadingButton";
import registerStudentPerformance from '../../../../util/registerStudentPerformance'
import DownloadExcelSheet from '../../../../util/downloadExcel'
export default function History({ history,Notificate ,setCall,isCall }) {

  return (
    <div  style={{ overflow: "scroll", height: "65vh" }}>
      {history.length > 0 ? (
        <List task={history} Notificate={Notificate}    setCall={setCall} isCall={isCall}/>
      ) : (
        <div
          style={{
            width: "100%",
            height: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#CACACA",
          }}
        >
          No Exam
        </div>
      )}
    </div>
  );
}

function List({ task ,Notificate, setCall,isCall}) {
  const { search } = useLocation();
  const [isLoadExcel,setLoadExcel] = useState([])
  const [showPdfPage, setShowPdfPage] = useState({
    show: false,
    roll: "",
    examID: "",
  });

  const batchID = search.split("=")[1];

  const handleDownload = async (examID) => {
    setLoadExcel((preValue) => {
      const getValue = [...preValue]
      getValue.push(examID.valueOf())
      return getValue
    })
    fetch("/api/institution/getDownloadList", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ examID, batchID }),
    })
      .then((res) => res.json())
      .then(async(data) => {
        if (data.status == "success" && data.getDownload == 'pending') {
        const getStatus = await registerStudentPerformance({examInfo:data.examInfo,list:data.list,batch:data.batch,roll:'admin'})

        if(getStatus == 'success') {
          setLoadExcel((preValue) => {
            const getValue = [...preValue]    
            return [...getValue.filter(task => task !== examID)]
          })
        }
        }
        if(data.status == "success" && data.getDownload == 'complete') {
          const getStatus = await  DownloadExcelSheet({examInfo:data.examInfo,list:data.list.studentPerformance})
        
          if(getStatus == 'success') {
            setLoadExcel((preValue) => {
              const getValue = [...preValue]    
              return [...getValue.filter(task => task !== examID.valueOf())]
            })
          }
        }

      })
  };


  const handleExamDownload = (examID) => {
  
    setShowPdfPage({
      show: true,
      roll: "institution",
      examID: examID,
    });
  };



  const style = {
    image: {
      width: "40px",
      height: " 40px",
    },
    name: {
      color: " ##000",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "normal",
    },
    rollNumber: {
      color: " ##000",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "normal",
    },
    status: {
      color: " ##000",
      fontSize: "18px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "normal",
    },
    date: {
      fontSize: "18px",
      fontWeight: "500",
    },
    time: {
      fontSize: "18px",
      fontWeight: "500",
      display: "inline-block",
    },
  };

  return (
    <TableContainer component={Paper}>
      {showPdfPage.show ? (
        <Button
          sx={{
            position: "absolute",
            top: "0",
            right: "40px",
            background: "#187163",
            color: "white",
            ":hover": {
              backgroundColor: "#187163",
            },
          }}
          onClick={() => {
            setShowPdfPage({
              show: false,
              roll: "",
              examID: "",
            });
          }}
        >
          Cancel
        </Button>
      ) : null}
      {!showPdfPage.show ? null : (
        <iframe
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            zIndex: 10000,
            width: "100%",
            height: "80vh",
          }}
          src={`/downloadPdf?=${showPdfPage.roll}=${showPdfPage.examID}`}
        ></iframe>
      )}
      <Table
        sx={{
          minWidth: 650,
          borderCollapse: "separate",
          borderSpacing: "20px",
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ width: "100px" }}>
              Name
            </TableCell>
            <TableCell align="center" sx={{ width: "100px" }}>
              Date
            </TableCell>
            <TableCell align="center" sx={{ width: "200px" }}>
              Exam Timing
            </TableCell>
            <TableCell align="center" sx={{ width: "150px" }}>
              Status
            </TableCell>
            <TableCell align="center" sx={{ width: "150px" }}>
              Exam Download
            </TableCell>
            <TableCell align="center" sx={{ width: "150px" }}>
            Download
            </TableCell>
            <TableCell align="center" sx={{ width: "150px" }}>
              Delete
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {task.map((row, index) => {
            return (
              <TableRow
                key={index}
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "0px 4px",
                }}
              >
                <TableCell component="th" align="left" scope="row">
                  <p style={style.name}>{task[task.length-(1+index)].name}</p>
                </TableCell>

                <TableCell align="center">
                  <p style={style.date}>{task[task.length-(1+index)].examDate}</p>
                </TableCell>
                <TableCell align="center">
                  {eval(task[task.length-(1+index)].examStartTime.split(":")[0] < 12) ? (
                    <p style={style.time}>{task[task.length-(1+index)].examStartTime} am </p>
                  ) : (
                    <p style={style.time}>
                      {eval(task[task.length-(1+index)].examStartTime.split(":")[0] - 12) +
                        ":" +
                        task[task.length-(1+index)].examStartTime.split(":")[1]}{" "}
                      pm{" "}
                    </p>
                  )}{" "}
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "18px",
                      display: "inline-block",
                    }}
                  >
                    to
                  </p>{" "}
                  {eval(task[task.length-(1+index)].examEndTime.split(":")[0] < 12) ? (
                    <p style={style.time}>{task[task.length-(1+index)].examEndTime} am </p>
                  ) : (
                    <p style={style.time}>
                      {eval(task[task.length-(1+index)].examEndTime.split(":")[0] - 12) +
                        ":" +
                        task[task.length-(1+index)].examEndTime.split(":")[1]}{" "}
                      pm{" "}
                    </p>
                  )}
                </TableCell>
                <TableCell align="center">
                  <p style={style.status}>
                    {task[task.length-(1+index)].status == "complete" ? "completed" : task[task.length-(1+index)].status}
                  </p>
                </TableCell>
                <TableCell align="center">
                  {task[task.length-(1+index)].status == "complete" ? (
                    <Button
                      style={{ background: "#187163", color: "white" }}
                      onClick={() => handleExamDownload(task[task.length-(1+index)].examID)}
                    >
                      View
                    </Button>
                  ) : (
                    <Button
                      style={{ background: "#787486", color: "white" }}
                      disabled
                    >
                      View
                    </Button>
                  )}
                </TableCell>
                <TableCell align="center">
                {task[task.length - (1 + index)].status == "complete" ? (
                    
                    isLoadExcel.indexOf(task[task.length - (1 + index)].examID.valueOf()) !== -1 ?
                    <LoadingButton
                    loading
                    sx={{
                    width:'110px',
                      height: "36px",
                      backgroundColor: "#187163",
                      "& .MuiCircularProgress-root": { color: "white" },
                    }}
                    /> :
                                    <Button
                                      style={{ background: "#187163", color: "white",  width:'110px', }}
                                      onClick={() =>
                                        handleDownload(task[task.length - (1 + index)].examID)
                                      }
                                    >
                                      Download
                                    </Button>
                                  
                                  ) : (
                                    <Button
                                      style={{ background: "#787486", color: "white" }}
                                      disabled
                                    >
                                      Download
                                    </Button>
                                  )}
                </TableCell >
                <TableCell align="center">
                     <DeleteExam Notificate={Notificate} examID={task[task.length-(1+index)].examID} examName={task[task.length-(1+index)].name} setCall={setCall} isCall={isCall}  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


// function List({ task }) {
//   const { search } = useLocation();
//   const batchID = search.split("=")[1];
//   const handleDownload = (examID) => {
//   axios.get('/api/institution/download',{  headers:{examid:examID,batchid:batchID}, responseType: 'blob' })
//     .then((response) => {
    
//        download(response.data, response.headers.filename);
//     });
//   };

//   const style = {
//     image: {
//       width: "40px",
//       height: " 40px",
//     },
//     name: {
//       color: " ##000",
//       fontSize: "16px",
//       fontStyle: "normal",
//       fontWeight: "700",
//       lineHeight: "normal",
//     },
//     rollNumber: {
//       color: " ##000",
//       fontSize: "14px",
//       fontStyle: "normal",
//       fontWeight: "400",
//       lineHeight: "normal",
//     },
//     status: {
//       color: " ##000",
//       fontSize: "18px",
//       fontStyle: "normal",
//       fontWeight: "500",
//       lineHeight: "normal",
//     },
//     date:{
//       fontSize: "18px",
//       fontWeight: "500",
  
//     },
//     time: {
//       fontSize: "18px",
//       fontWeight: "500",
//       display: "inline-block",
//     },
//   };

//   return (
//     <TableContainer component={Paper}>
//       <Table
//         sx={{
//           minWidth: 650,
//           borderCollapse: "separate",
//           borderSpacing: "20px",
//         }}
//         aria-label="simple table"
//       >
//         <TableHead>
//           <TableRow>
//             <TableCell align="left" sx={{ width: "100px" }}>
//               Name
//             </TableCell>
//             <TableCell align="center" sx={{ width: "100px" }}>
//               Date
//             </TableCell>
//             <TableCell align="center" sx={{ width: "200px" }}>
//               Exam Timing
//             </TableCell>
//             <TableCell align="center" sx={{ width: "150px" }}>
//               Status
//             </TableCell>
//             <TableCell align="center" sx={{ width: "150px" }}>
//               Download
//             </TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {task.map((row, index) => {
//             return (
//               <TableRow
//                 key={index}
//                 style={{
//                   borderCollapse: "separate",
//                   borderSpacing: "0px 4px",
//                 }}
//               >
//                 <TableCell component="th" align="left" scope="row">
//                   <p style={style.name}>{row.name}</p>
//                 </TableCell>

//                 <TableCell align="center"  ><p style={style.date} >{row.examDate}</p></TableCell>
//                 <TableCell align="center">
//                   {eval(row.examStartTime.split(":")[0] <= 12) ? (
//                     <p style={style.time}>{row.examStartTime} am </p>
//                   ) : (
//                     <p style={style.time}>
//                       {eval(row.examStartTime.split(":")[0] - 12) +
//                         ":" +
//                         row.examStartTime.split(":")[1]}{" "}
//                       pm{" "}
//                     </p>
//                   )}{" "}
//                   <p
//                     style={{
//                       fontWeight: 700,
//                       fontSize: "18px",
//                       display: "inline-block",
//                     }}
//                   >
//                     to
//                   </p>{" "}
//                   {
//                     eval(row.examEndTime.split(":")[0] <= 12) ? (
//                       <p style={style.time}>{row.examEndTime} am </p>
//                     ) : (
//                       <p style={style.time}>
//                         {eval(row.examEndTime.split(":")[0] - 12) +
//                           ":" +
//                           row.examEndTime.split(":")[1]}{" "}
//                         pm{" "}
//                       </p>
//                     )
//                   }
//                 </TableCell>
//                 <TableCell align="center">
//                   <p style={style.status}>{row.status == 'complete' ? 'completed' : row.status}</p>
//                 </TableCell>

//                 <TableCell align="center">
//                   {row.status == "complete" ? (
//                     <Button style={{ background: "#187163", color: "white" }} onClick={()=>handleDownload(row.examID)} >
//                       Download
//                     </Button>
//                   ) : (
//                     <Button
//                       style={{ background: "#787486", color: "white" }}
//                       disabled
//                     >
//                       Download
//                     </Button>
//                   )}
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }
