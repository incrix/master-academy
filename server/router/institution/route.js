const router = require("express").Router();
const {
  getBank,
  deleteQues,
  createQues,
  Get,
  getBankName,
  editQuestion,
  searchQues,
  createQuestionBank,
} = require("../../controller/admin/questionUpload/questionUpload.js");

const {
  getCourse,
  getCourseDetails,

  getCourseAvalible,

} = require("../../controller/admin/course/courses.js");

const { getUser, changeRoll,getUserID,getUserDetails } = require("../../controller/admin/user/user.js");
const { getInstitutions } = require("../../controller/admin/controller.js");

const {
  getInstitution,
  getInstituteName,
  getTeacher,
  createTeacher,
  addTeacherBatch,
  editTeacherAction,
  removeTeacher
} = require("../../controller/admin/institute/institute.js");
const {
  createBatch,
  getBatechTopic,
  getHistory,
  getRequestAccess,
} = require("../../controller/admin/institute/batch.js");
const {
  deleteBatchTopic,deleteExam
} = require("../../controller/admin/institute/delete.js");

const {
  createScheduleExam,
} = require("../../controller/admin/exam/createExam.js");

const {downloadList,examDownload,getDownloadList,saveToBatch} = require("../../controller/admin/institute/downloadList.js")
//GET

//download PDF
router.get('/examDownload/*',examDownload)

router.get("/getBank", getBank);
router.get("/getCourse", getCourse);
router.get("/getuser", getUser);
router.get("/getuserID", getUserID);
router.get("/getInstitution", getInstitutions);
router.get("/getInstitute", getInstituteName);
router.get("/getTeacher", getTeacher);
router.get("/getUserDetails",getUserDetails)

// POST

router.post("/question", Get);
router.post("/getBankName", getBankName);
router.post("/getCourseDetails", getCourseDetails);
router.post("/getCourseAvalible", getCourseAvalible);


//Download Excel
router.post('/getDownloadList',getDownloadList)
router.post('/saveToBatch',saveToBatch)


// Institute
router.post("/changeRoll", changeRoll);
router.post("/getInstitution", getInstitution);

// delete schedule exam 
router.post("/deleteExam",deleteExam)
//createBatch

router.post("/createBatch", createBatch);
//getBatechTopic
router.post("/getBatechTopic", getBatechTopic);

//createScheduleExam
router.post("/createScheduleExam", createScheduleExam);

router.post("/getHistory", getHistory);

//getRequestAccess
router.post("/getRequestAccess", getRequestAccess);
//createTeacher
router.post("/createTeacher", createTeacher);
//addTeacherBatch
router.post("/addTeacherBatch", addTeacherBatch);
//editTeacherAction
router.post("/editTeacherAction", editTeacherAction);

//RemoveTeacher
router.post('/removeTeacher',removeTeacher)


module.exports = router;
