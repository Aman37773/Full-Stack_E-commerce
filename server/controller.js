import { appError } from './utils.js';
import { sendemail } from './utils.js';
import user from './model.js'
import bcrypt from 'bcryptjs'
import emailvalidator from 'email-validator';
import cloudinary from 'cloudinary'
import fs from 'fs'
import category from './category_model.js'
import dotenv from 'dotenv'
dotenv.config();
import crypto from 'crypto';
import productmodel from './product_model.js';
import ordermodel from './order_model.js';
import usermodel from './model.js';





//defining cookieOptions
const cookieOption = {
  maxAge: 24 * 60 * 60 * 1000, //(24h)  //maxAge takes in miliseconds
  httpOnly: true,
 // secure:true    //use of this............
 secure: false, sameSite: 'none'
}

//register.......
const register = async (req, res, next) => {
  try{
    let m = req.body;
    if (!m.fullname || !m.email || !m.password || !m.address ||!m.phone) {
      let a = new appError('every field is required', 400);
      return next(a);
    }
    
    if (!m.role) {
      m.role = 'user';
    }
    let email = emailvalidator.validate(m.email);
    if (!email) {
      let a = new appError('not a valid email', 400);
      return next(a);
    }
  
    const getuser = await user.findOne({ email: m.email });
    if (getuser) {
      let a = new appError('user already exists', 400);
      return next(a);
    }
  
  
    const usercreate = await user.create({
      fullname: m.fullname,
      email: m.email,
      password: m.password,
      address:m.address,
      phone:m.phone,
      avatar: {
        public_id: m.email,
        secure_url: 'https://demo-res.cloudinary.com/image/upload/sample.jpg'
      },
     // role: m.role,
    })
    if (!usercreate) {
      let a = new appError('cannot register', 400);
      return next(a);
    }
  
    //upload avatar at cloudinary and get link
    console.log(req.file);
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",  //upload file in which folder in cloudinary
          width: 250,
          height: 250,
          gravity: 'faces',
          crop: 'fill'
  
        })
        if (result) {
          usercreate.avatar.public_id = result.public_id;
          usercreate.avatar.secure_url = result.secure_url;
          fs.unlinkSync(`./uploads/${req.file.filename}`);
        }
      }
      catch (err) {
        const a = new appError(`file not uploaded: ${err.message}`, 404);
        return next(a);
      }
    }
  
  
    await usercreate.save();   //not necessary to call save when we are creating user explicitely  like this and not like user(req.body);
  
    usercreate.password = undefined;
  
    let token = await usercreate.jwtToken();
    res.cookie('token', token, cookieOption);

    usercreate.password=m.password
  
    return res.status(200).json({
      success: true,
      message: 'user registered successfully',
      userinfo: usercreate,
      token:token
    })
  }
  catch(err){
    console.log(err.message)
  }
  
}



//login...........
const login = async (req, res, next) => {
  const m = req.body;
  if (!m.email || !m.password) {
    let a = new appError('enter both', 400);
    return next(a);
  }
 
  const usercheck = await user.findOne({ email: m.email });
  if (!usercheck || ! await bcrypt.compare(m.password, usercheck.password)) {
    let a = new appError('incorrect credentials', 400);
    return next(a);
  }
  let token = await usercheck.jwtToken();
  res.cookie('token', token, cookieOption);

usercheck.password=m.password
  return res.status(200).json({
    success: true,
    message: 'user login successfully',
    userinfo:usercheck,
    token:token
  })

}


//logout....
const logout = (req, res) => {
  let cookieOption = {
    maxAge: 0,
    httpOnly: true,
  }
  res.cookie('token', null, cookieOption)
  console.log(req.user.email);
  return res.status(200).json({
    success: true,
    message: 'user logout successfully',
  })
}


//reach profile
const profile = async (req, res) => {
  let getdetails = await user.findById(req.user.id);
  if (!getdetails) {
    let a = new appError('enter both', 400);
    return next(a);
  }
  console.log(getdetails.email);
  return res.status(200).json({
    success: true,
    message: 'access profile successfully',
  })
}


