const User = require('../../models/user.js')
    ccav = require('./ccavutil.js'),
    qs = require('querystring')
    const {PaymentStatus} = require('../../util/paymentStatus.js')
exports.postReq = async function(req,res){
    try {
        const user = await User.findOne({_id:req.session.userID})
        const getID = await PaymentStatus(req)       
        if(user){
          req.session.payStatus = true
        var body = '',
          workingKey =  process.env.DEPLOYMENT == 'development' ? process.env.CCAVENUE_WORK_KEY_DEV : process.env.CCAVENUE_WORK_KEY_PRO, //Put in the 32-Bit key shared by CCAvenues.
          accessCode = process.env.DEPLOYMENT == 'development' ? process.env.CCAVENUE_ACCESS_CODE_DEV : process.env.CCAVENUE_ACCESS_CODE_PRO,  //Put in the Access Code shared by CCAvenues.
          encRequest = '',
          formbody = '';
          
              body = qs.stringify({
                  merchant_id: '2895903',
                  order_id:getID.valueOf(),
                  currency: 'INR',
                  amount:req.session.totalAmount,
                  redirect_url: process.env.DEPLOYMENT == 'development' ?  process.env.CCAVENUE_LINK_DEV : process.env.CCAVENUE_LINK_PRO ,
                  cancel_url:  process.env.DEPLOYMENT == 'development' ? process.env.CCAVENUE_LINK_DEV : process.env.CCAVENUE_LINK_PRO,
                  language: 'EN',
                  billing_name: user.name,
                  billing_country: 'India',
                  billing_tel: user.phoneNumber,
                  billing_email: user.email,
                  delivery_name: 'The Masters Academy',
                  delivery_address: 'Academy',
                  delivery_city:' Coimbatore',
                  delivery_state: 'TN',
                  delivery_zip: '641001',
                  delivery_country: 'India',
                  delivery_tel: '0123456789',
          
                 billing_address: user.address,
                 billing_city: user.city,
                 billing_state: user.state,
                 billing_zip: user.pincode,
            
                })
               
              encRequest = ccav.encrypt(body,workingKey); 
              formbody = `<form id="nonseamless" method="post" name="redirect" action="https://${ process.env.CCAVENUE_METHOD}.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="` + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';	
              res.writeHeader(200, {"Content-Type": "text/html"});
          res.write(formbody);
          res.end();
            }
          else{
            res.redirect('/')
          }
    } catch (error) {
        throw error
    }
  

};
