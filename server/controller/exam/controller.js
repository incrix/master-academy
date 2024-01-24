const exam = require("../../models/exam.js");
const user = require("../../models/user.js");
const questionCollection = require("../../models/questionCollection.js");
const examState = require("../../models/examState.js");
const Goal = require("../../models/goal.js");
const Batch = require("../../models/batch.js");
const { DateTime } = require("luxon");
const examRank = require("../../models/examRank.js");
const questionBank = require("../../models/questionBank.js");
const fs = require("fs");
const {
  shuffleArray,
  rearrangeArray,
} = require("../../util/questionShuffleAndReShuffle.js");
const {
  getExamStartTime,
  getExamExamEndTime,
  getExamValid,
} = require("../../util/time.js");
exports.getExamInfo = async function (req, res) {
  try {
    const path = req.path;
    const examId = path.split("/")[2];
    const examInfo = await exam.findOne({ _id: examId });
    if (!examInfo) {
      return res.status(404).send("exam not found");
    }
    let NoOfquestion = 0;
    examInfo.questionCategory.map((task) =>
      task.questionList.map((task) => {
        NoOfquestion++;
      })
    );
    // const examDate = new Date();
    // let changeTime = examDate.toLocaleString("en-US", {
    //   timeZone: "Asia/Kolkata",
    //   hour12: false,
    // });

    // const getDate = changeTime.split(',')[0].split('/')
    // const getTime =  changeTime.split(',')[1].split(':')

    // const indianTime = {
    //    date : getDate[1],
    //    month : getDate[0],
    //    year : getDate[2],
    //    hour:getTime[0],
    //    minutes:getTime[1],
    //    sec:getTime[2]
    // }

    res.status(200).json({
      totalMark: NoOfquestion * examInfo.mark,
      NoOfquestion,
      title: examInfo.title,
      examDate: examInfo.examDate,
      examDuration: examInfo.examDuration,
      examEndTime: examInfo.examEndTime,
      examStartTime: examInfo.examStartTime,
      type: examInfo.type,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.startExam = async function (req, res) {
  const path = req.path;
  const examID = path.split("/")[2];
  const userID = req.session.userID;
  req.session.examID = examID;
  const userName = req.session.userName;

  const State = await examState({ examID, userID });
  //State.save();
  try {
    const examInfo = await exam.findOne({ _id: examID });
    if (!examInfo) {
      return res.status(404).send("exam not found");
    }
    if (examInfo.type === "schedule") {
      const get = examInfo.studentsPerformance.filter(
        (task) => task.id.valueOf() == userID.valueOf()
      );
      const time = DateTime.local()
        .setZone("Asia/Kolkata")
        .toFormat("HH:mm:ss");
      if (get.length === 0) {
        let totalQuestion = 0;
        const isValidExam = await isValidExamStart(examInfo);

        if (isValidExam) {
          const studentAnswerList = [];
          const getOriginalIndex = [];
          const shuffledArray = [];
          examInfo.questionCategory.forEach((category) => {
            (totalQuestion += category.questionList.length),
              category.questionList.forEach((question, index) => {
                studentAnswerList.push(null);
                getOriginalIndex.push(index);
                shuffledArray.push(index);
              });
          });

          const bookmarkedQuestionList = [];
          examInfo.questionCategory.forEach((category) => {
            category.questionList.forEach((question) => {
              bookmarkedQuestionList.push(false);
            });
          });
          // const actualAnswerList = [];

          // const getQuestionID = [];
          // examInfo.questionCategory.map((task) =>
          //   task.questionList.map(async (task) => {
          //    //getQuestionID.push(task.id);
          //   })
          // );

          //generate Actual Answer
          // const getQuesAnswer = async (task) => {
          //   const getQues = await questionCollection.findOne({ _id: task });
          //   let answer = "";
          //   getQues.options.map((option, index1) => {
          //     if (option.isCorrect == true) {
          //       answer = index1;
          //     }
          //   });
          //   return answer;
          // };

          // for (let i = 0; i < getQuestionID.length; i++) {
          //   const get = await getQuesAnswer(getQuestionID[i]);

          //   actualAnswerList.push(get);
          // }

          const getShuffleIndex = await shuffleArray(shuffledArray);

          examInfo.totalQuestion = totalQuestion;

          examInfo.studentsPerformance.push({
            id: userID,
            name: userName,
            startTime: time,
            studentAnswerList,
            bookmarkedQuestionList,
            score: 0,
            getShuffleIndex,
            getOriginalIndex,
            mark: examInfo.mark,
            status: "started",
          });
          await examInfo.save();
          //Exam Save State
          await State.save();
          req.session.examID = examInfo._id;
          req.session.examName = examInfo.title;
          return res
            .status(200)
            .json({ message: "exam started", status: "success" });
        } else {
          const check = await isValidExamEnd(examInfo);
          if (check) {
            delete req.session.examID;
            const batch = await Batch.findOne({ _id: examInfo.batchID });
            batch.scheduleTest.map((task) => {
              if (
                task.examID.valueOf() == examInfo._id.valueOf() &&
                task.status == "pending"
              ) {
                task.status = "complete";
              }
            });
            await batch.save();
            examState
              .deleteOne({ examID, userID })
              .then(function () {
                console.log("Data deleted"); //  Success
              })
              .catch(function (error) {
                console.log(error); // Failure
              });

            return res
              .status(400)
              .json({ status: "info", message: "exam was completed" });
          } else {
            examState
              .deleteOne({ examID, userID })
              .then(function () {
                console.log("Data deleted"); //  Success
              })
              .catch(function (error) {
                console.log(error); // Failure
              });
            delete req.session.examID;
            return res
              .status(400)
              .json({ status: "info", message: "exam not started yet" });
          }
        }
      } else {
        examState
          .deleteOne({ examID, userID })
          .then(function () {
            console.log("Data deleted"); // Success
          })
          .catch(function (error) {
            console.log(error); // Failure
          });
        delete req.session.examID;

        return res
          .status(400)
          .json({ status: "info", message: "you attended the exam" });
      }
    }
    if (examInfo.type === "practice" || examInfo.type === "mock") {
      const goal = await Goal.findOne({
        courseId: req.session.Plan,
        userId: req.session.userID,
      });
      if (examInfo.type === "practice" && goal.plan == "free") {
        goal.practicesCount =
          goal.practicesCount == undefined ? 1 : goal.practicesCount + 1;
        await goal.save();
      }
      if (examInfo.type === "mock" && goal.plan == "free") {
        goal.mockCount = goal.mockCount == undefined ? 1 : goal.mockCount + 1;
        await goal.save();
      }
      let time = DateTime.local().setZone("Asia/Kolkata").toFormat("HH:mm:ss");
      const getSecond = DateTime.now().setZone("Asia/Kolkata");

      const timestamp = getSecond.toMillis();

      examInfo.examStartTime = time;
      const duration = examInfo.examDuration;
      const durationArray = duration.split(":");

      const durationSeconds =
        eval(durationArray[0]) * 3600 +
        eval(durationArray[1]) * 60 +
        eval(durationArray[2]);

      let date3 = new Date(timestamp + durationSeconds * 1000);
      let indianTime = date3.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      });
      let indianTime1 = date3.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      });

      let getTime = indianTime.split(",")[1];

      if (getTime.split(":")[0] == 24)
        getTime = `00:${getTime.split(":")[1]}:${getTime.split(":")[2]}`;

      examInfo.examEndTime = getTime;

      const get = examInfo.studentsPerformance.filter(
        (task) => task.id.valueOf() == userID.valueOf()
      );
      if (get.length === 0) {
        const studentAnswerList = [];

        examInfo.questionCategory.forEach((category) => {
          category.questionList.forEach((question) => {
            studentAnswerList.push(null);
          });
        });
        const bookmarkedQuestionList = [];
        examInfo.questionCategory.forEach((category) => {
          category.questionList.forEach((question) => {
            bookmarkedQuestionList.push(false);
          });
        });
        const actualAnswerList = [];
        const getQuestionID = [];
        examInfo.questionCategory.map((task) =>
          task.questionList.map(async (task) => {
            getQuestionID.push(task.id);
          })
        );

        //generate Actual Answer
        const getQuesAnswer = async (task) => {
          const getQues = await questionCollection.findOne({ _id: task });
          let answer = "";
          getQues.options.map((option, index1) => {
            if (option.isCorrect == true) {
              answer = index1;
            }
          });
          return answer;
        };
        for (let i = 0; i < getQuestionID.length; i++) {
          const get = await getQuesAnswer(getQuestionID[i]);
          actualAnswerList.push(get);
        }

        examInfo.actualAnswerList = actualAnswerList;
        examInfo.studentsPerformance.push({
          id: userID,
          name: userName,
          //startTime: Date.now(),
          startTime: time,
          studentAnswerList,
          bookmarkedQuestionList,
          score: 0,
          mark: 5,
          status: "started",
        });

        await examInfo.save();
        //Exam Save State
        await State.save();
        req.session.examID = examInfo._id;
        req.session.examName = examInfo.title;
        return res
          .status(200)
          .json({ message: "exam started", status: "success" });
      } else {
        return res.status(400).json({ message: "exam already started" });
      }
    }
  } catch (error) {
    throw error;
  }
};

