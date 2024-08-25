import { useEffect, useState } from 'react'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import About from './pages/about'
import Homepage from './pages/homepage'
import Contact from './pages/contact'
import Policy from './pages/policy'
import Pagenotfound from './pages/pagenotfound'
import Register from './pages/register'
import Login from './pages/login'
import  createContext  from './contextvar.js';
import Dashboard_middleware from './private_route/dashboard_middleware_route'
import Forgot_pass from './pages/forgot_pass'
import Email_verify from './pages/email_verify'
import Reset_pass from './pages/reset_pass'
import AdminDashboard_middleware from './private_route/admin_dashboardmiddleware'
import CreateCategory from './pages/admin/createcategory'
import CreateProduct from './pages/admin/createproduct'
import Users from './pages/admin/users'
import UserDashboard from './pages/user/userdashboard'
import AdminDashboard from './pages/admin/admindashboard'
import User_profile from './pages/user/user_profile'
import User_orders from './pages/user/user_orders'
import Product from './pages/admin/product'
import Product_detail from './pages/admin/product_detail'
import OnlyProductDetails from './pages/onlyproductdetails'
import Categories from './pages/categories'
import Productsofcategory from './pages/productsofcategory'
import Cart from './pages/cart'
import Admin_orders from './pages/admin/admin_order'

function App() {
  const [auth,setauth]=useState({
    user:'',
    token:null
  })

  const [cart,setcart]=useState([]);

  useEffect(()=>{
const data=localStorage.getItem('auth')
const cartdata=localStorage.getItem('cart')
if(data){
  const parseddata=JSON.parse(data);   //localstorage stored data in string format so we need parser to convert string back to json type..
  setauth({...auth,user:parseddata.userinfo,token:parseddata.token})
}
if(cartdata){
  const parseddata=JSON.parse(cartdata); 
  setcart(parseddata)
}
  },[]) //if i use auth as dependency then infinite loop is created because my useeffect function is itself updating auth so i used useeffect for first render now this will provide value to auth from localstorage so auth will retain value until we delete localstorage and empty the auth.. 

  return (
    <>
     <createContext.Provider value={{auth,setauth,cart,setcart}}>
     <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/policy' element={<Policy/>}/>
      <Route path='*' element={<Pagenotfound/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/only_product_detail/:id/:catid' element={<OnlyProductDetails/>}/>
      <Route path='/categories' element={<Categories/>}/>
      <Route path='/categories/:id' element={<Productsofcategory/>}/>
      <Route path='/cart' element={<Cart/>}/>

      <Route path='/dashboard' element={<Dashboard_middleware/>}>
      <Route path='user' element={<UserDashboard/>}/>
      <Route path='user/profile' element={<User_profile/>}/>
      <Route path='user/orders' element={<User_orders/>}/>
      </Route>

      <Route path='/dashboard' element={<AdminDashboard_middleware/>}>
      <Route path='admin' element={<AdminDashboard/>}/>
      <Route path='admin/create-category' element={<CreateCategory/>}/>
      <Route path='admin/create-product' element={<CreateProduct/>}/>
      <Route path='admin/users' element={<Users/>}/>
      <Route path='admin/products' element={<Product/>}/>
      <Route path='admin/product_detail/:id' element={<Product_detail/>}/>
      <Route path='admin/admin_orders' element={<Admin_orders/>}/>
      </Route>
      
      <Route path='/forgot_pass' element={<Forgot_pass/>}/>
      <Route path='/email_verify' element={<Email_verify/>}/>
      <Route path='/reset_password/:id' element={<Reset_pass/>}/>
    </Routes>
     </createContext.Provider>
    </>
  )
}

export default App
