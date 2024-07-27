import React, { useEffect, useState } from "react";
import Image from "../../../util/Avater";
import { Stack } from "@mui/material";
import ExamAnalysis from "./components/ExamAnalysis";
import UserAnalysis from "./components/UserAnalysis";
import Loader from '../../../util/Loader'
function Analystic() {
  const [examAnalysis,setExamAnalysis] = useState([])
  const [totalAnalysis,setTotalAnalysis] = useState([])
  const [totalUser,setTotalUser] = useState([])
  const [isLoad,setLoad] = useState(true)
  useEffect(() => {
    setLoad(true)
    fetch("/api/admin/examAnalysis")
      .then((res) => res.json())
      .then((data) => {
        if(data.status == 'success'){
          setExamAnalysis(data.getExamAnalysis)
          setLoad(false)
        }
      });

      fetch("/api/admin/getTotalPaymentAndExam")
      .then((res) => res.json())
      .then((data) => {
        if(data.status == 'success'){
          setTotalAnalysis(data.getTotalAnalysis)
        }
      });

      fetch("/api/admin/getTotalUsers")
      .then((res) => res.json())
      .then((data) => {
        if(data.status == 'success'){
          setTotalUser(data.getTotalUser)
         
        }
      });
  },[]);
  return isLoad ? <Loader /> :
  totalUser.length > 0 && examAnalysis.length > 0 && totalAnalysis.length > 0 && (  
<Stack display='flex' gap='20px' flexDirection='column' alignItems='center' justifyContent='center' height='90vh' >
  <UserAnalysis  totalUser ={totalUser}/>
   <ExamAnalysis examAnalysis={examAnalysis} totalAnalysis={totalAnalysis} />

  </Stack>)
}

export default Analystic;