const isValidExamEnd = async function (examInfo) {
  const End = await getExamValid(examInfo.examDate, examInfo.examEndTime);

  return End;
};
const isValidExamStart = async function (examInfo) {
  let date = new Date();
  let indianTime = date.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });
  const getTime = indianTime.split(",");
  const getDate = getTime[0].split("/");

  const Start = await getExamStartTime(
    examInfo.examDate,
    examInfo.examStartTime
  );
  const End = await getExamExamEndTime(examInfo.examDate, examInfo.examEndTime);

  return (
    examInfo.examDate === `${getDate[1]}/${getDate[0]}/${getDate[2]}` &&
    Start &&
    End
  );
};

exports.getExamState = async function (req, res) {
  try {
    const userID = req.session.userID;
    const userName = req.session.userName;
    const examId = req.session.examID;

    const getExam = await exam.findOne({ _id: examId });
    const User = await user.findOne({ _id: userID });

  
    if (getExam && User) {
      const studentPerform = getExam.studentsPerformance.filter(
        (task) => task.id.valueOf() == User._id.valueOf()
      );
      const questionCategoryList = [];
      const questionCollections = [];
      const getQuestionID = [];
      getExam.questionCategory.map((task) => {
        questionCategoryList.push({
          title: task.title,
          questionListLength: task.questionList.length,
        });
      });
      getExam.questionCategory.map((task) =>
        task.questionList.map(async (task) => {
          getQuestionID.push(task.id);
        })
      );

      // generate  questions

      async function getQuestion(task) {
        const collectQues = await questionCollection.findOne({ _id: task });
        const options = [];
        collectQues.options.map((option, index) => {
          options.push(option.option);
        });
        return {
          question: collectQues.title,
          imageUrl: collectQues.imageUrl,
          type: collectQues.type,
          options,
        };
      }
      // if (getExam.type == "schedule") {
      //   for (let i = 0; i < getQuestionID.length; i++) {
      //     const ques = await getQuestion(
      //       getQuestionID[studentPerform[0].getShuffleIndex[i]]
      //     );
      //     questionCollections.push(ques);
      //   }
      // } else {
        for (let i = 0; i < getQuestionID.length; i++) {
          const ques = await getQuestion(getQuestionID[i]);
          questionCollections.push(ques);
        }
     // }

      let examDate = getExam.examDate.split("/");
      examDate = `${
        eval(examDate[0]) < 10 ? "0" + eval(examDate[0]) : eval(examDate[0])
      }/${eval(examDate[1]) < 10 ? "0" + examDate[1] : examDate[1]}/${
        examDate[2]
      }`;

      // const studentPerform = getExam.studentsPerformance.filter(
      //   (task) => task.id.valueOf() == User._id.valueOf()
      // );

      await getExam.save();

      if (studentPerform.length > 0)
        if (studentPerform[0].status == "started") {
          let time = DateTime.local()
            .setZone("Asia/Kolkata")
            .toFormat("HH:mm:ss");
          const examInfoData = {
            examTitle: getExam.title,
            examDate: getExam.examDate ? getExam.examDate : examDate,
            examStartTime:
              getExam.examStartTime.split(":").length == 3
                ? getExam.examStartTime
                : `${getExam.examStartTime}:00`,
            examEndTime:
              getExam.examEndTime.split(":").length == 3
                ? getExam.examEndTime
                : `${getExam.examEndTime}:00`,
            examDuration:
              getExam.examDuration.split(":").length == 3
                ? getExam.examDuration
                : `${getExam.examDuration}:00`,
            mark: getExam.mark,
            negativeMark: getExam.negativeMark,
            //currentTime: Date.now(),
            currentTime: time,
            questionCategoryList,
            questionCollections,
            studentsPerformance: [
              {
                id: userID,
                name: userName,
                startTime: `${getExam.examStartTime}:00`,
                endTime: `${getExam.examEndTime}:00`,
                studentAnswerList: studentPerform[0].studentAnswerList,
                bookmarkedQuestionList:
                  studentPerform[0].bookmarkedQuestionList,
                mark: getExam.mark,
                currentIndex: studentPerform[0].currentIndex,
                negativeMark: getExam.negativeMark,
                totalMark: getExam.totalMark,
                status: getExam.status,
                windowCloseWarning: getExam.windowCloseWarning,
                windowResizedWarning: getExam.windowResizedWarning,
              },
            ],
          };

          return res.json(examInfoData);
        } else {
          if (studentPerform[0].status == "submitted") {
            return res.json({
              status: "error",
              message: "exam already submitted",
            });
          }
          if (studentPerform[0].status == "terminated")
            return res.json({ status: "error", message: "exam terminated" });
          if (studentPerform[0].status == "notStarted")
            return res.json({
              status: "error",
              message: "exam not started yet",
            });
          return res.json({ status: "error", message: "something went wrong" });
        }
      else {
        return res.json({ status: "error", message: "something went wrong" });
      }
    }
    return res.json({ status: "error", message: "something went wrong" });
  } catch (error) {
    throw error;
  }
};

