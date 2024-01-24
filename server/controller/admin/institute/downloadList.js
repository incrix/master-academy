
const Batch = require("../../../models/batch.js");
const {
  unSubmit,
} = require("../../../util/unSubmittedExam.js");
const Exam = require("../../../models/exam.js");
const QuestionCollection = require("../../../models/questionCollection.js");
exports.getDownloadList = async(req,res)=>{
try {
  const { batchID, examID } = req.body;
  await unSubmit(examID);
  const examInfo = await Exam.findOne({ _id: examID });
 const batch = await Batch.findOne({ _id: batchID });
  let getExamBatch = await Batch.findOne(
    {
      _id: batchID,
    },
    {
      scheduleTest: {
        $elemMatch: { examID },
      },
    }
  );
  let list = getExamBatch.scheduleTest;
  if(examInfo.studentsPerformance.length == list[0].studentPerformance.length){
 
   res.json({status:'success',getDownload:'complete',list:list[0],examInfo})
  }
  else{
    return res.json({status:'success',getDownload:'pending',list:list[0].studentPerformance,examInfo,batch})
  
  }
} catch (error) {
  throw error
}
}

exports.saveToBatch = async (req,res) =>{
  try {
    const { batchID, examID,getRegisterList} = req.body;

    const getExamBatch = await Batch.findOne(
      {
        _id: batchID,
      }
    );
    if(getExamBatch)
{    
  getExamBatch.scheduleTest.map(test => {
        if(test.examID.valueOf() == examID.valueOf()) test.studentPerformance = getRegisterList
      })
    
   await getExamBatch.save()
   return res.json({status:'success'})
  }
  return res.json({statu:'something went wrong'})
  } catch (error) {
    throw error
  }
}



exports.examDownload = async (req, res) => {
  const path = req.path;
  const emamID = path.split("/")[2];
  const examInfo = await Exam.findOne({ _id: emamID });
  try {
    if (examInfo) {
      const getQuestions = [];
      for (let i = 0; i < examInfo.questionCategory.length; i++) {
        for (
          let j = 0;
          j < examInfo.questionCategory[i].questionList.length;
          j++
        ) {
          const questionCollection = await QuestionCollection.findOne({
            _id: examInfo.questionCategory[i].questionList[j].id,
          });
          if (questionCollection) {
            getQuestions.push({
              title: questionCollection.title,
              options: questionCollection.options,
              quesImage:questionCollection.imageUrl,
              explanation:questionCollection.explanation,
              explanatinImageUrl:questionCollection.explanatinImageUrl
            });
          }
        }
      }
      return res.json({ questions: getQuestions,name:examInfo.title });
    }
    return res.status(404);
  } catch (error) {
    throw error;
  }
};




// fillter function
// const getEmail = []
// const getIndex = []
// list[0].studentPerformance.map((task,index) =>{
//   if(getEmail.includes(task.email) == false){
//     getEmail.push(task.email)
//   }else{
//     console.log(task.email);
//     getIndex.push(index)
//   }
// })
//   list[0].studentPerformance = [...list[0].studentPerformance.filter((task,index) =>  getIndex.indexOf(index) == -1 )]
//   getExamBatch.scheduleTest.studentPerformance = list[0].studentPerformance
//    getExamBatch.save()

///delete unnecessary user batch and institutionID

// const batch = await Batch.findOne({_id:'6582b1328c1cbe5950ca24bc'})
// const allUser = await User.find({
//          "batchID":
//           "6582b1328c1cbe5950ca24bc"

// })
// console.log(allUser.length);
// if(batch){
//   const getStudentEmail = []
//   const getStudentRollNumber = []
//   const getStudentDept = []
//   batch.scheduleTest.map(task =>{
//     if(task.studentPerformance.length > 0){
//       task.studentPerformance.map(task => {
//          if(getStudentEmail.indexOf(task.email) == -1)
//       {
// getStudentEmail.push(task.email)
// getStudentRollNumber.push(task.rollNumber)
// getStudentDept.push(task.dept)
//       }

//       })
//     }
//   })

//   for(let i=0;i<allUser.length;i++){
//     if(getStudentEmail.indexOf(allUser[i].email) == -1){
//       allUser[i].institutionID = undefined
//       allUser[i].batchID = []
//       //allUser[i].save()
//     }
//   }

//   const getUserData = []
//  for(let i=0;i<getStudentEmail.length;i++){
//   const user = await User.findOne({email:getStudentEmail[i]})
//   getUserData.push(user)
//  }
//  for(let i=0;i<getUserData.length;i++){
//   batch.studentList.push(
//     {
//       name:getUserData[i].name,
//       email:getUserData[i].email,
//       avatar:getUserData[i].avatar,
//       userID:getUserData[i]._id,
//       rollNumber:getStudentRollNumber[getStudentEmail.indexOf(getUserData[i].email)],
//       dept:getStudentDept[getStudentEmail.indexOf(getUserData[i].email)],
//       request:true
//     }
//   )
//  }
// batch.save()
// }
