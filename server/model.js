import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'      //crypto is used to generate random string which is used for token generation..

//user details schema
let schema=new mongoose.Schema({     
fullname:{
          type:String,
          required:[true,'name is required'],
          minLength:[5,'length should be atleast 5 char'],
          maxLength:[50,'length should be atmost 50 char'],
          lowercase:true,
          trim:true
},
email:{
          type:String,
          required:[true,'email is required'],  
          lowercase:true,
          trim:true,
          unique:true 
},
password:{
          type:String,
          required:[true,'password is required'],  
          minLength:[5,'length should be atleast 5 char']
},
address:{
          type:String,
          required:[true,'address is required'],  
},
avatar:{
          public_id:{
                    type:String
          },
          secure_url:{
                    type:String
          }
},
role:{
type:String,
enum:['user','admin'],
default:'user'
},
phone:{
          type:String,
          required:[true,'phone is required'],  
},
forgotpasswordtoken:String,
forgotpasswordexpiry:Date,    //takes value in milisec

},{timestamps:true})


//password encyrption
schema.pre('save',async  function (next){
if(!this.isModified('password')){
return next();
}
this.password= await bcrypt.hash(this.password,10);
next();
})


//token code
schema.methods={
          jwtToken(){      //simply means jwtToken: function (){...}
                    return jwt.sign(
                              {fullname:this.fullname,id:this._id,email:this.email,role:this.role},
                              process.env.secret_key,
                              {expiresIn:process.env.tokenExpiry}   //expiresIn accepts value in seconds but can also mention in string as "24h" which means 24 hours
                              )
          },

          resetToken(){
                   const resetstring=crypto.randomBytes(20).toString('hex');
                   this.forgotpasswordtoken=crypto
                                        .createHash('sha256')
                                        .update(resetstring)
                                        .digest('hex');
                    this.forgotpasswordexpiry=Date.now()+15*60*1000;
                    return resetstring;
          }
}


let usermodel=mongoose.model('user',schema);
export default usermodel;