exports.examStateUpdate = async (req, res, next) => {
  try {
    const userID = req.session.userID;
    const examID = req.session.examID;
    const {
      studentAnswerList,
      bookmarkedQuestionList,
      currentIndex,
      // windowCloseWarning,
      // windowResizedWarning,
    } = req.body;

    const User = await user.findOne({ _id: userID });
    const examState = await exam.findOne({ _id: examID });

    if (User) {
      if (examState) {
        // if (windowCloseWarning >= 3 || windowResizedWarning >= 3) {
        examState.studentsPerformance.map((task) => {
          if (User._id.valueOf() == task.id.valueOf()) {
            task.currentIndex = currentIndex;
            task.studentAnswerList = studentAnswerList;
            task.bookmarkedQuestionList = bookmarkedQuestionList;
            // task.windowCloseWarning = windowCloseWarning;
            // task.windowResizedWarning = windowResizedWarning;
            // task.status = status;
          }
        });
        await examState.save();
        return res.json({
          status: "success",
          message: "Update exam state successfully",
        });
      }
      console.log("error");
      return res.json({
        status: "something went wrong",
        message: " exam state not Update",
      });
      // else {
      //   examState.studentsPerformance.map((task) => {
      //     if (User._id.valueOf() == task.id.valueOf()) {
      //       task.status = "terminated";
      //     }
      // });
      // examState.save();
      // }
      // }
    }
  } catch (error) {
    throw error;
  }
};