//forgot-password
const forgot_pass = async (req, res, next) => {
  let email = req.body.email;
  if (!email) {
    let a = new appError('please enter email', 400);
    return next(a);
  }
  const get = await user.findOne({ email: email });
  if (!get) {
    let a = new appError('not registered', 404);
    return next(a);
  }
  let token = await get.resetToken();   //here resettoken creates crypto token and we are using it instead of jwt one because crypto is small and more secured than jwt and also we do not want to include any user credentials in token. also crypto everytime generates random password even for same email id which makes it difficult to hack..
  await get.save();
  let url_to_email = `${process.env.front_end_url}/reset_password/${token}`;

  try {
    let message = url_to_email;
    let subject = 'click on url to verify';
    await sendemail(email, message, subject);
    return res.status(200).json({
      success: true,
      message: 'sent email successfully'
    })
  }

  catch (err) {
    get.forgotpasswordtoken = undefined;
    get.forgotpasswordexpiry = undefined;
    await get.save();
    let a = new appError(err.message, 400);
    return next(a);
  }

}





//reset password
const reset_pass = async (req, res, next) => {
  const { reset_token } = req.params;
  const { password } = req.body;
  
  const token = crypto
    .createHash('sha256')
    .update(reset_token)
    .digest('hex');
  const get = await user.findOne({ $and: [{ "forgotpasswordtoken": token }, { "forgotpasswordexpiry": { $gte: Date.now() } }] });
  if (!get) {
    let a = new appError('token expired', 400);
    return next(a);
  }
  get.password = password;
  get.forgotpasswordtoken = undefined;
  get.forgotpasswordexpiry = undefined;
  await get.save();
  return res.status(200).json({
    success: true,
    message: 'changed password successfully'
  })
}



//change password when logged in
const change_pass = async (req, res, next) => {
  let { id } = req.user;

  let { oldpassword, newpassword } = req.body;
  if (!oldpassword || !newpassword) {
    return next(new appError('both fields are mandatory', 400));
  }

  let get = await user.findById(id);
  if (!get) {
    return next(new appError('not a valid user', 400));
  }

  if (!await bcrypt.compare(oldpassword, get.password)) {
    return next(new appError('not a valid user', 400));
  }

  get.password = newpassword;
  await get.save();

  return res.status(200).json({
    success: true,
    message: 'password changed successfully'
  })
}

//to update profile after logged in
const update_prof = async (req, res, next) => {
  const get = await user.findById(req.user.id);
  if (!get) {
    return next(new appError('not a valid user', 400));
  }

  let m = req.body;
  if (m.fullname && m.phone && m.address) {
    get.fullname = m.fullname;
    get.phone=m.phone
    get.address=m.address
  }


  if (req.file) {
    try {
      if (get.avatar && get.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(get.avatar.public_id);  //cloudinary uploads photos by giving then unique public_id
      }
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",  //upload file in which folder in cloudinary
        width: 250,
        height: 250,
        gravity: 'faces',
        crop: 'fill'

      })
      console.log(result.public_id);
      if (result) {
        get.avatar.public_id = result.public_id;
        get.avatar.secure_url = result.secure_url;
        fs.unlinkSync(`./uploads/${req.file.filename}`);
      }
    }
    catch (err) {
      const a = new appError(`file not uploaded: ${err.message}`, 404);
      return next(a);
    }
  }

  await get.save();
  let token = await get.jwtToken();
  res.cookie('token', token, cookieOption);

  return res.status(200).json({
    success: true,
    message: 'user details updated successfully',
    userinfo:get,
    token:token
  })
}



//to see categories
const categories = async (req, res, next) => {
  let get = await category.find({});
  if (!get) {
    return next(new appError('no category available', 400));
  }

  return res.status(200).json({
    success: true,
    categories: get
  })

}



