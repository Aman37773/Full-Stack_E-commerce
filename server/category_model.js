import mongoose from 'mongoose'
let category_schema=new mongoose.Schema({
name:{
          type:String,
          required:[true,'title is required'],
          lowercase:true,
          trim:true
},
avatar:{
          public_id:{
                    type:String
          },
          secure_url:{
                    type:String
          }
},
},{timestamps:true})

let categorymodel=mongoose.model('category',category_schema);
export default categorymodel;