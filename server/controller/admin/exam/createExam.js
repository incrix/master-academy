const Exam = require("../../../models/exam");
const Batch = require("../../../models/batch");
const User = require("../../../models/user");
const Course = require("../../../models/course");
const Goal = require("../../../models/goal");
const questionCollection = require("../../../models/questionCollection");
const {
  createPracticeExamQues,
  createMockExamQues,
} = require("../../../util/createQuestion");

exports.createScheduleExam = async (req, res, next) => {
  const questionID = [];
  const finalQues = [];
  const indexValue = [];
  const id = req.body.id;
  const details = req.body.details;
  const type = req.body.type;
  try {
    const batch = await Batch.findOne({ _id: id });
    const Collection = await questionCollection.find();
    if (batch) {
      req.body.data.map((task) => {
        indexValue.push(task._id);
        questionID.push({
          title: task.title,
          id: task._id,
          requireEasy: task.level.easy,
          requireMedium: task.level.medium,
          requireHard: task.level.hard,
          easy: [],
          medium: [],
          hard: [],
        });
        finalQues.push({
          title: task.title,
          id: task._id,
          easy: [],
          medium: [],
          hard: [],
        });
      });

      Collection.map((task) => {
        if (indexValue.indexOf(task.QuesbankID.valueOf()) !== -1) {
          const index = indexValue.indexOf(task.QuesbankID.valueOf());
          
          if ("Easy" == task.level) questionID[index].easy.push(task._id);
          if ("Medium" == task.level) questionID[index].medium.push(task._id);
          if ("Hard" == task.level) questionID[index].hard.push(task._id);
        }
      });

      questionID.map((task, quesIndex) => {
        if (task.easy.length > 0 || task.requireEasy > 0) {
          const index = [];
          for (let i = 0; i < task.requireEasy; ) {
            function getRandomInt(min, max) {
              return Math.floor(Math.random() * (max - min) + min);

            }
            const random = getRandomInt(0, task.easy.length-1);

            if (index.indexOf(random) == -1) {
              console.log("not match ", random);
              finalQues[quesIndex].easy.push(task.easy[random]);
              index.push(random);
              i++;
            } else {
              console.log("match easy", random);
            }
          }
        }

        if (task.medium.length > 0 || task.requireMedium > 0) {
          const index = [];
          for (let i = 0; i < task.requireMedium; ) {
            function getRandomInt(min, max) {

              return Math.floor(Math.random() * (max - min) + min);
            }
            const random = getRandomInt(0, task.medium.length-1);

            if (index.indexOf(random) == -1) {
              console.log("not match ", random);
              finalQues[quesIndex].medium.push(task.medium[random]);
              index.push(random);
              i++;
            } else {
              console.log("match Medium", random);
            }
          }
        }
        if (task.hard.length > 0 || task.requireHard > 0) {
          const index = [];
          for (let i = 0; i < task.requireHard; ) {
            function getRandomInt(min, max) {
           
              return Math.floor(Math.random() * (max - min) + min);
            }
            const random = getRandomInt(0, task.hard.length-1);

            if (index.indexOf(random) == -1) {
              console.log("not match ", random);
              finalQues[quesIndex].hard.push(task.hard[random]);
              index.push(random);
              i++;
            } else {

              console.log("match Hard", random);
            }
          }
        }
      });
      const actualAnswerList =[]
      const questionCategory = [];

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
      


      // finalQues.map((task, index) => {
      //   const list = [];
      //   if (task.easy) task.easy.map((easy) => list.push({ id: easy }));
      //   if (task.medium) task.medium.map((medium) => list.push({ id: medium }));
      //   if (task.hard) task.hard.map((hard) => list.push({ id: hard }));

      //   questionCategory.push({
      //     title: task.title,
      //     id: task.id,
      //     questionList: list,
      //   });
      //   const get = await getQuesAnswer(getQuestionID[i]);

      //   actualAnswerList.push(get);

      // });


for(let i=0;i<finalQues.length;i++){
  const list = [];
  if (finalQues[i].easy) finalQues[i].easy.map((easy) => list.push({ id: easy }));
  if (finalQues[i].medium) finalQues[i].medium.map((medium) => list.push({ id: medium }));
  if (finalQues[i].hard) finalQues[i].hard.map((hard) => list.push({ id: hard }));

  questionCategory.push({
    title: finalQues[i].title,
    id: finalQues[i].id,
    questionList: list,
  });
  for(let j=0;j<list.length;j++){
    const get = await getQuesAnswer(list[j].id);
    actualAnswerList.push(get);
  }

}
    

      
      const examDate = new Date(details.setDate);
      let indianTime = examDate.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      });
     
      const changeDate = indianTime.split(',')[0].split('/')
      const date = changeDate[1]
      const month = changeDate[0]
      const year = changeDate[2]
    
      const exam = await Exam({
        type: type,
        batchID: id,
        title: details.setExamTitle,
        examDate:`${date}/${month}/${year}`,
        examStartTime: details.setTimeFrom,
        examEndTime: details.setTimeTo,
        examDuration: details.examDuration,
        mark: details.setMark,
        negativeMark: details.setNegativeMark,
        questionCategory: questionCategory,
        actualAnswerList,
      });
      
      await exam.save();

      batch.scheduleTest.push({
        examDate:`${date}/${month}/${year}`,
        name: details.setExamTitle,
        examID: exam._id,
        examEndTime: details.setTimeTo,
        examStartTime: details.setTimeFrom,
      });
      await batch.save();
      res.json({
        status: "success",
        message: "Create schedule text successfully",
      });
    }
  } catch (error) {
    throw error
  }
};


