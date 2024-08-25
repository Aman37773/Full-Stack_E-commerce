class appError extends Error{
          constructor(message,code){
                   super(message);
                    this.statusCode=code;
                    Error.captureStackTrace(this,this.constructor);
          }
}




//email sending////////////////////////
import nodemailer from 'nodemailer';   //nodemailer is for sending mails

let sendemail= async (email,message,subject)=>{
          var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'kumaraman88739@gmail.com',
                      pass: 'efqw nxtz ujzq rbfs'  //this is app password for my above id which i generated in manage password options at my id
                    }
                  });
                  
                  var mailOptions = {
                    from: 'kumaraman88739@gmail.com',
                    to: email,
                    subject: subject,
                    text: message
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
}


export {
          appError,
          sendemail
}


