const Exam = require("../models/exam");
const examRank = require("../models/examRank.js");
const Batch = require("../models/batch.js");
const Session = require("../models/session.js");
const examState = require("../models/examState.js");
exports.unSubmit = async (examID) => {
  try {
    const examInfo = await Exam.findOne({ _id: examID });
    const get = examInfo.studentsPerformance.filter(
      (task) => task.status == "started"
    );
    if (get.length !== 0) {
      for (let i = 0; i < get.length; i++) {
        let totalQuestion = 0;
        examInfo.questionCategory.map((task) => {
          totalQuestion += task.questionList.length;
        });
        const studentAnswerList = get[i].studentAnswerList;

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
        get[i].totalMark = totalMark;
        get[i].questionAttempted = questionAttempted;
        get[i].correctedAnswerList = actualAnswerList;
        get[i].mark = score;
        get[i].negativeMark = studentNegativeMark;
        get[i].status = "submitted";
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
          let studentAnswerList = get[i].studentAnswerList;
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

        get[i].topics = topics;
        examInfo.studentsPerformance.map((task) => {
          if (task.id.valueOf() == get[i].id.valueOf()) {
            task = get[i];
          }
        });

        // rank

        const rank = await examRank.findOne({
          userID: get[i].id,
          batchID: examInfo.batchID,
          type: "schedule",
        });
        if (rank) {
          let mark = get[i].mark - get[i].negativeMark;
          if (mark < 0) mark = 0;
          rank.mark = mark;
          await rank.save();
        } else {
          let mark = get[i].mark - get[i].negativeMark;
          if (mark < 0) mark = 0;

          const rank = await examRank({
            userID: get[i].id,
            batchID: examInfo.batchID,
            type: "schedule",
            mark,
          });
          await rank.save();
        }
        await examInfo.save();

        examState
          .deleteOne({ examID, userID: get[i].id })
          .then(function () {
            console.log("Data deleted"); // Success
          })
          .catch(function (error) {
            console.log(error); // Failure
          });
        // delate Exam State
       
      }
    }
  } catch (error) {
    throw error;
  }
};