exports.createPracticesExam = async (req, res, next) => {
  try {
    const { id, selectGoal, value } = req.body;
    const goal = await Goal.findOne({
      courseId: selectGoal.courseId,
      userId: id,
    });

    const user = await User.findOne({ _id: id });
  let checkCount = false

  if(goal.plan == 'free') {
 
  if(  goal.practicesCount >= process.env.LimitOfPracticesExam){
   
    checkCount = true 
  }
  }

    if (user && !checkCount) {
      const course = await Course.findOne({ _id: selectGoal.courseId });

      if (course) {
        const check = [];
        const questionID = [];
        const finalQuestion = [];

        const countLenth = [];
        selectGoal.topic.map((task) => {
          if (task.isSelect == true) {
            check.push(task.id.valueOf());
          } else if (task.isSelect == false && task.type == "group") {
            task.ListTopic.map((task) => {
              if (task.isSelect == true) {
                countLenth.push(task);
                questionID.push({
                  title: task.title,
                  bankID: task.id,
                  type: "topic",
                  easy: [],
                  medium: [],
                  hard: [],
                  requireEasy: 0,
                  requireMedium: 0,
                  requireHard: 0,
                });
                finalQuestion.push({
                  title: task.title,
                  bankID: task.id,
                  type: "topic",
                  questions: [],
                });
              }
            });
          }
        });

        let countGroup = 0;

        course.collections.map((task) => {
          if (check.indexOf(task._id.valueOf()) !== -1) {
            if (task.type == "group") countGroup++;
            task.topic.map((task1) => {
              countLenth.push(task);
              questionID.push({
                title: task.type == "group" ? task.title : task1.title,
                bankID: task1.id,
                type: task.type,
                easy: [],
                medium: [],
                hard: [],
                requireEasy: 0,
                requireMedium: 0,
                requireHard: 0,
              });
              finalQuestion.push({
                title: task.type == "group" ? task.title : task1.title,
                bankID: task1.id,
                type: task.type,
                questions: [],
                index: countGroup - 1,
              });
            });
          }
        });

        if (value.value % countLenth.length == 0) {
          for (let i = 0; i < countLenth.length; i++) {
            if (value.selectLevel == "easy")
              questionID[i].requireEasy = value.value / countLenth.length;
            if (value.selectLevel == "medium")
              questionID[i].requireMedium = value.value / countLenth.length;
            if (value.selectLevel == "hard")
              questionID[i].requireHard = value.value / countLenth.length;
          }
        } else {
          const actualValue = value.value % countLenth.length;

          for (let i = 0; i < countLenth.length; i++) {
            if (value.selectLevel == "easy")
              questionID[i].requireEasy =
                (value.value - actualValue) / countLenth.length;
            if (value.selectLevel == "medium")
              questionID[i].requireMedium =
                (value.value - actualValue) / countLenth.length;
            if (value.selectLevel == "hard")
              questionID[i].requireHard =
                (value.value - actualValue) / countLenth.length;
          }
          for (let j = 0; j < actualValue; j++) {
            if (value.selectLevel == "easy")
              questionID[j].requireEasy = 1 + questionID[j].requireEasy;
            if (value.selectLevel == "medium")
              questionID[j].requireMedium = 1 + questionID[j].requireMedium;
            if (value.selectLevel == "hard")
              questionID[j].requireHard = 1 + questionID[j].requireMedium;
          }
        }

        /// get questions
        const getBankID = [];
        questionID.map((task) => getBankID.push(task.bankID.valueOf()));

        const questions = await createPracticeExamQues(
          getBankID,
          questionID,
          finalQuestion
        );
        const questionGroup = [];
        const questionGroupCollectionArray = [];
        const questionGroupCollection = [];
        for (let i = 0; i < countGroup; i++) {
          questionGroupCollectionArray.push([]);
        }
        questions.filter((task) => {
          if (task.type == "group") {
            questionGroup.push(task);
          }
        });
        questionGroup.map((task) => {
          questionGroupCollectionArray[task.index].push(task);
        });
        questionGroupCollectionArray.map((task, index) => {
          task.map((task1, index1) => {
            if (index1 == 0) {
              questionGroupCollection.push(task1);
            } else {
              questionGroupCollection[index].questions = [
                ...questionGroupCollection[index].questions,
                ...task1.questions,
              ];
            }
          });
        });

        questions.filter((task) => {
          if (task.type == "topic") {
            questionGroupCollection.push(task);
          }
          
        });
        const questionCategory = [];

        questionGroupCollection.map((task, index) => {
          const questionList = [];
          task.questions.map((task) => questionList.push({ id: task.id }));
          if (questionList.length > 0) {
            questionCategory.push({
              title: task.title,
              id: task.bankID,
              questionList,
            });
          }
        });

        const countPractice = goal.examHistory.filter(
          (task) => task.type == "practice"
        );
        const durationPerQuestion = 90; //seconds;
        //examDuration = "00:00:00"
        const questionCount = value.value;
        let totalSeconds = durationPerQuestion * questionCount;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        const examDuration = `${hours}:${minutes}:${seconds}`;

        const changeTime = new Date();
        let indianTime = changeTime.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        });
      
        const changeDate = indianTime.split(',')[0].split('/')
        const date = changeDate[1]
        const month = changeDate[0]
        const year = changeDate[2]
        const createExam = await Exam({
          type: "practice",
          title: `Practice Exam ${countPractice.length + 1}`,
          courseId: selectGoal.courseId,
          questionCategory,
          examDate:`${date}/${month}/${year}`,
          examDuration,
          mark: course.mark,
          negativeMark: course.negativeMark,
        });

        await createExam.save();
        res.json({
          status: "success",
          message: "Create practice exam successfully",
          examId: createExam._id,
        });
      }
    }
    else{
      res.json({
        status: "info",
        message: "You have reached your limit. Upgrade for more Exams",
      });
    }
  } catch (error) {
    throw error
  }
};

