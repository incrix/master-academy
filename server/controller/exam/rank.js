const examRank = require("../../models/examRank");
const User = require("../../models/user");
const Exam = require("../../models/exam");
exports.rank = async (req, res, next) => {
  try {
    const path = req.path;
    const examID = path.split("/")[2];
    const userID = req.session.userID;
    const user = await User.findOne({ _id: userID });
   
    const examInfo = await Exam.findOne({ _id: examID });

    if (examInfo.type == "mock") {
      const rank = await examRank.find({
        courseID: examInfo.courseId,
        type: examInfo.type,
      });
      if (user) {
     
// function alignRank(ar) {
//     let i = 0, j;
//     while (i < ar.length) {
//         j = i + 1;
//         while (j < ar.length) {

//             if (ar[j].mark < ar[i].mark) {
//                 let temp = ar[i];
//                 ar[i] = ar[j];
//                 ar[j] = temp;
//             }
//             j++;
//         }
//         i++;
//     }
// }
//  //await alignRank(rank);
 
//         const check = rank
//         const rankList = [];
//         for (let i = check.length, j = 1; i > 0; j++, i--) {
//           const { name, avatar } = await getUserList(check[check.length - j].userID);

//           rankList.push({
//             rank: j,
//             mark: check[check.length - j].mark,
//             userID: check[check.length - j].userID,
//             name,
//             avatar
//           });
//         }
       
    return res.json({userID,type:examInfo.type,rank})
      }
    } 
    else if (examInfo.type == "schedule") {
    
        const rank = await examRank.find({
          batchID: examInfo.batchID,
            type: examInfo.type,
          });
        
          if (user) {
  //   function alignRank(ar) {
  //       let i = 0, j;
  //       while (i < ar.length) {
  //           j = i + 1;
  //           while (j < ar.length) {
    
  //               if (ar[j].mark < ar[i].mark) {
  //                   let temp = ar[i];
  //                   ar[i] = ar[j];
  //                   ar[j] = temp;
  //               }
  //               j++;
  //           }
  //           i++;
  //       }
  //   }
  //  await alignRank(rank);
     
  //           const check = rank
  //           const rankList = [];
  //           for (let i = check.length, j = 1; i > 0; j++, i--) {
  //             const { name, avatar } = await getUserList(check[check.length - j].userID);
  //             rankList.push({
  //               rank: j,
  //               mark: check[check.length - j].mark,
  //               userID: check[check.length - j].userID,
  //               name,
  //               avatar
  //             });
  //           }
          
  //           return res.json({rankList,userID,type:examInfo.type})
  return res.json({userID,type:examInfo.type,rank})
          }
    }
    else if(examInfo.type =='practice') return res.json({type:examInfo.type})
    else return res.json({status:'something wrong'})
  } catch (error) {
    throw error
  }
};


exports.getListRank = async(req,res) => {
try {
  const {data,examID,getUserRank,getUserMark}= req.body
  if(data.rank.length > 0)
{  
  
  let rankList = []
  const check = []
  for (let i = data.rank.length > 5 ? 5 : data.rank.length , j = 1; i > 0; j++, i--) {

    if(data.userID.valueOf() == data.rank[data.rank.length - j].userID.valueOf()) check.push(i)
    const { name, avatar } = await getUserList(data.rank[data.rank.length - j].userID);
    rankList.push({
      rank: j,
      mark: data.rank[data.rank.length - j].mark,
      userID: data.rank[data.rank.length - j].userID,
      name,
      avatar
    });
  }
  if(check.length == 0) 
 { 
  const { name, avatar } = await getUserList(data.userID)
  rankList.push({
    rank: getUserRank,
    mark: getUserMark,
    userID: data.userID,
    name,
    avatar
  });
  
}

  res.json({rankList,userID:data.userID})
}
} catch (error) {
  throw error
}
}



const getUserList = async (id) => {
  const user = await User.findOne({ _id: id });
  if(user)
  return {
    name: user.name,
    avatar: user.avatar,
  };
  else{
    return {
      name: '',
      avatar: '',
    };
  }
};