exports.submitExam = async (req, res, next) => {
  try {
    const userID = req.session.userID;
    const examID = req.session.examID;
    // const date = new Date();
    let date = new Date();
    let indianTime = date.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const getDate = indianTime.split(",")[0].split("/");

    if (examID) {
      const examInfo = await exam.findOne({ _id: examID });

      if (examInfo.type == "practice" || examInfo.type == "mock") {
        const get = examInfo.studentsPerformance.filter(
          (task) => task.id.valueOf() == userID.valueOf()
        );
        if (get.length !== 0) {
          let totalQuestion = 0;
          examInfo.questionCategory.map((task) => {
            totalQuestion += task.questionList.length;
          });

          const studentAnswerList = get[0].studentAnswerList;
          const actualAnswerList = examInfo.actualAnswerList;
          const mark = examInfo.mark;
          let studentNegativeMark = 0;
          const negativeMark = examInfo.negativeMark;
          const totalMark = mark * totalQuestion;
          let actualCorrectAttend = 0;
          let actualWrongAttend = 0;
          let score = 0;
          let questionAttempted = 0;
          actualAnswerList.map((task, index) => {
            if (actualAnswerList[index] == studentAnswerList[index]) {
              score += mark;
              actualCorrectAttend += 1;
              questionAttempted += 1;
            } else if (studentAnswerList[index] !== null) {
              studentNegativeMark += negativeMark;
              actualWrongAttend += 1;
              questionAttempted += 1;
            }
          });

          get[0].totalMark = totalMark;
          get[0].questionAttempted = questionAttempted;
          get[0].correctedAnswerList = actualAnswerList;
          get[0].mark = score;
          get[0].negativeMark = studentNegativeMark;
          get[0].status = "submitted";
          const questionCategoryList = [];
          examInfo.questionCategory.map((task) =>
            questionCategoryList.push({
              title: task.title,
              questionListLength: task.questionList.length,
            })
          );
          const goal = await Goal.findOne({
            courseId: examInfo.courseId,
            userId: userID,
          });

          if (goal) {
            const questionCategoryList = [];
            examInfo.questionCategory.map((task) =>
              questionCategoryList.push({
                title: task.title,
                questionListLength: task.questionList.length,
              })
            );
            const topics = [];
            let countLength = 0;
            questionCategoryList.map((task, index) => {
              let actualAnswerList = examInfo.actualAnswerList;
              let studentAnswerList = get[0].studentAnswerList;
              let correctQuestion = 0;
              let wrongQuestion = 0;
              let totalQuestion = task.questionListLength;
              if (index == 0) {
                actualAnswerList = actualAnswerList.slice(
                  0,
                  task.questionListLength
                );
                studentAnswerList = studentAnswerList.slice(
                  0,
                  task.questionListLength
                );
                countLength = task.questionListLength;
              } else {
                actualAnswerList = actualAnswerList.slice(
                  countLength,
                  countLength + task.questionListLength
                );
                studentAnswerList = studentAnswerList.slice(
                  countLength,
                  countLength + task.questionListLength
                );
                countLength += task.questionListLength;
              }
              actualAnswerList.map((task, index) => {
                if (actualAnswerList[index] == studentAnswerList[index]) {
                  correctQuestion += 1;
                } else if (studentAnswerList[index] !== null) {
                  wrongQuestion += 1;
                }
              }),
                topics.push({
                  topicName: task.title,
                  totalQuestion,
                  correctQuestion,
                  wrongQuestion,
                  accuracy: (correctQuestion / totalQuestion) * 100,
                });
            });
            const examTopic = [];
            topics.map((task) => {
              examTopic.push({
                topicName: task.topicName,
                accuracy: task.accuracy,
              });
              goal.topics.map((task1) => {
                if (task.topicName == task1.topicName) {
                  task1.questionAttempted +=
                    task.correctQuestion + task.wrongQuestion;
                  task1.questionTotal += task.totalQuestion;
                  task1.questionCorrect += task.correctQuestion;
                  task1.questionSkipped +=
                    task.totalQuestion -
                    (task.correctQuestion + task.wrongQuestion);
                  task1.questionWrong += task.wrongQuestion;
                  task1.accuracy =
                    (task1.questionCorrect / task1.questionTotal) * 100;
                }
              });
            });
            get[0].topics = examTopic;

            examInfo.studentsPerformance.map((task) => {
              if (task.id.valueOf() == userID.valueOf()) {
                task = get[0];
              }
            });
            goal.examHistory.push({
              examId: examID,
              type: examInfo.type,
              examName: examInfo.title,
              totalMarks: totalMark,
              score,
              // date: `${date.getDate()}/${
              //   date.getMonth() + 1
              // }/${date.getFullYear()}`,
              date: `${getDate[1]}/${getDate[0]}/${getDate[2]}`,
              topics,
            });

            const rank = await examRank.findOne({
              userID,
              courseID: examInfo.courseId,
              type: "mock",
            });

            if (rank) {
             
              let mark = get[0].mark - get[0].negativeMark;
              if (mark < 0){ mark = 0;}
           
              if(rank.mark < mark ) {rank.mark = mark;}
           
              await rank.save();
            } else {
              let mark = get[0].mark - get[0].negativeMark;
              if (mark < 0) mark = 0;

              const rank = await examRank({
                userID,
                courseID: examInfo.courseId,
                type: "mock",
                mark,
              });
              await rank.save();
            }

            await goal.save();
            await examInfo.save();

            // delete Exam State

            examState
              .deleteOne({ examID, userID })
              .then(function () {
                console.log("Data deleted"); // Success
              })
              .catch(function (error) {
                console.log(error); // Failure
              });

            // delete session ID
            delete req.session.examID;
            return res.json({
              status: "success",
              message: "exam submitted successfully",
            });
          }
        }
      } else if (examInfo.type == "schedule") {
        const get = examInfo.studentsPerformance.filter(
          (task) => task.id.valueOf() == userID.valueOf()
        );

        if (get.length !== 0) {
          let totalQuestion = 0;
          examInfo.questionCategory.map((task) => {
            totalQuestion += task.questionList.length;
          });
           const studentAnswerList = get[0].studentAnswerList;
          //  const studentAnswerList = await rearrangeArray(get[0].getOriginalIndex,get[0].studentAnswerList)
          const actualAnswerList = examInfo.actualAnswerList;
          const mark = examInfo.mark;
          let studentNegativeMark = 0;
          const negativeMark = examInfo.negativeMark;
          const totalMark = mark * totalQuestion;

          let actualCorrectAttend = 0;
          let actualWrongAttend = 0;
          let score = 0;
          let questionAttempted = 0;
          actualAnswerList.map((task, index) => {
            if (actualAnswerList[index] == studentAnswerList[index]) {
              score += mark;
              questionAttempted += 1;
              actualCorrectAttend += 1;
            } else if (studentAnswerList[index] !== null) {
              studentNegativeMark += negativeMark;
              actualWrongAttend += 1;
              questionAttempted += 1;
            }
          });
          get[0].totalMark = totalMark;
          get[0].questionAttempted = questionAttempted;
          get[0].correctedAnswerList = actualAnswerList;
          get[0].mark = score;
          get[0].negativeMark = studentNegativeMark;
          get[0].status = "submitted";
          const questionCategoryList = [];
          examInfo.questionCategory.map((task) =>
            questionCategoryList.push({
              title: task.title,
              questionListLength: task.questionList.length,
            })
          );
          const topics = [];
          let countLength = 0;
          questionCategoryList.map((task, index) => {
            let actualAnswerList = examInfo.actualAnswerList;
            let studentAnswerList = get[0].studentAnswerList;
            let correctQuestion = 0;
            let wrongQuestion = 0;
            let totalQuestion = task.questionListLength;
            if (index == 0) {
              actualAnswerList = actualAnswerList.slice(
                0,
                task.questionListLength
              );
              studentAnswerList = studentAnswerList.slice(
                0,
                task.questionListLength
              );
              countLength = task.questionListLength;
            } else {
              actualAnswerList = actualAnswerList.slice(
                countLength,
                countLength + task.questionListLength
              );
              studentAnswerList = studentAnswerList.slice(
                countLength,
                countLength + task.questionListLength
              );
              countLength += task.questionListLength;
            }
            actualAnswerList.map((task, index) => {
              if (actualAnswerList[index] == studentAnswerList[index]) {
                correctQuestion += 1;
              } else if (studentAnswerList[index] !== null) {
                wrongQuestion += 1;
              }
            }),
              topics.push({
                topicName: task.title,
                accuracy: (correctQuestion / totalQuestion) * 100,
              });
          });

          get[0].topics = topics;
          examInfo.studentsPerformance.map((task) => {
            if (task.id.valueOf() == userID.valueOf()) {
              task = get[0];
            }
          });

          // rank

          const rank = await examRank.findOne({
            userID,
            batchID: examInfo.batchID,
            type: "schedule",
          });
          if (rank) {
            let mark = get[0].mark - get[0].negativeMark;
            if (mark < 0 ) mark = 0;
            if(rank.mark < mark ) rank.mark = mark;
            await rank.save();
          } else {
            let mark = get[0].mark - get[0].negativeMark;
            if (mark < 0) mark = 0;

            const rank = await examRank({
              userID,
              batchID: examInfo.batchID,
              type: "schedule",
              mark,
            });
            await rank.save();
          }
          await examInfo.save();

          // institute

          // const batch = await Batch.findOne({ _id: examInfo.batchID });
          // const student = batch.studentList.filter(
          //   (task) => task.userID.valueOf() == userID.valueOf()
          // );

          // let examMark = get[0].mark - get[0].negativeMark;
          // if (examMark < 0) examMark = 0;

          // batch.scheduleTest.map((task) => {
          //   if (task.examID.valueOf() == examID.valueOf()) {
          //     task.studentPerformance.push({
          //       name: student[0].name,
          //       rollNumber: student[0].rollNumber,
          //       dept: student[0].dept,
          //       email: student[0].email,
          //       mark: examMark,
          //     });
          //   }
          // });

          // batch.save();

          // delate Exam State
          examState
            .deleteOne({ examID, userID })
            .then(function () {
              console.log("Data deleted"); // Success
            })
            .catch(function (error) {
              console.log(error); // Failure
            });

          // delete session

          delete req.session.examID;
          return res.json({
            status: "success",
            message: "exam submitted successfully",
          });
        } else {
          return res.json({
            status: "error",
            message: "something went wrong",
          });
        }
      } else {
        return res.json({
          status: "error",
          message: "something went wrong",
        });
      }
    }
    return res.json({
      status: "error",
      message: "something went wrong",
    });
  } catch (error) {
    throw error;
  }
};

