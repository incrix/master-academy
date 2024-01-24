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
  createCourse,
  createCourseTopic,
  createCourseGroup,
  createGroupTopic,
  createCourseMock,
  createCourseDuration,
} = require("../../controller/admin/course/createCourse.js");
const {
  getCourse,
  getCourseDetails,
  getCollectionName,
  editGroupNameCourseCollection,
  getCourseAvalible,
  publishCourse,
  checkPublish,
  callDraft,
} = require("../../controller/admin/course/courses.js");
const {
  deleteCourseCollection,
  deleteGroupCourseCollection,
} = require("../../controller/admin/course/deleteCourse.js");

const { getUser, changeRoll,getUserID,getUserDetails } = require("../../controller/admin/user/user.js");
const { getInstitutions,searchInstitution } = require("../../controller/admin/controller.js");
const { examAnalysis,getTotalPaymentAndExam,getTotalUsers } = require('../../controller/admin/analystics/analysis.js')
const {manageUser,nextPageManageUser,pageManageUserFilter,pageManageUserSeachEmail,manageUserBlock} = require('../../controller/admin/manage/manageUser')
const {
  getInstitution,
  getInstituteName,
  getTeacher,
  createTeacher,
  addTeacherBatch,
  editTeacherAction,
  removeTeacher,

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

const {examDownload,getDownloadList,saveToBatch} = require("../../controller/admin/institute/downloadList.js")
//GET

//reWriteModules
const {clearAvatarAndHistory} = require("../../util/reWriteModule.js")

//download PDF
router.get('/examDownload/*',examDownload)


// get analystic 
router.get('/examAnalysis',examAnalysis)
router.get('/getTotalPaymentAndExam',getTotalPaymentAndExam)
router.get('/getTotalUsers',getTotalUsers)


// get Manage User 
router.get("/manageUser",manageUser);
router.post("/pageManageUserSeachEmail",pageManageUserSeachEmail)
router.post('/manageUserBlock',manageUserBlock)
router.post("/nextPageManageUser",nextPageManageUser);
router.post('/pageManageUserFilter',pageManageUserFilter)

router.get("/getBank", getBank);
router.get("/getCourse", getCourse);
router.get("/getuser", getUser);
router.get("/getuserID", getUserID);
router.get("/getInstitution", getInstitutions);
router.get("/getInstitute", getInstituteName);
router.get("/getTeacher", getTeacher);
router.get("/getUserDetails",getUserDetails)

// POST

//Download Excel
router.post('/getDownloadList',getDownloadList)
router.post('/saveToBatch',saveToBatch)

router.post("/question", Get);
router.post("/getBankName", getBankName);
router.post("/getCourseDetails", getCourseDetails);
router.post("/getCourseAvalible", getCourseAvalible);

// create Course

router.post("/createCourse", createCourse);
router.post("/createCourseTopic", createCourseTopic);
router.post("/createGroupTopic", createGroupTopic);
router.post("/createCourseGroup", createCourseGroup);
router.post("/createCourseMock", createCourseMock);
router.post("/createCourseDuration", createCourseDuration);

// ques  create and bank
router.post("/createBank", createQuestionBank);
router.post("/createQuestion", createQues);

// serach and edit
router.post("/editQuestion", editQuestion);
router.post("/searchQues", searchQues);

// Delete
router.post("/deleteQuestion", deleteQues);
router.post("/deleteCourseCollection", deleteCourseCollection);
router.post("/deleteGroupCourseCollection", deleteGroupCourseCollection);
router.post("/deleteBatchTopic", deleteBatchTopic);

// delete Schedule exam 
router.post("/deleteExam",deleteExam)

//getCollectionName

router.post("/getCollectionName", getCollectionName);

// edit Name
router.post("/editGroupNameCourseCollection", editGroupNameCourseCollection);

// course publish
router.post("/publishCourse", publishCourse);
router.post("/checkPublish", checkPublish);

// callDraft
router.post("/callDraft", callDraft);

// Institute
router.post("/changeRoll", changeRoll);
router.post("/getInstitution", getInstitution);
router.post('/searchInstitution',searchInstitution)
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



//reWriteModelue API
router.get('/clearAvatarAndHistory',clearAvatarAndHistory)

module.exports = router;
