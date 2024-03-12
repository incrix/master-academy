const Batch = require("../../../models/batch");
const institution = require("../../../models/institution");
const questionBank = require("../../../models/questionBank");
const User = require("../../../models/user");
const {getExamValid} = require('../../../util/time')
const crypto = require("crypto");
exports.createBatch = async (req, res, next) => {
  const id = req.body.id;
  const batchName = req.body.batchName;
  try {
    const institute = await institution.findOne({ _id: id });
    if (institute) {
      const check = [];
      if (institute.batch.length > 0)
        institute.batch.map((task) => check.push(task.name));

      if (check.indexOf(batchName) == -1) {
        const batchCode = crypto.randomBytes(5).toString("hex");
        const createBatch = await Batch({
          name: batchName,
          institutionID: id,
          batchCode: `#${batchCode}`,
        });
        if (createBatch) {
          await createBatch.save();
          institute.batch.push({ name: batchName, batchID: createBatch._id });
          institute.updatedAt = Date();
          try {
            await institute.save();
          } catch (error) {
            throw error
          }
        }
        res.json({
          status: "success",
          message: "The batch create successfully",
        });
      } else
        res.json({ status: "error", message: "The batch name already exists" });
    }
  } catch (error) {
  
    res.json({ status: "error", message: "Something wrong" });
  }
};

exports.getBatechTopic = async (req, res, next) => {
 

  try {
    const batch = await Batch.findOne({ _id: req.body.id });
    const bank = await questionBank.find();
    if (batch) {
      res.json({ status: "success", message: bank });
    } else res.json({ status: "error", message: "Something wrong" });
  } catch (error) {

    res.json({ status: "error", message: "Something wrong" });
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const batch = await Batch.findOne({ _id: req.body.id });
    if (batch) {
      const institute = await institution.findOne({ _id: batch.institutionID });
      const history = [];
      const details = {
        avatar: institute.avatar,
        name: institute.name,
        batchName: batch.name,
        batchCode: batch.batchCode,
      };

      if (batch.scheduleTest.length > 0) {
        for (let i = 0; i < batch.scheduleTest.length; i++) {
          let isValueStatus
          if(batch.scheduleTest[i].status == "pending") isValueStatus = await isValidExamEnd(batch.scheduleTest[i]);
          if (isValueStatus && batch.scheduleTest[i].status == "pending") {
            batch.scheduleTest[i].status = "complete";
            const {
              name,
              examID,
              status,
              examDate,
              examStartTime,
              examEndTime,
            } = batch.scheduleTest[i];
            history.push({
              name,
              examID,
              status,
              examDate,
              examStartTime,
              examEndTime,
            });
          } else {
            const {
              name,
              examID,
              status,
              examDate,
              examStartTime,
              examEndTime,
            } = batch.scheduleTest[i];
            history.push({
              name,
              examID,
              status,
              examDate,
              examStartTime,
              examEndTime,
            });
          }
        }
      }
  
      await batch.save()
      
      res.json({ status: "ok", message: batch, history, head: details });
    }
  } catch (error) {
    console.log(error);
  }
};

const isValidExamEnd = async function (examInfo) {
  // console.log('institionsss');
  // let date = new Date();
  // let indianTime = date.toLocaleString("en-US", {
  //   timeZone: "Asia/Kolkata",
  //   hour12: false,
  // });

  // const currentTime = indianTime;

  // let examDate = examInfo.examDate.split("/");
  // examDate = `${examDate[1]}/${examDate[0]}/${examDate[2]}`;

  // let examEnd = new Date(examDate + " " + `${examInfo.examEndTime}:00`);
  // examEnd.setHours(examEnd.getHours()+2)
  // examEnd.setMinutes(examEnd.getMinutes()+30)
  // let indianTimeEnd = examEnd.toLocaleString("en-US", {
  //   timeZone: "Asia/Kolkata",
  //   hour12: false,
  // });
  // return currentTime > indianTimeEnd;

  const check = await getExamValid(examInfo.examDate,examInfo.examEndTime)

  return check
  
};

exports.getRequestAccess = async (req, res, next) => {
  const { id, status, data } = req.body;

  try {
    const user = await User.findOne({ _id: data.userID });
    const batch = await Batch.findOne({ _id: id });
    if (batch) {
      if (status == "ok") {
        batch.studentList.map((task) => {
          if (task.userID == data.userID) task.request = true;
        });
        await batch.save();
        user.batchID.push(batch._id);
        user.institutionID = batch.institutionID;
        await user.save();

        res.json({
          status: "success",
          message: "resquest accept successfully",
        });
      } else if (status == "not ok") {
        const get = batch.studentList.filter(
          (task) => task.userID.valueOf() !== data.userID.valueOf()
        );
        batch.studentList = get;
        await batch.save();
        res.json({ status: "success", message: "Cancle request successfully" });
      } else if (status == "remove") {
        const get = batch.studentList.filter(
          (task) => task.userID.valueOf() !== data.userID.valueOf()
        );

        batch.studentList = get;
        await  batch.save();
        if(user.type == 'student')
     {   
      const getBatchID = user.batchID.filter(
          (task) => task.valueOf() !== batch._id.valueOf()
        );
        user.batchID = getBatchID;
        user.institutionID = undefined;
        await user.save();
     }
       
        res.json({
          status: "success",
          message: "Remaove student successfully",
        });
      }
    }
  } catch (error) {
    
    res.json({ status: "error", message: "something wrong" });
  }
};
