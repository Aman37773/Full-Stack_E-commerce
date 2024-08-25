import { NavLink } from "react-router-dom"   //link and navlnk works same but navlink highlights current active link..
import '../../index.css'
import { HiShoppingCart} from 'react-icons/hi'
import  createContext  from "../../contextvar.js"
import { useContext, useEffect,useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import getcategories from "../../pages/usecategories"
import { Badge } from "antd";

function Header(){
    let {auth,setauth}=useContext(createContext);
    const {cart,setcart}=useContext(createContext)
    const categories=getcategories();
   
    
    let logouthandle=async ()=>{
        try{
            let res=await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/logout`, {
                headers: { 'Authorization': `Bearer ${auth?.token}` }, 
              })
            console.log(res)
            if(res.data.success && res.status===200){
                setauth({...auth,user:null});
            localStorage.removeItem('auth');
                toast.success('logout successfully')
            }
        }
        catch(err){
            if(err.message= "JWT error: jwt expired"){
                setauth({...auth,user:null});
            localStorage.removeItem('auth');
                toast.success('logout successfully')
            }
            else{
                toast.error('something went wrong') 
            }
        }
       
    }

  


          return <>
       <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <NavLink to='/' className="navbar-brand" ><HiShoppingCart /> ecommerce app </NavLink>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to='/' className="nav-link " >Home</NavLink>
                        </li>
                        <li className="nav-item dropdown dropch">
                            <NavLink className="nav-link dropdown-toggle" data-bs-toggle="dropdown" >
                            Category
                            </NavLink>
                            <ul className="dropdown-menu">
                                {categories && categories.map((el)=>
                                    <li key={el._id} > <NavLink to={`/categories/${el._id}`} className="nav-link fs-7" >{el.name}</NavLink></li>
                                )}
                                <li > <NavLink to='/categories' className="nav-link fs-7" >All Categories</NavLink></li>
                            </ul>
                            </li>

                        {auth.user? <>

                            <li className="nav-item dropdown dropch">
                            <NavLink className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                          {auth?.user.avatar?.secure_url &&  <img className='profile-image' src={auth.user.avatar.secure_url}/>}   {auth?.user.fullname}
                            </NavLink>
                            <ul className="dropdown-menu">
                            <li> <NavLink to='/login' className="nav-link" onClick={logouthandle}>Logout</NavLink></li>
                            <li> <NavLink to={`/dashboard/${auth?.user.role}`} className="nav-link" >Dashboard</NavLink></li>
                            </ul>
                            </li>
                           
                        </> : <>
                        <li className="nav-item">
                            <NavLink to='/register' className="nav-link">Register</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to='/login' className="nav-link" >Login</NavLink>
                        </li>
                        </>}
                        
                        <li className="nav-item mt-1">
                        <Badge count={cart.length} showZero>
                        <NavLink to='/cart' className="nav-link" >Cart</NavLink>
                        </Badge>
                        </li>
                    </ul>
                   
                </div>
            </div>
        </nav>
          </>
}
export default Header