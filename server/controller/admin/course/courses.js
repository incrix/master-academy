const Course = require("../../../models/course.js");
const questionBank = require("../../../models/questionBank.js");
exports.getCourse = async (req, res, next) => {
  const get = await Course.find();

  if (get) {
    res.json({ status: "ok", message: get });
  }
};

exports.getCourseDetails = async (req, res, next) => {
  const get = await Course.findOne({ _id: req.body.id });
  if (get) res.json({ status: "ok", message: get });
  else {
    res.json({ status: "not found", message: "something wrong" });
  }
};

exports.getCourseAvalible = async (req, res, next) => {
  const get = await Course.findOne({ _id: req.body.id });

  if (get) {
    const getbanksID = [];
    const courseSetting = [];
    get.collections.map((task) =>
      task.topic.map((task) => {
        getbanksID.push(task.id.valueOf());
      })
    );

    courseSetting.push({
      duration: get.duration,
      mark: get.mark,
      negativeMark: get.negativeMark,
      lowPercentage: get.lowPercentage,
      mediumPercentage: get.mediumPercentage,
      highPercentage: get.highPercentage,
    });

    const getBank = await questionBank.find();

    const avalibleQues = getBank.filter((task) => {
      if (getbanksID.indexOf(task._id.valueOf()) !== -1) {
        return task;
      }
    });
    res.json({
      status: "ok",
      message: avalibleQues,
      courseDetails: get.collections,
      courseSetting: courseSetting,
    });
  } else {
    res.json({ status: "not found", message: "something wrong" });
  }
};

exports.getCollectionName = async (req, res, next) => {
  const getName = [];
  const send = [];
  const fileName = [];
  const bank = await questionBank.find();

  const get = await Course.findOne({ _id: req.body.id });
 if(get){
  get.collections.map((task) => {
    if (task.title !== undefined) fileName.push(task.title);

    task.topic.map((task) => getName.push(task.title));
  });
}
  bank.map((task) => {
    if (getName.indexOf(task.title) == -1) {
      send.push(task);
    }
  });
  send.push({ fileName: fileName });
  res.json({
    status: "ok",
    message: send,
  });
};

exports.editGroupNameCourseCollection = async (req, res, next) => {
  const editName = await Course.findOne({ _id: req.body.courseID });
  if (editName) {
    editName.collections.filter((task) => {
      if (task.title == req.body.title) {
        task.title = req.body.changeName;
      }
    });

    editName.save();
    res.json({ status: "success", message: "Edit  group name successfully" });
  }
};

exports.publishCourse = async (req, res, next) => {
  const publish = await Course.findOne({ _id: req.body.id });
  if (publish) {
    console.log("call");
    console.log(publish)
    if (
      (publish.duration !== 0) &
      (publish.mark !== 0) 
    ) {
      if (publish.mockUpdate == true) {
        publish.status = "publish";
        publish.save();
        res.json({
          status: "success",
          message: `Published  successfully ${publish._id}`,
        });
      } else {
        res.json({ status: "info", message: "Please fill the mock setting" });
      }
    } else {
      console.log("out call");
      res.json({ status: "info", message: "Please fill the course setting" });
    }
  }
};

exports.checkPublish = async (req, res, next) => {
  const publish = await Course.findOne({ _id: req.body.id });
  if (publish) {
    console.log("call publish");
    if (publish.collections.length == 0) {
      publish.status = "draft";
      publish.mockUpdate = false;
      publish.mark = 0;
      publish.negativeMark = 0;
      publish.duration = 0;
      publish.lowPercentage = [0,0]
      publish.highPercentage = [0,0]
      publish.mediumPercentage = [0,0]
      publish.save();
    }
  }
};

exports.callDraft = async (req,res,next) =>{
  const Draft = await Course.findOne({ _id: req.body.id });
if(Draft){
  Draft.status = 'draft'
  Draft.save()
  res.json({ status: "success", message: "Course change Draft " });
}
else{
res.json({ status: "error", message: "something wrong" })
}
}