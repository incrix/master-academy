import React, { useEffect, useState } from 'react'
import InstitutionDetails from '../../../component/admin/institution/InstitutionDetails'
import InstitutionControl from '../../../component/admin/institution/institutionControl'
import Loader from '../../../util/Loader'
function Institution({ControlNotification}) {
  const [institute,setInstitute]= useState([])
  const [isloading,setLoading] = useState(false)
  const [isChange,setChange] = useState(false)
  const changeRoll =(data) => {
    fetch('/api/admin/changeRoll',{
      method:'POST',
      headers:{
        "Content-type":"application/json"
      },
      body:JSON.stringify({list:data})
    })
    .then(res => res.json())
    .then(data => {
      if(data.status == 'success'){
         callInstitutionList()
        setChange(!isChange)
      }
      ControlNotification(data.status,data.message)
    })
  }

const callInstitutionList = () => {
  setLoading(true)
  fetch('/api/admin/getInstitution')
  .then(res => res.json())
  .then(data => {
    if(data.status == 'success'){ 
    
      setInstitute(data.message)
      setLoading(false)
    }
    })
}

const searchInstitution = (result) =>{
  try {
    if(result !== '')
  {  fetch('/api/admin/searchInstitution',{
      method:'POST',
      headers:{
        "Content-type":"application/json"
      },
      body:JSON.stringify({name:result})
    }).then(res => res.json())
    .then(data =>{
      if(data.status == 'info')  return ControlNotification(data.status,data.message)
     if(data.status == 'success')  setInstitute(data.result)
    })}
  else return ControlNotification('info','Please Enter The Institution Name')
  } catch (error) {
    throw error
  }
}

useEffect(()=>{
  callInstitutionList()
},[])

  return (
    isloading ? <Loader /> :
    <div >
       <InstitutionControl changeRoll={changeRoll} isChange={isChange} searchInstitution={searchInstitution}  />
       <div style={{ marginTop:'20px',display:'flex',gap:'10px',flexDirection:'column', height:'70vh',overflowY:'scroll', padding:'5px',}}>
       {institute.length >0 ?  institute.map((task,index) => <InstitutionDetails task={task} key={index} ControlNotification={ControlNotification} /> )  : null }
       </div>
     
    </div>
  )
}

export default Institution
