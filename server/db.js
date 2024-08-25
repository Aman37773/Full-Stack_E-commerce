import mongoose from 'mongoose';
mongoose.set('strictQuery',false);  //without this , if we do query on field of scema which is not defined then it would give error but with this, it will ignore that query without giving error and maintains consistency..

const connecttodb = ()=>{
          mongoose.connect(process.env.mongo_uri).then((conn)=>{
                    console.log("connected to db",conn.connection.host);
          }).catch((err)=>{
                    console.log(err.message);
          })
}

export default connecttodb