exports.createMockExam = async (req, res, next) => {
  try {
    const { selectGoal } = req.body;

    const userId = req.session.userID;
    const goal = await Goal.findOne({
      courseId: selectGoal.courseId,
      userId: userId,
    });
    let checkCount = false 
    const user = await User.findOne({ _id: userId });
    if(goal.plan == 'free') {
      if(  goal.mockCount >= process.env.LimitOfMockExam){
        checkCount = true 
      }
      }
    if (user && !checkCount) {
      const course = await Course.findOne({ _id: selectGoal.courseId });

      if (course) {
        const check = [];
        const questionID = [];
        const finalQuestion = [];

        let countGroup = 0;
        course.collections.map((task, index) => {
          if (task.type == "group") countGroup++;

          task.topic.map((task1) => {
            questionID.push({
              title: task.type == "group" ? task.title : task.topic[0].title,
              requireEasy: eval(task1.level.easy),
              requireMedium: eval(task1.level.medium),
              requireHard: eval(task1.level.hard),
              index: index,
              easy: [],
              medium: [],
              hard: [],
            });
            finalQuestion.push({
              title: task.type == "group" ? task.title : task.topic[0].title,
              id: task.id,
              type: task.type,
              questions: [],
              index: countGroup - 1,
            });
            check.push(task1.id.valueOf());
          });
        });

        const questions = await createMockExamQues(
          check,
          questionID,
          finalQuestion
        );
      
        const questionGroup = [];
        const questionGroupCollectionArray = [];
        const questionGroupCollection = [];
        for (let i = 0; i < countGroup; i++) {
          questionGroupCollectionArray.push([]);
        }
        questions.filter((task) => {
          if (task.type == "group") {
            questionGroup.push(task);
          }
        });
        questionGroup.map((task) => {
          questionGroupCollectionArray[task.index].push(task);
        });
        questionGroupCollectionArray.map((task, index) => {
          task.map((task1, index1) => {
            if (index1 == 0) {
              questionGroupCollection.push(task1);
            } else {
              questionGroupCollection[index].questions = [
                ...questionGroupCollection[index].questions,
                ...task1.questions,
              ];
            }
          });
        });

        const topic = questions.filter((task) => task.type == "topic");

        topic.map((task) => {
          questionGroupCollection.push(task);
        });
        const questionCategory = [];

        questionGroupCollection.map((task, index) => {
          const questionList = [];
          task.questions.map((task) => questionList.push({ id: task.id }));
          if (questionList.length > 0) {
            questionCategory.push({
              title: task.title,
              id: task.id,
              questionList,
            });
          }
        });

        const countMock = goal.examHistory.filter(
          (task) => task.type == "mock"
        );

        let totalMinutes = course.duration;
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;
        const examDuration = `${hours}:${minutes}:00`;
/// Create Indian Time
        const changeTime = new Date();
        let indianTime = changeTime.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        });
        const changeDate = indianTime.split(',')[0].split('/')
        const date = changeDate[1]
        const month = changeDate[0]
        const year = changeDate[2]
        const createExam = await Exam({
          type: "mock",
          title: `Mock Exam ${countMock.length + 1}`,
          courseId: selectGoal.courseId,
          questionCategory,
          examDate:`${date}/${month}/${year}`,
          examDuration,
          mark: course.mark,
          negativeMark: course.negativeMark,
        });
        await createExam.save();
        res.json({
          status: "success",
          message: "Create practice exam successfully",
          examId: createExam._id,
        });
      }
    }
    else
    res.json({
      status: "info",
      message: "You have reached your limit. Upgrade for more Exams",
    });
  } catch (error) {
    throw error
  }
};
