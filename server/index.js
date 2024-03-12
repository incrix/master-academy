//Imports
const express = require("express");
const route = require("./router/route.js");
const paymentRouter = require('./paymentRoute/route.js')
const path = require("path");
const cors = require("cors");
const {
  sessionManagement,
  AthuVerify,
  userVerify,
  isLogin,
  userCreate,
  isRoll,
  examInfo,
  isValueExam,
  isSignIn,
  checkExamInfo,
  sessionDistroy,
  verifyGoal,
 payStatus
} = require("./auth/auth.js");
const connectDB = require("./util/connectDB.js");


const app = express();

app.set('view engine', 'ejs');
//Initlization
require("dotenv").config();

app.disable("x-powered-by");
//Middleware

app.use(express.json());
app.use(express.text());

//MongoBD Connection
connectDB();
//Auth Session Management
sessionManagement(app);


//Server Route
app.use("/api",route);
app.use('/payment',paymentRouter)
app.use(cors())
//Application Route

// application

const {SendEmail} = require('./controller/email/email.js')

app.get("/otpSend", async (req, res) => {

  // for(let i=0;i<10;i++){
  //   SendEmail('muthu17don@gmail.com',['1','2','3','5'])
  // }
  
  if(req.session.otpNumber !== undefined){
   await SendEmail('muthu17don@gmail.com',[req.session.otpNumber,req.session.otpNumber,req.session.otpNumber,req.session.otpNumber])
   req.session.otpNumber = req.session.otpNumber + 1
  }
  else{
    req.session.otpNumber = 1
 await SendEmail('muthu17don@gmail.com',[req.session.otpNumber,req.session.otpNumber,req.session.otpNumber,req.session.otpNumber])
  }
  res.send(`OTP NUM ${req.session.otpNumber}`)
});


app.get("/isCheck", (req, res) => {
  if (req.session.isAuth)
   { 
    return res.json({ status: "isLogin" });
  }
  else return res.json({ status: "isLogout" });
});


app.get('/isValueExam',(req,res)=>{
  if (req.session.examID)
   { 
    return res.json({ isValue: true });
  }
  else return res.json({ isValue: false,userID:req.session.userID });
})
app.get("/isLogin", (req, res) => {
  if (req.session.isLogin)
   {
    if(req.session.checkPage) return res.json({ status : req.session.checkPage });
    if(req.session.examID){
      res.json({ status: "isExam", message:'go to exam',examID:req.session.examID});
    }
    else{ 
      if(req.session.userRoll == 'student')  return res.json({ status: "isLogin" ,roll: req.session.userRoll, id: req.session.userID });
      else if (req.session.userRoll == "teacher" ||
      req.session.userRoll == "admin" ||
      req.session.userRoll == "institution")
      return res.json({ status: "isLogin" ,roll: req.session.userRoll, id: req.session.userID,institutionID:req.session.institutionID !== undefined ? req.session.institutionID : undefined });
    } 
  }
  else return res.json({ status: "isLogout" });
});


//Payment 
app.get("/handleStatus",userVerify,(req, res) => {
  if(req.session.isAuth) {
    delete req.session.plan
    delete req.session.courseName;
    delete req.session.payStatus;
    delete req.session.planMonth;
    delete req.session.amount;
    delete req.session.discount;
    delete req.session.totalAmount
    delete req.session.validDay
    delete req.session.validMonth
    delete req.session.validYear
    delete req.session.payStatus
    delete req.session.paymentID

   return res.json({status:'success'})
  }
   else  res.json({status:'failed'}) 
});
app.get("/payMent",userVerify,(req,res)=>{
  try {
    if(req.session.payStatus) return res.json({status:true})
    else return res.json({status:false})
   } catch (error) {
     throw error
   }
})