exports.getExamResult = async (req, res, next) => {
  try {
    const path = req.path;
    const examID = path.split("/")[2];

    const userID = req.session.userID;

    const examInfo = await exam.findOne({ _id: examID });
    const getExamStudentData = await exam.findOne(
      {
        _id: examID,
      },
      {
        studentsPerformance: {
          $elemMatch: { id: userID },
        },
      }
    );

    if (examInfo && getExamStudentData) {
      const User = await user.findOne({ _id: userID });
      // const get = examInfo.studentsPerformance.filter(
      //   (task) => task.id.valueOf() == userID.valueOf()
      // );
      const get = [getExamStudentData.studentsPerformance[0]];
      if (get.length !== 0) {
        const examResult = {
          type: examInfo.type,
          mark: get[0].mark - get[0].negativeMark,
          topics: get[0].topics,
          totalMarks: examInfo.mark * examInfo.actualAnswerList.length,
          questionAttempted: get[0].questionAttempted,
          totalQuestion: examInfo.actualAnswerList.length,
          questionUnAttempted:
            examInfo.actualAnswerList.length - get[0].questionAttempted,
        };
        const userdetails = {
          avatar: User.avatar,
          id: User._id,
        };
        res.json({ examResult, userdetails });
      }
    } else {
      return res.status(404).send("exam not found");
    }
  } catch (error) {
    throw error;
  }
};

