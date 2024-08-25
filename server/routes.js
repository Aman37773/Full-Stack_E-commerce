import express from 'express';
import {  change_pass, categoryDetail, createcategory, forgot_pass, login, logout, profile, register, removecategory, reset_pass, update_prof, updatecategory, categories, createproduct, products, ProductDetail, removeproduct, updateproduct, limitproducts, productsByFilter, searchproducts, productsofcategory, setOrders, verifyOrder, getOrders, updateStatus, TotUsers} from './controller.js'
import { isloggedin, upload } from './middleware.js';
import { authorisationCheck } from './middleware.js';
import { verify } from 'crypto';

let router=express();

//user routes
router.post('/register',upload.single('avatar'),register);
router.post('/login',login);
router.get('/logout',isloggedin,logout);  //get request means when you just reach /logout then res.json() will print its content and post means when you reach /logout and then submits something(like form) then res.json() will print its content..
router.get('/userprofile',isloggedin,profile);
router.get('/adminprofile',isloggedin,authorisationCheck('admin'),profile);
router.post('/forgot_password',forgot_pass);
router.post('/reset_password/:reset_token',reset_pass);
 router.post('/change_password',isloggedin,change_pass);
 router.post('/update_profile',isloggedin,upload.single('avatar'),update_prof);
 router.get('/totUsers',isloggedin,authorisationCheck('admin'),TotUsers);

//caegory routes
 router.get('/categories',categories);
 router.get('/category_detail/:id',categoryDetail);
router.post('/create_category',isloggedin,authorisationCheck('admin'),upload.single('avatar'),createcategory)
 router.put('/update_category/:id',isloggedin,authorisationCheck('admin'),updatecategory)
 router.delete('/remove_category/:id',isloggedin,authorisationCheck('admin'),removecategory)




//product routes
router.get('/products',products);
 router.get('/product_detail/:id',ProductDetail);
router.post('/create_product',isloggedin,authorisationCheck('admin'),upload.single('avatar'),createproduct)
 router.put('/update_product/:id',isloggedin,authorisationCheck('admin'),upload.single('avatar'),updateproduct)
  router.delete('/remove_product/:id',isloggedin,authorisationCheck('admin'),removeproduct)
  router.post('/productsByFilter',productsByFilter)
  router.post('/limitproducts',limitproducts)
  router.post('/searchproducts',searchproducts)
  router.post('/productsofcategory',productsofcategory)

//payment gateway
router.post('/setorders',isloggedin,setOrders)
router.post('/verifyOrder',isloggedin,verifyOrder)
router.post('/getOrders',isloggedin,getOrders)
router.post('/updateStatus',isloggedin,authorisationCheck('admin'),updateStatus)

export default router