//to see individulaCategoryDetail
const categoryDetail = async (req, res, next) => {
  try {
    let get = await category.findById(req.params.id);
    if (!get) {
      return next(new appError('no such category available', 400));
    }

    return res.status(200).json({
      success: true,
      category: get
    })
  }
  catch (err) {
    return next(new appError(`cannot access category: ${err.message}`, 400));
  }

}



//to create category(available for admin)
const createcategory = async (req, res, next) => {
  let m = req.body;
  if (!m.name ) {
    return next(new appError('all details mandatory', 400));
  }

  const check=await category.findOne({name:m.name});
  if(check){
    return next(new appError('category with same name exists', 400));
  }

  let get = await category.create({
    name: m.name,
  })

  if (!get) {
    return next(new appError('cannot create category', 400));
  }

    if(req.file){
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",  //upload file in which folder in cloudinary
          width: 250,
          height: 250,
          gravity: 'faces',
          crop: 'fill'
        })
    
        if (result) {
          get.avatar.public_id = result.public_id;
          get.avatar.secure_url = result.secure_url;
          fs.unlinkSync(`./uploads/${req.file.filename}`);
        }
    
      }
      catch (err) {
        return next(new appError(`cannot upload thumbnail photo: ${err.message}`, 400))
      }
    }
    await get.save();
        return res.status(200).json({
          success: true,
          message: 'created category successfully',
        })
}




//update category
const updatecategory = async (req, res, next) => {
  try {
    let { id } = req.params;
    const get = await category.findByIdAndUpdate(id, { $set: req.body }, { runValidators: true }); //runvalidators just ensures that details are valid and schema not affected 
    if (!get) {
      return next(new appError(`cannot update category: ${err.message}`, 400))
    }
    
    return res.status(200).json({
      success: true,
      message: 'updated category successfully'
    })
  }
  catch (err) {
    return next(new appError(`cannot update category: ${err.message}`, 400))
  }
}




//remove category
const removecategory = async (req, res, next) => {
  try {
    let { id } = req.params;
    const p = await category.findById(id)
    if (!p) {
      return next(new appError(`cannot find any category like this: ${err.message}`, 400))
    }
    const get = await category.deleteOne({ _id: id }); //runvalidators just ensures that details are valid and schema not affected 
    return res.status(200).json({
      success: true,
      message: 'deleted category successfully'
    })
  }
  catch (err) {
    return next(new appError(`cannot delete category: ${err.message}`, 400))
  }
}



//products routes
//create product
const createproduct=async (req,res,next)=>{
  let m = req.body;
  if (!m.name || !m.description || !m.price || !m.category || !m.quantity ) {
    return next(new appError('all details mandatory', 400));
  }


  let get = await productmodel.create({
    name: m.name,
    description:m.description,
    price:m.price,
    category:m.category,
    quantity:m.quantity
  })

  if (!get) {
    return next(new appError('cannot create product', 400));
  }

    if(req.file){
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",  //upload file in which folder in cloudinary
          width: 250,
          height: 250,
          gravity: 'faces',
          crop: 'fill'
        })
    
        if (result) {
          get.avatar.public_id = result.public_id;
          get.avatar.secure_url = result.secure_url;
          fs.unlinkSync(`./uploads/${req.file.filename}`);
        }
    
      }
      catch (err) {
        return next(new appError(`cannot upload thumbnail photo: ${err.message}`, 400))
      }
    }
    if(m.shipping){
    get.shipping=m.shipping
    }
  
    await get.save();
    console.log('saved')
        return res.status(200).json({
          success: true,
          message: 'created product successfully',
          products:get
        })
}


//to see products
const products = async (req, res, next) => {
  try{
     let get = await productmodel.find({});
    if (!get) {
      return next(new appError('no product available', 400));
    }
  
    return res.status(200).json({
      success: true,
      totalcount:get.length,
      products: get
    })
  }
  catch(err){
    console.log(err.message)
    return next(new appError('something went wrong', 400));
  }
}


