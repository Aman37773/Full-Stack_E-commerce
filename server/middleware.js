import jwt from 'jsonwebtoken';
import {appError} from './utils.js';

export const errMiddleware=(err,req,res,next)=>{
res.status(err.statusCode).json({
       success:false,
       message:err.message,
       stack:err.stack
})
next()
}


export const isloggedin=async (req,res,next)=>{
// let {token}=req.cookies;
// console.log(token)
// if(!token){
//        return next(new appError('pease login first',400));
//        }    //this works for postman only but not for recieving 

  let token;
  if (req.headers && (req.headers.authorization || req.headers.Authorization)) {
    const authorization = req.headers.authorization || req.headers.Authorization;
    const tokenPrefix = 'Bearer ';

    if (authorization.startsWith(tokenPrefix)) {
      token = authorization.slice(tokenPrefix.length);
    }
 }
 if (!token) {
   return next(new appError('Please login first', 400));
 }

  jwt.verify(token, process.env.secret_key, (err, decoded) => {
    if (err) {
      console.log(err.message)
      return next(new appError(`JWT error: ${err.message}`, 401));
    }
    req.user = decoded; // Store decoded token information in req.user
    next();
  });
}


//check user authorisation
export const authorisationCheck=(...roles)=>(req,res,next)=>{
const currentrole=req.user.role;
console.log(currentrole)
if(!roles.includes(currentrole)){
return next(new appError('not authorised to access this page',403));
}
next();
}



//multer middleware
import multer from 'multer';    //multer helps in taking file in binary format from frontend 
import path from 'path';
let upload=multer({
          dest:'./uploads/',
          limits:{fileSize:50*1024*1024},  //max limit 50 mb
          storage:multer.diskStorage({         //multer.discStorage() is engine used for file upload
                    destination:"./uploads/",
                    filename:(req,file,cb)=>{
                              cb(null,file.originalname);   //cb is callback function which is virtually present in multer and contains two params(first is any error(new error() or null) and second is if executed without error(true or false)) . here we are using file.originalname which is ultimately true and it will internaly utilised by multer so take filename as file.originalname and no need to return anything to filename function.
                    }
          }),
          fileFilter:(req,file,cb)=>{
                    let ext=path.extname(file.originalname);
                    if(
                              ext!==".jpg" &&
                              ext!==".jpeg" &&
                              ext!==".mp4" &&
                              ext!==".png" &&
                              ext!==".webp" 
                    ){
                              cb(new Error(`unsupported file type ${ext}`,false));
                              return;
                    }
                    cb(null,true);
          }
});
export{upload} ;