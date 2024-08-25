import Layout from "../components/layout/layout"
import  {useContext, useState } from "react"
import {toast} from 'react-toastify'  //we use apperror in backend and toast in frontend
import '../index.css'
import { Navigate, json, useNavigate, useLocation } from "react-router-dom"
import '../index.css'
import Cookies from "js-cookie"
import  createContext  from "../contextvar.js"
//  import dotenv from 'dotenv'  no need of dotenv to be installed in react
//  dotenv.config();
import Spinner from "../spinner"
 import axios from "axios"
function Login(){
const [email,setemail]=useState('');
const [password,setpassword]=useState('');
const {auth,setauth}=useContext(createContext)
const [spin,setspin]=useState(false)
const navigate=useNavigate();
const location=useLocation();
//handlesubmit
const handlesubmit=async (el)=>{
        el.preventDefault();         //this helps to prevent site reload during form-submission
        try{
          //in .env file, we should prefix variable name with VITE and instead of process.env write import.meta.env
          setspin(true)
          const res=  await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/login`,{email,password})  //if error code 400 comes then it moves to catch block without moving furthur..
          if(res.data.success && res.status===200){
                    setauth({...auth,user:res.data.userinfo,token:res.data.token})
                    localStorage.setItem('auth',JSON.stringify(res.data,null,4))   //localstorage supports data in string format so doing json.stringify...
                    navigate(location.state||'/');
             toast.success('login successfully')
             setspin(false)
          }
       }
    catch(err){
          console.log(err.message)
          toast.error(`${err.response.data.message}`)
          setspin(false)
    }
}
          return<>
          <Layout title={"login Ecommerce-app"}>
            {
              !spin &&
              <div className="login" >
                    <h1>login Page</h1>
                    <form onSubmit={handlesubmit}>
      <div className="mb-3">
        <input type="email" className="form-control" id="exampleInputemail" placeholder="email.."  value={email} onChange={(el)=>{setemail(el.target.value)}} required/>
      </div>
      <div className="mb-3">
        <input type="text" className="form-control" id="exampleInputpassword" placeholder="password.."  value={password} onChange={(el)=>{setpassword(el.target.value)}} required/>
      </div>
      <button type="text" onClick={()=>navigate('/forgot_pass')} className="btn btn-primary m-3">forgot-password</button>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
          </div>
            }
            {spin && <Spinner/>}
          
          </Layout>
          </>
}

export default Login