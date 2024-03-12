// const mongoose = require('mongoose')

// const connectDB = ()=>{
//     mongoose
// .connect(process.env.MONGODBURL,{
//     useNewUrlParser: true,        
//     useUnifiedTopology: true
// })
// .then((res)=>{
//     console.log('connect dataBase');
// })
// }

// module.exports = connectDB

let connection = null;

const poolSize = 2
module.exports = async function () {
  if (
    connection === null ||
    (connection.connection.readyState !== 1 &&
      connection.connection.readyState !== 2)
    // readystate 1 === connected, 2 === connecting, I don't want to start new connection if it's already connecting.
  ) {
    mongoose = require("mongoose");
    console.log("[MONGOOSE] Creating New Connection");

    mongoose.connection.on("open", () => {
        console.log("Connected with poolSize " + poolSize);
   //   log("[ MONGOOSE] Connected with poolSize " + poolsize);
    });

    try {
  mongoose.connect(process.env.MONGODBURL,{
    
        maxPoolSize: poolSize,
      }).then(res => {
           
      })

    } catch (err) {
      console.log("Mongoose connection error", err);
    }
    connection = mongoose; //save it to the cache variable
  
    return 
  } else {
    return;
  }
};

