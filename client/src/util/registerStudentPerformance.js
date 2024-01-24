
import DownloadExcelSheet from './downloadExcel'
export default async function registerStudentPerformance ({examInfo,list,batch,roll}) {
    if (
        examInfo.studentsPerformance.length !== list.length
      ) {
        const isCheckStudent = [];
        const getRegisterList = []
        for (let i = 0; i < list.length; i++) {
          isCheckStudent.push(list[i].email);
        }
        for (let i = 0; i < examInfo.studentsPerformance.length; i++) {
          await sendDateStudent(
            batch,
            isCheckStudent,
            examInfo.studentsPerformance[i].mark,
            examInfo.negativeMark,
            examInfo.studentsPerformance[i].id,
            examInfo._id
          ).then(data =>  {
            if(data) getRegisterList.push(data);
          })
          .catch(error => console.log(error))
        }
     
       if(getRegisterList.length == examInfo.studentsPerformance.length) 
       {
       
       return fetch(`/api/${roll}/saveToBatch`,{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({getRegisterList,examID:examInfo._id,batchID:batch._id})
        })
        .then(res => res.json())
        .then(async(data) => {
            if(data.status == 'success')
            return  await DownloadExcelSheet({examInfo,list:getRegisterList})
        })
      
       }
     
    }
}
const sendDateStudent = async (batch,isCheckStudent,mark,negativeMark,userID,examID) => {
    try {
      
      const student = batch.studentList.filter(
        (task) => task.userID.valueOf() == userID.valueOf()
      );
      let examMark = mark - negativeMark;
      if (examMark < 0) examMark = 0;

      if(!isCheckStudent.includes(student[0].email))
  {   return {
        name: student[0].name,
        rollNumber: student[0].rollNumber,
        dept: student[0].dept,
        email: student[0].email,
        mark: examMark,
      };
    }
    else return undefined
    } catch (error) {
      throw error
    }
  }