//to search products
const searchproducts = async (req, res, next) => {
  try{
    const {keyword}=req.body
     let get = await productmodel.find({
      $or:[{name:{$regex:keyword,$options:'i'}},{description:{$regex:keyword,$options:'i'}}]
     });
    if (!get) {
      return next(new appError('no product available', 400));
    }
  
    return res.status(200).json({
      success: true,
      totalcount:get.length,
      products: get
    })
  }
  catch(err){
    console.log(err.message)
    return next(new appError('something went wrong', 400));
  }
}


//to see products by limit
const limitproducts = async (req, res, next) => {
  const {offset,limit}=req.body;
  let get = await productmodel.find({}).skip(offset).limit(limit);
  if (!get) {
    return next(new appError('no product available', 400));
  }

  return res.status(200).json({
    success: true,
    totalcount:get.length,
    products: get
  })

}


//to see products of a category
const productsofcategory = async (req, res, next) => {
  const {offset,limit,category}=req.body;
  let args={};
  if(category){
    args.category=category
  }
  let get = await productmodel.find(args).skip(offset).limit(limit);
  console.log(get)
  if (!get) {
    return next(new appError('no product available', 400));
  }

  return res.status(200).json({
    success: true,
    totalcount:get.length,
    products: get
  })

}



//to see products by filter
const productsByFilter = async (req, res, next) => {
  try{
    const {category,price,n_id}=req.body;
    let args={};
    if(category && category.length){
      args.category=category;
    }
    if(price && price.length){
      args.price={$gte:price[0],$lte:price[1]};
    }
   if(n_id){
    args._id={$ne:n_id};
   }
    let get = await productmodel.find(args);  //and operator is automatically applied so no need to apply..
    if (!get) {
      return next(new appError('no product available', 400));
    }
  
    return res.status(200).json({
      success: true,
      totalcount:get.length,
      products: get
    })
  
  }
  catch(err){
    console.log(err.message)
  }
  
}

//to see individulaProductDetail
const ProductDetail = async (req, res, next) => {
  try {
    let get = await productmodel.findById(req.params.id);
    if (!get) {
      return next(new appError('no such product available', 400));
    }

    return res.status(200).json({
      success: true,
      product: get
    })
  }
  catch (err) {
    return next(new appError(`cannot access product: ${err.message}`, 400));
  }

}


//remove product
const removeproduct = async (req, res, next) => {
  try {
    let { id } = req.params;
    const p = await productmodel.findById(id)
    if (!p) {
      return next(new appError(`cannot find any product like this: ${err.message}`, 400))
    }
    const get = await productmodel.deleteOne({ _id: id }); //runvalidators just ensures that details are valid and schema not affected 
    return res.status(200).json({
      success: true,
      message: 'deleted product successfully'
    })
  }
  catch (err) {
    return next(new appError(`cannot delete product: ${err.message}`, 400))
  }
}


//update product
const updateproduct = async (req, res, next) => {
  try {
    let { id } = req.params;
    const get = await productmodel.findByIdAndUpdate(id, { $set: req.body }, { runValidators: true }); //runvalidators just ensures that details are valid and schema not affected 
    if (!get) {
      return next(new appError(`cannot update product: ${err.message}`, 400))
    }
    if(req.file){
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",  //upload file in which folder in cloudinary
          width: 250,
          height: 250,
          gravity: 'faces',
          crop: 'fill'
        })
    
        if (result) {
          get.avatar.public_id = result.public_id;
          get.avatar.secure_url = result.secure_url;
          fs.unlinkSync(`./uploads/${req.file.filename}`);
        }
    
      }
      catch (err) {
        return next(new appError(`cannot upload thumbnail photo: ${err.message}`, 400))
      }
    }
    await get.save();
    
    return res.status(200).json({
      success: true,
      message: 'updated productt successfully',
      product:get
    })
  }
  catch (err) {
    return next(new appError(`cannot update product: ${err.message}`, 400))
  }
}




