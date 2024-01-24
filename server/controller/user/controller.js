const User = require("../../models/user.js");
const crypto = require("crypto");
const { SendEmail } = require("../email/email.js");
const { generateOtp } = require("../../util/OTB.js");
const Batch = require("../../models/batch.js");
const Institution = require("../../models/institution.js");
const Goal = require("../../models/goal.js");
const Exam = require("../../models/exam.js");
const examState = require("../../models/examState.js");
const sessions = require("../../models/session.js");
const Course = require("../../models/course.js");
const {getGoalAnalysis} = require('./getGoalAnalysis.js')
const {
  getInstitutionDetails,
} = require("../../util/getInstitutionDetails.js");

exports.login = async (req, res, next) => {
  try {
  const password = req.body.password;
  const secret = "This is a company secret ";
  const sha256Hasher = crypto.createHmac("sha256", secret);
  const hash = sha256Hasher.update(password).digest("hex");
  const check = await User.findOne({ email: req.body.email,password: hash });
  if (check) {
 
    if(check.action == true) {
      return res.json({ status: "error", message: "Your Account Has Been Blocked" });
    }
    let get = await sessions.find();
    const getVerify = await isLogin(get, check.email);
    if (getVerify.length == 0) {
      req.session.isAuth = true;
      req.session.isLogin = true;
      req.session.userID = check._id;
      req.session.userRoll = check.type;
      req.session.userName = check.name;
      req.session.email = check.email;
      req.session.institutionID = check.institutionID !== undefined ? check.institutionID : undefined
      const State = await examState.findOne({ userID: check._id });
      if (State) {      
        req.session.examID = State.examID;
       return res.json({ status: "isExam",examID:State.examID });
      } else {
        if (check.avatar == undefined || check.name == undefined || check.avatar == '') {
          req.session.isCreate = true;
          req.session.checkPage = 'userDetails' 
          return res.json({ status: "userDetails" }) 
        }
        if (check.goal.length == 0) {
          req.session.isCreate = true;
          req.session.checkPage = 'goal' 
          return res.json({ status: "goal" });
        }
        return res.json({ status: "success", id: check._id, roll: check.type,institutionID:check.institutionID !== undefined ? check.institutionID : '' });
      }
    } else {
     await sessions.deleteMany({
        expires: getVerify[0].expires,
      }).then(function () {
        console.log("Data deleted"); //  Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
   
      const State = await examState.findOne({ userID: check._id });
      req.session.isAuth = true;
      req.session.isLogin = true;
      req.session.userID = check._id;
      req.session.userRoll = check.type;
      req.session.userName = check.name;
      req.session.email = check.email;
      req.session.institutionID = check.institutionID !== undefined ? check.institutionID : undefined
      if (State) {
        req.session.examID = State.examID;
       return res.json({ status: "isExam" ,examID:State.examID });
      }

      if (check.avatar == undefined || check.name == undefined || check.avatar == '') {
        req.session.isCreate = true;
        req.session.checkPage = 'userDetails' 
        return res.json({ status: "userDetails" });
      }
      
      if (check.goal.length == 0) {
        req.session.isCreate = true;
        req.session.checkPage = 'goal' 
        return res.json({ status: "goal" });
      }

     return res.json({ status: "success", id: check._id, roll: check.type,institutionID:check.institutionID !== undefined ? check.institutionID : '' });
    }
  } else {
    res.json({ status: "error", message: "Incorrect email or password " });
  }
} catch (error) {
    throw error
}
};

function isLogin(data,email) {
  return data.filter((task) => task.session.email == email);
}

exports.create = async (req, res, next) => {
 try {
  if(typeof(req.body.email) == 'string')
{  
  const check = await User.findOne({ email: req.body.email });
  if (!check) {
    if (req.session.changeEmail && req.session.changePassword) {
     delete req.session.changeEmail
     delete req.session.changePassword
    }
    req.session.isCreate = true;

    const password = req.body.password;
    const secret = "This is a company secret ";
    const sha256Hasher = crypto.createHmac("sha256", secret);
    const hash = sha256Hasher.update(password).digest("hex");

    req.session.isAuth = true;
    req.session.email = req.body.email;
    req.session.password = hash;
    const otp = generateOtp();

    req.session.Otp = otp;
  await  SendEmail(req.body.email, otp);
    res.json({ status: "success", message: "Verify your account" });
  } else {
    res.json({ status: "error", message: "Account already exists " });
  }}
} catch (error) {
  throw error
}
};

exports.resendOtp = async (req, res, next) => {
  try {
    const otp = generateOtp();
    if(req.session.wrongCountOtp ) req.session.wrongCountOtp = 0
    req.session.Otp = otp;
    if (req.session.email !== undefined) {
     await SendEmail(req.session.email, otp);
      res.json({ status: "success", message: "Resend OTP successfully" });
    } else if(req.session.changeEmail) 
    {
     await SendEmail(req.session.changeEmail, otp);
      res.json({ status: "success", message: "Resend OTP successfully" });
    }
    else
    res.json({ status: "error", message: "somthing wrong" });
  } catch (error) {
    throw error
  }
};
exports.forgotPass = async (req, res, next) => {
  try {
    const password = req.body.password
    const email = req.body.email;
    if(typeof(email) == 'string')
    {
    const user = await User.findOne({ email });
    if (user) {
      const secret = "This is a company secret ";
      const sha256Hasher = crypto.createHmac("sha256", secret);
      const hash = sha256Hasher.update(password).digest("hex");
      req.session.changeEmail = email
       req.session.changePassword = hash
      const otp = generateOtp();
      req.session.Otp = otp;
     await SendEmail(email, otp);
      res.json({ status: "success", message: '"Verify your account"' });
    }
    else res.json({ status: "error", message: "Email does not exist yet" });
    } else res.json({ status: "error", message: "something wrong"})
  } catch (error) {
    throw error
  }
};
exports.checkOtp = async (req, res, next) => {
  if (!req.session.changeEmail && !req.session.changePassword) {
    if (req.session.Otp == req.body.otp) {
      const createAccount = await User({
        email: req.session.email,
        password: req.session.password,
      });
      req.session.userID = createAccount._id;
      await createAccount.save();
      res.json({ status: "success", change : 'create' , message: "Account create successfully" });
    } else {
      if(req.session.wrongCountOtp == undefined) req.session.wrongCountOtp = 1
      else {
        req.session.wrongCountOtp += 1
        if(req.session.wrongCountOtp > 5) {
          const otp = generateOtp();
          req.session.Otp = otp;
         await SendEmail(req.session.email, otp);
          req.session.wrongCountOtp = 0
         return res.json({ status: "info", message: "resend OTP successfully" })
        }
      }
     return res.json({ status: "error", message: "The otp is not match" })
    };
  } else if (req.session.changeEmail && req.session.changePassword) {
    if (req.session.Otp == req.body.otp) {
      const user = await User.findOne({ email: req.session.changeEmail });
     
      if (user) { 
         user.password = req.session.changePassword   
         await user.save()

        res.json({
          change:'edit',
          status: "success",
          message: "Change password successfully",
        });
      } 
      else res.json({ status: "error",message: "Something wrong" });
    }
    else {
      if(req.session.wrongCountOtp == undefined) req.session.wrongCountOtp = 1
      else {
        req.session.wrongCountOtp += 1
        if(req.session.wrongCountOtp > 5) {
          const otp = generateOtp();
          req.session.Otp = otp;
          SendEmail(req.session.changeEmail, otp);
          req.session.wrongCountOtp = 0
         return res.json({ status: "info", message: "resend OTP successfully" })
        }
      }

    return  res.json({ status: "error", message: "The otp is not match" })
  }
  }
};

exports.createDetails = async (req, res, next) => {

  const user = await User.findOne({ _id: req.session.userID });
  if (user) {
    user.name = req.body.name;
    user.phoneNumber = req.body.phone;
    user.gender = req.body.gender;
    user.avatar = req.body.avatar;
    await user.save();
    if(req.session.checkPage == 'userDetails') req.session.checkPage  = undefined
    if(user.goal.length == 0) return res.json({ status: "success" , change:'create', message: "Save the details successfully" });
    else res.json({ status: "success", change:'edit', message: "Save the details successfully" });
  } else res.json({ status: "error", message: "Something wrong" });
};

exports.chooseGoal = async (req, res, next) => {
  const goal = req.body.goal;

  const user = await User.findOne({ _id: req.session.userID });

  if (user) {
    goal.map((task) => {
      const collectTopic = [];
      const getID = [];
      task.collections.map((task) => {
        task.topic.map((task1) => {
          if (task.type == "group") getID.push(task1.id);
        });
        collectTopic.push({
          type: task.type,
          topicName: task.type == "group" ? task.title : task.topic[0].title,
          topicID: task.topicID,
          bankID: task.type == "group" ? getID : [task.topic[0].id],
        });
      });

      const createGoal = Goal({
        courseName: task.title,
        courseId: task._id,
        userId: user._id,
        topics: collectTopic,
      });

       createGoal.save();
      user.goal.push(createGoal._id);
    });

    await user.save();

    res.json({ status: "success", message: "Save the details successfully" });
  } else res.json({ status: "error", message: "Something wrong" });
};

exports.request = async (req, res, next) => {
  const { userID, instituteID, rollNumber, Dept, batchCode } = req.body.data;

  try {
    const user = await User.findOne({ _id: req.session.userID });
  
    if (user) {
      const institute = await Institution.findOne({ _id: instituteID });
     
      if (institute) {
        const batch = await Batch.findOne({
          batchCode: batchCode,
          institutionID: instituteID,
        });
        if (batch) {
          const check = [];
    if(batch.studentList){ 
      if(batch.studentList.length > 0  )
      {    batch.studentList.map((task) => {
            if (user.email == task.email) check.push(task);
          });}}
          
          if (check.length == 0 || batch.studentList == undefined) {
            batch.studentList.push({
              name: user.name,
              avatar: user.avatar,
              email: user.email,
              userID: user._id,
              rollNumber: rollNumber,
              dept: Dept,
            });
            await batch.save();
            res.json({
              status: "success",
              message: "institute join request successfully",
            });
          } else
            res.json({ status: "error", message: "your already registered" });
        } else res.json({ status: "error", message: "something wrong" });
      } else res.json({ status: "error", message: "something wrong" });
    } else res.json({ status: "error", message: "something wrong" });
  } catch (error) {
    throw error
  }
};

exports.getUserData = async (req, res, next) => {
  try {
    const userID = req.body.id;
    const user = await User.findOne({ _id:req.session.userID });
    const getUserGoal = await Goal.find({userId:req.session.userID});
   
    // const course = await Course.find();
    // const exam = await Exam.find();

    if (user) {
      let check = [];
      let calcTolalQues = 0;
      let topic = {
        courseName: "",
        courseId: "",
        topic: [],
        duration: "",
        noOfQuestion: "",
        totalMArk: "",
        Payment:[],
        plan:""
      };
      let instuteDetails = {};

      if (user.institutionID !== undefined) {
        instuteDetails = await getInstitutionDetails(
          user.institutionID,
          user.batchID,
        );
      }
    
      // user.goal.map((task) => check.push(task.valueOf()));
      // // get Goal
      // const getUserGoal = goal.filter(
      //   (task) => check.indexOf(task._id.valueOf()) !== -1
      // );
  

      check = [];
      const send = [];
      const studentsPerformance = [];
      let getCourseID =  [getUserGoal[0].courseId.valueOf()]

      //get Course
      // const get = course.filter(
      //   (task) => getCourseID.indexOf(task._id.valueOf()) !== -1
      // );
      const get = await Course.find({_id:getCourseID})
      const getTopicID = [];
      const createTopic = [];

      // get course collection topicID
      get[0].collections.map((task) => getTopicID.push(task.topicID));

      getUserGoal.map((task, index) => {
        task.topics.map((task) => {
          if (getTopicID.indexOf(task.topicID) !== -1) {
            createTopic.push(task.topicID);
          }
        });
      });

      //create new topic in goal
      const getCheck = [];
      get[0].collections.map((task) => {
        if (
          createTopic.indexOf(task.topicID) == -1 &&
          getCheck.indexOf(task.topicID) == -1
        ) {
          const getID = [];
          
          task.topic.map((task) => getID.push(task.id));
       
          getUserGoal[0].topics.push({
            type: task.type,
            topicName: task.type == "group" ? task.title : task.topic[0].title,
            topicID: task.topicID,
            bankID: getID,
          });
          getCheck.push(task.topicID);
        }
      });
      getUserGoal.map((task, index) => {
        const topicName = [];
        const topicAnalysis = [];

        task.topics.map((task) => {
          if (getTopicID.indexOf(task.topicID) !== -1) {
            createTopic.push(task.topicID);
            topicName.push(task.topicName);
            topicAnalysis.push(task.accuracy);
          }
        });

        if (index == 0)
       {   studentsPerformance.push({
            score: task.examHistory,
            Analysis: {
              topicName,
              topicAnalysis,
            },
          });}

        check.push(task.courseId.valueOf());
        send.push({
          courseName: task.courseName,
          coursePlan: task.plan,
          courseId: task.courseId,
        });
      });

      if (get.length > 0) {
        topic.courseId = get[0]._id;
        topic.courseName = get[0].title;
        get[0].collections.map((collection, index) => {
          if (collection.type == "topic") {
            collection.topic.map((task) => {
              if (
                eval(task.level.easy >= 0) &&
                eval(task.level.medium >= 0) &&
                eval(task.level.hard >= 0)
              ) {
                topic.topic.push({
                  title: task.title,
                  id: collection._id,
                  type: collection.type,
                  topicLength: collection.topic.length,
                  isSelect: false,
                  bankID: task.id,
                });
              }
            });
          } else if (collection.type == "group")
            collection.topic.map((task) => {
              const ListTopic =[]
              if (
                eval(task.level.easy >= 0) &&
                eval(task.level.medium >= 0) &&
                eval(task.level.hard >= 0)
              ) {

                if(collection.type == "group"){
                  collection.topic.map(task1 =>{
                   
                    ListTopic.push({title:task1.title,id:task1.id,isSelect: false,})})
                  
                }
                topic.topic.push({
                  title: collection.title,
                  id: collection._id,
                  type: collection.type,
                  topicLength: collection.topic.length,
                  isSelect: false,
                  bankID: task.id,
                  ListTopic
                });
              }
            });
        });
      }
      const getIndex = [];
      const retry = [];
      topic.topic.map((task) => {
        if (getIndex.indexOf(task.id.valueOf()) == -1) {
          getIndex.push(task.id.valueOf());
          retry.push(task);
        }
      });

      topic.topic = retry;
      if (get.length > 0) {
        get[0].collections.map((task, index) => {
          task.topic.map((task) => {
            calcTolalQues +=
              eval(task.level.easy) +
              eval(task.level.medium) +
              eval(task.level.hard);
          });
        });
        (topic.duration = get[0].duration),
          (topic.noOfQuestion = calcTolalQues),
          (topic.totalMArk = get[0].mark * calcTolalQues);
          topic.Payment = get[0].Payment
          topic.plan = getUserGoal[0].plan
          req.session.Plan = get[0]._id
      }

      await getUserGoal[0].save();
     return res.json({
        status: "ok",
        message: user,
        goal: getUserGoal,
        data: send,
        topic: topic,
        instuteDetails,
        studentsPerformance: studentsPerformance[0],
      });
    }
   return res.json({ staus: "error", message: "something wrong" });
  } catch (error) {
    
    res.json({ staus: "error", message: "something wrong" });
  }
};

exports.getGoal = async (req, res, next) => {
  try {
    const { id } = req.body;
    const course = await Course.find();
    const user = await User.findOne({ _id: req.session.userID });
    const getGoalID = await Goal.find({userId:req.session.userID});
    if (user) {
      let goalID = [];
      // user.goal.map((task) => goalID.push(task._id.valueOf()));

      // const getGoalID = goal.filter(
      //   (task) => goalID.indexOf(task._id.valueOf()) !== -1
      // );

      // goalID = [];
      getGoalID.map((task) => goalID.push(task.courseId.valueOf()));

      const getGoal = course.filter(
        (task) => goalID.indexOf(task._id.valueOf()) == -1
      );
      goalID = [];
      // getGoal.map((task) => {
      //   if (task.status == "publish")
      //     goalID.push({ label: task.title, id: task._id });
      // });
  for(let i=0;i<getGoal.length;i++){
    if (getGoal[i].status == "publish")
     { 
       goalID.push({ label: getGoal[i].title, id:getGoal[i]._id });
    }
  }
     return res.json({ status: "ok", message: goalID });
    }  return res.json({ status: "not",});
  } catch (error) {
    throw error
  }
};

exports.addGoal = async (req, res, next) => {
  const { id, goal } = req.body;
 
  try {
    const user = await User.findOne({ _id: id });
    const course = await Course.find();
    if (user) {
      const getGoalID = [];
      getGoalID.push(goal.id.valueOf());
      const getCourse = course.filter(
        (task) => getGoalID.indexOf(task._id.valueOf()) !== -1
      );

      getCourse.map(async (task) => {
        const collectTopic = [];
        task.collections.map((task) => {
          const getID = [];

          task.topic.map((task) => getID.push(task.id));
          collectTopic.push({
            type: task.type,
            topicName: task.type == "group" ? task.title : task.topic[0].title,
            topicID: task.topicID,
            bankID: getID,
          });
        });

        const createGoal = await Goal({
          courseName: task.title,
          courseId: task._id,
          userId: user._id,
          topics: collectTopic,
        });
      
        await createGoal.save();
        user.goal.push(createGoal._id);
      });
      await user.save();
      res.json({ status: "success", message: "Add goal successfully" });
    }
  } catch (error) {
    res.json({ status: "error", message: "something wrong" });
  }
};

exports.getViewGoal = async (req, res, next) => {
  try {
    const userID = req.session.userID;
    const { getGoalId } = req.body;
    req.session.userChooseGoal = getGoalId.courseId.valueOf()
    const course = await Course.findOne({ _id: getGoalId.courseId });
    const goal = await Goal.findOne({
      courseId: getGoalId.courseId,
      userId: userID,
    });

    if (course) {

// getAnalysis
const studentsPerformance = await getGoalAnalysis(getGoalId.courseId,userID)
      const send = [];
      let calcTolalQues = 0;
      const topic = {
        courseName: course.title,
        courseId: course._id,
        topic: [],
        topicLength: "",
        duration: "",
        noOfQuestion: "",
        totalMArk: "",
        Payment:[],
        plan:""
      };

      course.collections.map((collection, index) => {
        if (collection.type == "topic") {
          collection.topic.map((task) => {
            if (
              eval(task.level.easy >= 0) &&
              eval(task.level.medium >= 0) &&
              eval(task.level.hard >= 0)
            ) {
              topic.topic.push({
                title: task.title,
                id: collection._id,
                type: collection.type,
                isSelect: false,
                topicLength: collection.topic.length,
                bankID: task.id,
              });
            }
          });
        } else if (collection.type == "group")
          collection.topic.map((task) => {
            
            const ListTopic =[]
          
            if (
              eval(task.level.easy >= 0) &&
              eval(task.level.medium >= 0) &&
              eval(task.level.hard >= 0)
            ) {
              if(collection.type == "group"){
                collection.topic.map(task1 =>{
                 
                  ListTopic.push({title:task1.title,id:task1.id,isSelect: false,})})
                
              }
              topic.topic.push({
                title: collection.title,
                id: collection._id,
                type: collection.type,
                isSelect: false,
                ListTopic,
                topicLength: collection.topic.length,
                bankID: task.id,
              });
            }
          });
      });

      const getIndex = [];
      const retry = [];
      topic.topic.map((task) => {
        if (getIndex.indexOf(task.id.valueOf()) == -1) {
          getIndex.push(task.id.valueOf());
          retry.push(task);
        }
      });

      topic.topic = retry;

      course.collections.map((task, index) => {
        task.topic.map((task) => {
          calcTolalQues +=
            eval(task.level.easy) +
            eval(task.level.medium) +
            eval(task.level.hard);
        });
      });
      (topic.duration = course.duration),
        (topic.noOfQuestion = calcTolalQues),
        (topic.totalMArk = course.mark * calcTolalQues);
        topic.Payment=course.Payment
        topic.plan = goal.plan 
        req.session.Plan =course._id
      res.json({ staus: "ok", topic: topic, goal: goal.examHistory,studentsPerformance});
    }
  } catch (error) {
    throw error
  }
};


