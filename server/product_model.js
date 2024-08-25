import mongoose from "mongoose";
const Productschema=new mongoose.Schema({
name:{
          type:String,
          required:true
},
description:{
          type:String,
          required:true
},
price:{
          type:Number,
          required:true
},
category:{
          type:mongoose.ObjectId,
          ref:'category',
          required:true
},
quantity:{
          type:Number,
          required:true   
},
avatar:{
          public_id:{
                    type:String
          },
          secure_url:{
                    type:String
          }
},
shipping:{
          type:Boolean,
}
},{timestamps:true})

const productmodel=mongoose.model('products',Productschema);
export default productmodel