exports.getChangeQues = async (req, res) => {
  try {
    const Bank = await questionBank.find();
    fs.writeFile("myQuesBank.json", JSON.stringify(Bank, null, 4), (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    res.send("ok");
  } catch (error) {
    throw error;
  }
};

// exports.getChangeQues = async (req,res) =>{
//   try {
//     const option = [
//       {
//         currentBankID :"6501d6a410d5416761c09135",
//         changeBankID :"64d2451f8be46563d54f0052",
//       easy:10,
//       medium:14,
//       hard:18,
//       total:42
//     }
//   ]

//     for(let i=0 ;i<option.length;i++)
//     {
//       const currentBank = await questionCollection.find({QuesbankID:option[i].currentBankID})
//       const changeBank = await questionCollection.find({QuesbankID:option[i].changeBankID})
//       const bank = await questionCollection.find({QuesbankID:option[i].currentBankID})
//     let fullBank = await questionCollection.find();

//   if(bank.length > 123456789)
//  {
//   bank.map(task => {

//       task.QuesbankID=option[i].changeBankID
//       task.save()
//     })

//   fullBank = await questionCollection.find();

//     const quesBank = await questionBank.findOne({_id:option[i].changeBankID})

//      quesBank.level.easy += option[i].easy
//      quesBank.level.medium += option[i].medium
//      quesBank.level.hard += option[i].hard
//      quesBank.totalQuestions += option[i].total
//      quesBank.save()
//      const quesBank1 = await questionBank.findOne({_id:option[i].currentBankID})
//      console.log(quesBank1)
//      quesBank1.level.easy = 0
//      quesBank1.level.medium = 0
//      quesBank1.level.hard =0
//      quesBank1.totalQuestions = 0
//      quesBank1.save()
//   }
//     else{
//       console.log('complete')
//     }
//   }
//     res.send('ok')

//   } catch (error) {
//     console.log(error);
//   }
// }
