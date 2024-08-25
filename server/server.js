//note: require method involves commonjs module and import method involves es6 module which is advanced so we prefer to use import method and for that we need to include "type":module in package.json file
import app from './app.js'
import cloudinary from 'cloudinary'
import path from 'path';


//cloudinary config
cloudinary.v2.config({
          cloud_name: process.env.cloud_name, 
          api_key: process.env.api_key, 
          api_secret: process.env.api_secret
})





const port =process.env.port||3002;

app.listen(port,async ()=>{
          console.log(`server running successfully at ${port}`);
})




          
