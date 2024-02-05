const exam = require("../../../models/exam");
const { analiysticsTime } = require("../../../util/time");
const {
  getMonthAndYearAnalysis,
  TotalPaymentAndExam,
} = require("../../../util/getAnalysticsDetails");
const User = require("../../../models/user");
exports.examAnalysis = async (req, res) => {
  try {
    const date = new Date();
    let indianTime = date.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const month = indianTime.split(",")[0].split("/")[0];
    const year = indianTime.split(",")[0].split("/")[2];
    date.setDate(date.getDate() + 1); // plus day by 1 for getting actuel date  // 2023-01-01T18:30:00.000+05:30
    const getAnalysis = await getMonthAndYearAnalysis(year, month);
    res.json({ status: "success", getExamAnalysis: getAnalysis });
  } catch (error) {
    throw error;
  }
};

exports.getTotalPaymentAndExam = async (req, res) => {
  try {
    const date = new Date();
    let indianTime = date.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const month = indianTime.split(",")[0].split("/")[0];
    const year = indianTime.split(",")[0].split("/")[2];
    date.setDate(date.getDate() + 1); // plus day by 1 for getting actuel date  // 2023-01-01T18:30:00.000+05:30
    const getTotalAnalysis = await TotalPaymentAndExam(year, month);

    res.json({ status: "success", getTotalAnalysis });
  } catch (error) {
    throw error;
  }
};


exports.getTotalUsers = async (req,res) => {
    try {
        const userType = ['student','teacher','institution',]
        const getTotalUser = []
            const getUser = await User.find()
            getTotalUser.push({type:'Users',total:getUser.length})
        for(let i=0;i<userType.length;i++){
            const getUser = await User.find({type:userType[i]})
            getTotalUser.push({type:userType[i] == 'student' ? 'Students' : userType[i] == 'teacher' ? 'Teachers' : userType[i] == 'institution' ? "Institutions" : '',total:getUser.length})
        }
 res.json({status:'success',getTotalUser})
    } catch (error) {
        throw error
    }
}