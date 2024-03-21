const { analiysticsTime } = require("./time");
const exam = require("../models/exam");
const payment = require("../models/payment");
exports.getMonthAndYearAnalysis = async (currentYear, month) => {
  try {
    const countYear = await getYears(currentYear);
    const option = [];
    const getMonthAndYear = [];
    for (let i = 0; i < countYear.length; i++) {
      option.push({ year: countYear[i], data: [] });
      let count = countYear[i] == currentYear ? eval(month) + 1 : 12;
      for (let j = 0; j < count; j++) {
        const getDate = await analiysticsTime(countYear[i], j + 1, "02");
        getMonthAndYear.push(getDate);
      }
    }
   
    let count = [];
    if (getMonthAndYear.length > 0) {
      for (let i = 0; i < getMonthAndYear.length; i++) {
        if (getMonthAndYear[i + 1] !== undefined) {
         
          await exam
            .find({
              createdAt: {
                $gte: getMonthAndYear[i],
                $lt: getMonthAndYear[i + 1],
              },
            })
            .then((result) => {
       
              count.push(result.length);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      }
    }
    const getModuleValue = count.length % 12;
    const getDivideValue = count.length - getModuleValue;
    const getLoopValue = getDivideValue / 12;
    let start = 0;
    let end = 0;
    for (let i = 1; i < getLoopValue + 1; i++) {
      start = i == 1 ? 0 : end;
      end = i * 12;
      option[i - 1].data = count.slice(start, end);
    }

    option[option.length - 1].data = count.slice(end, count.length);

    return option;
  } catch (error) {
    throw error;
  }
};
exports.TotalPaymentAndExam =async (currentYear, month) => {
    try {
        const countYear = await getYears(currentYear);
        let option = [];
 
        const getMonthAndYear = [];
        for (let i = 0; i < countYear.length; i++) {
          option.push({ year: countYear[i], totalExam: '' ,totalPayment:''});
          let count = countYear[i] == currentYear ? eval(month) + 1 : 12;
         
          for (let j = 0; j < count; j++) {
            const getDate = await analiysticsTime(countYear[i], j + 1, "02");
            getMonthAndYear.push(getDate);
          }
        }

        option = await getPaymentAnalysisTotal(getMonthAndYear,countYear,option);
       // option = await getExamAnalysisTotal(getMonthAndYear,countYear,option)
       console.log(option);
     return option
    } catch (error) {
        throw error
    }
}

function getYears(currentYear) {
  let startYear = 2023;
  const countYear = [2023];
  for (let i = 0; i < 1; ) {
    if (startYear == currentYear) {
      return countYear;
    } else {
      startYear = startYear + 1;
      countYear.push(startYear);
    }
  }
}


async function getPaymentAnalysisTotal(getMonthAndYear, countYear,option) {
  try {
const getDate = []  
for(let i = 0 ;i<option.length +1; i++) {
  if( option.length == i){

     const get = await analiysticsTime(option[option.length -1].year+1,1,2)
     getDate.push(get)
  }
  else
{  const get = await analiysticsTime(option[i].year,1,2)
  getDate.push(get)}
}

let amount = 0
for(let i = 0; i < option.length; i++){
  await payment
 .find({
      createdAt:{
        $gte: getDate[i],
        $lt: getDate[i + 1],
      },
    })
 .then((result) => {
      console.log(result);
      for(let p=0;p<result.length;p++){
        if(result[p].status =='success')
        { 
          amount = amount + result[p].totalAmount
        }
      }
    
      option[i].totalPayment = amount
    })
 .catch((error) => {
      console.error("Error:", error);
    })
 
}
return option
    // if (getMonthAndYear.length > 12) {
    //   for (let i = 0, j = 0; i < getMonthAndYear.length; i = 12 + i, j++) {
    //     if (getMonthAndYear[i + 12] !== undefined) {

    //       await payment
    //         .find({
    //           createdAt:{
    //             $gte: getMonthAndYear[i],
    //             $lt: getMonthAndYear[i + 12],
    //           },
    //         })
    //         .then((result) => {
          
    //             let amount = 0
    //             for(let p=0;p<result.length;p++){
    //               if(result[p].status == 'success')
    //                { 
                   
    //                 amount = amount + result[p].totalAmount
    //               }
    //             }
    //             option[j].totalPayment = amount
          
             
    //         })
    //         .catch((error) => {
    //           console.error("Error:", error);
    //         })
    //     } else {
         
    //       if (getMonthAndYear.length % 12 > 1) {
    //         for (
    //           let index = 1, minIndex = 2;
    //           index < getMonthAndYear.length % 12;
    //           index++, minIndex--
    //         ) {
    //           if (
    //             getMonthAndYear[getMonthAndYear.length - minIndex + 1] !==
    //             undefined
    //           ) {
    //             await payment
    //               .find({
    //                 createdAt: {
    //                   $gte: getMonthAndYear[getMonthAndYear.length - minIndex],
    //                   $lt: getMonthAndYear[
    //                     getMonthAndYear.length - minIndex + 1
    //                   ],
    //                 },
    //               })
    //               .then((result) => {
    //                 let amount = 0
    //                 for(let p=0;p<result.length;p++){
    //                   if(result[p].status == 'success')
    //                   { 
                     
    //                     amount = amount + result[p].totalAmount
    //                   }
    //                 }
    //                 option[option.length -1].totalPayment = amount
    //                 // option[option.length -1].totalPayment = result.length
               
    //               })
    //               .catch((error) => {
    //                 console.error("Error:", error);
    //               });
    //           }
    //         }
    //       }
    //     }
    //   }
    //   return option
    // }
  } catch (error) {
    throw error;
  }
}

async function getExamAnalysisTotal(getMonthAndYear, countYear,option) {
    try {
        
      let payCount = 0;
      if (getMonthAndYear.length > 12) {
        for (let i = 0, j = 0; i < getMonthAndYear.length; i = 12 + i, j++) {
          if (getMonthAndYear[i + 12] !== undefined) {
            
            await exam
              .find({
                createdAt: {
                  $gte: getMonthAndYear[i],
                  $lt: getMonthAndYear[i + 12],
                },
              })
              .then((result) => {
              
                option[j].totalExam = result.length 
              
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          } else {
           
            if (getMonthAndYear.length % 12 > 1) {
              for (
                let index = 1, minIndex = 2;
                index < getMonthAndYear.length % 12;
                index++, minIndex--
              ) {
             
                if (
                  getMonthAndYear[getMonthAndYear.length - minIndex + 1] !==
                  undefined
                ) {
                  await exam
                    .find({
                      createdAt: {
                        $gte: getMonthAndYear[getMonthAndYear.length - minIndex],
                        $lt: getMonthAndYear[
                          getMonthAndYear.length - minIndex + 1
                        ],
                      },
                    })
                    .then((result) => {
                        option[option.length -1].totalExam = result.length 
                 
                    })
                    .catch((error) => {
                      console.error("Error:", error);
                    });
                }
              

              }
            }
          }
        }
        return option
      }
    } catch (error) {
      throw error;
    }
  }