app.get("/",examInfo,userVerify, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

/// user route



app.get("/logout",(req, res) => {
try {
  req.session.destroy();
  res.setHeader('Cache-Control', 'no-store');
  res.json({ status: "logout" });
} catch (error) {
  throw error
}
});
app.get("/clear",(req, res) => {
  try {
    req.session.destroy();
    res.clearCookie("connect.sid")
   res.redirect('/')
  } catch (error) {
    throw error
  }
  });
app.get("/login", isLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
app.get("/signup",sessionDistroy,(req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.get("/login/create", userCreate, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
app.get("/login/verify", userCreate, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
app.get("/login/goal", userCreate,verifyGoal, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

/// admin route

app.get("/admin/dashboard", isRoll, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
app.get("/admin/bank/collection",isRoll, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.get("/admin/manage",isRoll, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.get("/admin/analytics",isRoll, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.get("/admin/institution", isRoll,(req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.get("/admin/bank", isRoll,(req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.get("/admin/dashboard/course",isRoll, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

/// institute
app.get("/admin/institution/page", isRoll, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
app.get("/admin/institution/page/batch",isRoll,(req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

/// exam route


app.get("/exam/info", checkExamInfo,(req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
app.get("/exam/state",isValueExam,(req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
app.get("/exam/result",isSignIn,(req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.get("/exam/solution",isSignIn,(req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});


//institution user
app.get('/institution',(req,res)=>{
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
})
app.get('/institution/batch',(req,res)=>{
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
})

//payment Pages

app.get('/checkout',userVerify,(req,res) => {
  res.sendFile(path.join(__dirname, "../client/build","index.html"))
})
app.get('/plan',userVerify,(req,res) => {
  res.sendFile(path.join(__dirname, "../client/build","index.html"))
})


// Payment Status
app.get('/success',userVerify,(req,res) => {
  res.sendFile(path.join(__dirname, "../client/build","index.html"))
})

app.get('/failure',userVerify,(req,res) => {
  res.sendFile(path.join(__dirname, "../client/build","index.html"))
})



//pdf Download
app.get('/downloadPdf',(req,res) => {
  res.sendFile(path.join(__dirname, "../client/build","index.html"))
})
// Error Page


app.get('/error',(req,res) => {
  res.sendFile(path.join(__dirname, "../client/build","index.html"))
})


//Policy
app.get('/policy',(req,res) => {
  res.sendFile(path.join(__dirname, "../client/build","index.html"))
})


// Static Files
app.use("/", express.static(path.join(__dirname, "../client/build")));
app.use("/", express.static(path.join(__dirname, "../invoice")));

app.use((err, req, res, next) => {

  const status = err.status || 500;
  const message = "Something went wrong";
  const data = err.data || null;
//   res.status(status).json({
//     statue: 500,
//     type: "error",
//     message,
//     data,
// });
 res.redirect('/error')
});

const User = require('./models/user.js')
const Batch = require('./models/batch.js')
const Goal = require('./models/goal.js');
const exam = require("./models/exam.js");
app.get('/checkStudentcreateAccount',async(req,res)=>{
  try {
   const user = await User.find({type:'student'})
   const index = []
   const getCount = []
   for(let i=0;i<user.length;i++){
    if(user[i].goal.length > 1 ){
      const getOneGoal = []
      for(let j=0;j<user[i].goal.length;j++){
        if(j == 0){
          getOneGoal.push( user[i].goal[j])
        }else{
        
        }
      }
      user[i].goal = getOneGoal
    // await user[i].save()
     getCount.push(user[i])
   //  console.log(user[i]);
    }
    if( user[i].batchID.length > 1){
      const getOneBatch = []
      for(let j=0;j<user[i].batchID.length;j++){
        if(j == 0){
          getOneBatch.push( user[i].batchID[j])
        }else{
        
        }
      }
     user[i].batchID = getOneBatch
    // await user[i].save()
      getCount.push(user[i])
     // console.log(user[i]);
    }
    
   }
   //658d6fb3ce97aff254f31608   sp.sharika@gmail.com
 console.log(getCount);
    res.send('check')
  } catch (error) {
    throw error
  }
})



app.get('/checkUserGoal',async(req,res)=>{
  try {
     const goal = await Goal.find()
     const user = await User.find()
     if(goal && user){
      const getGoalId = []
     for(let i=0;i<goal.length;i++){
       getGoalId.push(goal[i]._id.valueOf())
     }
     const getCount = []
     const userNotGetGoal = []
     for(let i=0;i<user.length;i++){
      if(user[i].goal.length > 0)
    { 
      if(getGoalId.indexOf(user[i].goal[0].valueOf()) == -1){
        getCount.push(user[i])
      }
    }
    else userNotGetGoal.push(user[i])
     }
     console.log(getCount);
     console.log(userNotGetGoal);
     return res.send('check')
     }
  return res.send('wrong')
  } catch (error) {
    throw error
  }
})
//rakshithashreyan@gmail.com

app.use((req, res, next) => {
  res.redirect('/error')
})

//Server
app.listen(1338, () => {
  console.log(`Server start at port : ${process.env.PORT}`);
});


  

