import { useState } from "react"
import Layout from "../components/layout/layout"
import '../index.css'
import axios from "axios"
import Spinner from "../spinner"
import {  useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
function Forgot_pass(){
  const [spin,setspin]=useState(false);
  const [email,setemail]=useState('')
  const navigate=useNavigate();
          let handlesubmit=async (el)=>{
            el.preventDefault();  
            setspin(true);
            try{
              let res=await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/forgot_password`,{email:email});
              if(res.data.success && res.status===200){
                setspin(false);
                toast.success('email sent successfully')
                navigate('/email_verify')
              }
            }
            catch(err){
              setspin(false);
              toast.error(`${err.response.data.message}`)
            }


          }
         
          return <>
          <Layout>
            {!spin &&
             <div className="forgot_pass">
             <h1>forgot_pass page</h1>
             <form onSubmit={handlesubmit}>
<div className="mb-3">
 <input type="email" className="form-control" id="exampleInputemail" placeholder="email.."  value={email} onChange={(el)=>{setemail(el.target.value)}} required/>
</div>
<button type="submit"  className="btn btn-primary m-3">submit</button>
</form>
   </div>
            }
            {spin && <Spinner/>}
         
          </Layout>
          </>
}
export default Forgot_pass