//set orders
const setOrders=async (req,res,next)=>{
  try{
    const m=req.body;
//m={products,payment,buyer,paymentStatus,status,session_id}
const get=await ordermodel.create(m)
if(!get){
  return next(new appError(`cannot set orders: ${err.message}`, 400))
}
res.status(200).json({
  success:true,
  message:'created order'
})
  }
  catch(err){
    return next(new appError(`cannot set orders: ${err.message}`, 400))
  }
}

//verify created order
const verifyOrder=async (req,res,next)=>{
  try{
    const {sessionId}=req.body;
//m={products,payment,buyer,paymentStatus,status,session_id}
const get=await ordermodel.findOne({session_id:sessionId})
if(!get){
  return next(new appError(`please do not bluff`, 400))
}
get.paymentStatus='Completed';
await get.save();
res.status(200).json({
  success:true,
  message:'payment done'
})
  }
  catch(err){
    console.log(err.message)
    return next(new appError(`please do not bluff me: ${err.message}`, 400))
  }
}

//get order details
const getOrders=async (req,res,next)=>{
  try{
    const m=req.body;
    //m={buyer,paymentStatus}
const get=await ordermodel.find(m).sort({createdAt:-1})
if(get){
 return res.status(200).json({
  success:true,
  orders:get
 })
}
  }
  catch(err){
    console.log(err.message)
    return next(new appError(`failed to load: ${err.message}`, 400))
  }
}

//update order statusby admin
const updateStatus=async (req,res,next)=>{
  try{
    const {sessionId,status}=req.body;
const get=await ordermodel.updateOne({session_id:sessionId},{status:status})
if(get){
 return res.status(200).json({
  success:true,
  message:'updated status',
 })
}
  }
  catch(err){
    console.log(err.message)
    return next(new appError(`failed to update ${err.message}`, 400))
  }
}

//total users data for map
const TotUsers=async (req,res,next)=>{
  try{
    let curDate=new Date();
    //curday
    let startOfDay = new Date(curDate.setHours(0, 0, 0, 0));
    let endOfDay = new Date(curDate.setHours(23, 59, 59, 999));
let get1=await usermodel.countDocuments({createdAt: {
  $gte: startOfDay,
  $lte: endOfDay
}})

//prevday
curDate.setDate(curDate.getDate()-1)
 startOfDay = new Date(curDate.setHours(0, 0, 0, 0));
 endOfDay = new Date(curDate.setHours(23, 59, 59, 999));
 let get2=await ordermodel.countDocuments({createdAt: {
$gte: startOfDay,
$lte: endOfDay
}})

//prevprevday
curDate.setDate(curDate.getDate()-1)
 startOfDay = new Date(curDate.setHours(0, 0, 0, 0));
 endOfDay = new Date(curDate.setHours(23, 59, 59, 999));
 let get3=await usermodel.countDocuments({createdAt: {
$gte: startOfDay,
$lte: endOfDay
}})

//totusers
let get4=await usermodel.countDocuments()

 return res.status(200).json({
  success:true,
  count:[get1,get2,get3],
  totusers:get4,
 })

  }
  catch(err){
    console.log(err.message)
    return next(new appError(`failed to update ${err.message}`, 400))
  }
}



export {           //export default ..  is generally used for single entity export and while importing it, we cannot use curly braces.  for single function export, it acts as function at import else act as object
  register,
  login,
  logout,
  profile,
  forgot_pass,
  reset_pass,
  change_pass,
  update_prof,
  categories,
  categoryDetail,
  createcategory,
  updatecategory,
  removecategory,
  createproduct,
  products,
  ProductDetail,
  removeproduct,
  updateproduct,
  productsByFilter,
  limitproducts,
  searchproducts,
  productsofcategory,
  setOrders,
  verifyOrder,
  getOrders,
  updateStatus,
  TotUsers
}