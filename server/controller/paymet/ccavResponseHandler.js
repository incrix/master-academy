var ccav = require("./ccavutil.js"),
  qs = require("querystring");
  const Payment = require("../../models/payment");
const User = require("../../models/user.js");
const Goal = require('../../models/goal.js')
const {invoiceEmail} = require('../email/invoiceEmail.js')
exports.postRes = async function (request, response) {

  var ccavEncResponse = "",
    ccavResponse = "",
    workingKey =  process.env.DEPLOYMENT == 'development' ?  process.env.CCAVENUE_WORK_KEY_DEV :  process.env.CCAVENUE_WORK_KEY_PRO, //Put in the 32-Bit key shared by CCAvenues.
    ccavPOST = "";
  
  request.on("data", function (data) {
    ccavEncResponse += data
    ccavPOST = qs.parse(ccavEncResponse)
    var encryption = ccavPOST.encResp;
    ccavResponse = ccav.decrypt(encryption, workingKey);
  });

  request.on("end", async function () {
    const check = qs.parse(ccavResponse);
    
    const payment = await Payment.findOne({_id:check.order_id})
    console.log(check);
    if (check.order_status == "Success") {
     
      await updatePlan(payment,check.order_id)
      var pData = ""; 
      return response.redirect('/success')
    } else {
      payment.status = 'failed'
      await payment.save()
     return response.redirect('/failure')
    }
  });
};

const updatePlan = async (data,orderID) =>{
  try {

      const user = await User.findOne({_id:data.userID})
      const payment = await Payment.findOne({_id:orderID})
      const goal = await Goal.findOne({userId:user._id,courseId:data.courseID})
      if(user && payment && goal)
      {
        const date = new Date()
        date.setMonth(date.getMonth() + eval(payment.planMonth))
        let indianTime = date.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        });
        const month = indianTime.split(',')[0]
        const time =  indianTime.split(',')[1].trim()
     
        payment.validDate = month
        payment.validTime = time
        payment.status = 'success'
        await payment.save()
      //  invoiceEmail(user.email,payment)
       goal.plan = 'pro'
       goal.planValidDate = month
       goal.planValidTime = time
       goal.save()
      }
  } catch (error) {
    throw error
  }
}
