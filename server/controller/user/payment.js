
const Course = require("../../models/course.js");
const User = require('../../models/user.js')
exports.getPlan = async(req,res) =>{
    try {
      if(req.session.Plan)
      {
       const course = await Course.findOne({_id:req.session.Plan})
  
       res.json({
         Payment:course.Payment
       })
      }
      else res.json({plan:'not choose yet'})
    } catch (error) {
      throw error
    }
  }

  exports.sendPlan = async(req,res) =>{
    try {
        if(req.session.Plan){
         
            const course = await Course.findOne({_id:req.session.Plan})
            const get = course.Payment.filter(task => task._id == req.body.plan._id)
         
            if(get.length > 0) {
               const payment = get[0]

               // create GST
                let GST = (payment.amount/100)*18
               let discount = (payment.amount/100)*payment.discount
              GST = Math.round(GST)  
             
              const total = (payment.amount - discount) // add without GST
              const date = new Date()
              date.setMonth(date.getMonth()+payment.month)
              let indianTime = date.toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
                hour12: false,
              });
            
             const getDay = indianTime.split(',')[0].split('/')
             req.session.courseName = course.title
             req.session.planMonth = payment.month
             req.session.amount = payment.amount
             req.session.discountAmount = discount
             req.session.discount = payment.discount
             req.session.totalAmount = total
            req.session.validDay = getDay[1]
            req.session.validMonth = getDay[0]
            req.session.validYear = getDay[2]
            return res.json({status:'success',message:'ok'})
            }
            else return res.json({status:'error',message:'somthing wrong'})
        }
        else return res.json({status:'error',message:'somthing wrong'})
    } catch (error) {
        throw error  
    }
  }


  exports.getCheckout = async(req,res) =>{
    try {
        if(req.session.Plan)
        {
          if(
            req.session.amount &&
             req.session.totalAmount &&
            req.session.validDay &&
            req.session.validMonth &&
            req.session.validYear &&
            req.session.planMonth &&
            req.session.courseName 
          )
          {
            res.json({
                amount:req.session.amount,
                totalAmount:  req.session.totalAmount,
                day:req.session.validDay,
                month: req.session.validMonth,
                year:req.session.validYear,
                planMonth : req.session.planMonth,
                courseName:req.session.courseName,
                discount:req.session.discount,
                discountAmount : req.session.discountAmount 
            })
          }
          else return res.json({status:'error',message:'somthing wrong'})
        }
        else{
            return res.json({status:'error',message:'somthing wrong'})
        }
    } catch (error) {
        throw error
    }
  }


 exports.getUserAddress = async (req,res) =>{
try {
const user = await User.findOne({_id:req.session.userID})
if(user){
  const address = {
    city:user.city == undefined ? null : user.city,
    pincode:user.pincode == undefined ? null : user.pincode,
    state:user.state == undefined ? null : user.state,
    address:user.address == undefined ? null : user.address,

  }
  return res.json({address})
}  
} catch (error) {
  throw error
}
 }

 exports.createAddress = async (req,res) =>{
  try {
    const {address,city,state,pincode} = req.body
    const user = await User.findOne({_id:req.session.userID})
    if(user){
    
      user.address = address
      user.city = city
      user.state = state
      user.pincode = pincode
      await user.save()
      return res.json({status:'success',message:'your address created successfully'})
    }
  } catch (error) {
    throw error
  }
 }