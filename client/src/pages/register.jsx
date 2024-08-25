import Layout from "../components/layout/layout"
import { useState } from "react"
import {toast} from 'react-toastify'  //we use apperror in backend and toast in frontend
import '../index.css'
import  createContext  from "../contextvar.js"
import { useContext } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import Spinner from "../spinner"
 import '../index.css'
//  import dotenv from 'dotenv'  no need of dotenv to be installed in react
//  dotenv.config();
 import axios from "axios"
 

function Register(){
  const [spin,setspin]=useState(false)
const [fullname,setname]=useState('');
const [email,setemail]=useState('');
const [password,setpassword]=useState('');
const [address,setaddress]=useState('');
const [phone,setphone]=useState('');
const [file,setfile]=useState('');
const navigate=useNavigate();
const {auth,setauth}=useContext(createContext)
//handlesubmit
const handlesubmit=async (el)=>{
        el.preventDefault();         //this helps to prevent site reload during form-submission
        const formData = new FormData();
        formData.append("fullname", fullname);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("address", address);
        formData.append("phone", phone);
        formData.append("avatar", file);
        try{
          //in .env file, we should prefix variable name with VITE and instead of process.env write import.meta.env
          setspin(true);
          const res=  await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/register`,formData)
          if(res.data.success && res.status===200){
            setauth({...auth,user:res.data.userinfo,token:res.data.token})
            localStorage.setItem('auth',JSON.stringify(res.data,null,4))   //localstorage supports data in string format so doing json.stringify...
            navigate('/');
             toast.success('registered successfully')
             setspin(false)
          }
        }
    catch(err){
          console.log(err.message)
          toast.error(`${err.response.data.message}`)
    }
}
          return<>
          <Layout title={"register Ecommerce-app"}>
            {!spin && 
              <div className="register">
                    <h1>Register Page</h1>
                    <form onSubmit={handlesubmit}>
      <div className="mb-3">
        <input type="text" className="form-control" id="exampleInputname" aria-describedby="emailHelp" placeholder="name.." value={fullname} onChange={(el)=>{setname(el.target.value)}} required/>
      </div>
      <div className="mb-3">
        <input type="email" className="form-control" id="exampleInputemail" placeholder="email.."  value={email} onChange={(el)=>{setemail(el.target.value)}} required/>
      </div>
      <div className="mb-3">
        <input type="text" className="form-control" id="exampleInputpassword" placeholder="password.."  value={password} onChange={(el)=>{setpassword(el.target.value)}} required/>
      </div>
      <div className="mb-3">
        <input type="text" className="form-control" id="exampleInputphone" placeholder="phone no.."  value={phone} onChange={(el)=>{setphone(el.target.value)}} required/>
      </div>
      <div className="mb-3">
        <input type="text" className="form-control" id="exampleInputaddress" placeholder="address.."   value={address} onChange={(el)=>{setaddress(el.target.value)}}  required/>
      </div>
      <div className="mb-3">
        <input type="file" className="form-control" id="exampleInputfile" placeholder="file.."    onChange={(el)=>{setfile(el.target.files[0])}}  required/>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
          </div>
            }
            {spin && <Spinner duration={15}/>}
          
          </Layout>
          </>
}

export default Register