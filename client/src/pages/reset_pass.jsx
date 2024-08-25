import { useState } from "react"
import Layout from "../components/layout/layout"
import Spinner from "../spinner"
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../index.css'
function Reset_pass(){
let [spin,setspin]=useState(false);
let {id}=useParams();
let navigate=useNavigate();
let [password,setpassword]=useState('');
let [confirmpassword,setconfirmpassword]=useState('');
let handlesubmit=async (el)=>{
          el.preventDefault();  
          setspin(true);
          if(password !== confirmpassword){
                    setspin(false);
                    toast.error('both fields should match');
          }
          try{
            let res=await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/reset_password/${id}`,{password:password});
            if(res.data.success && res.status===200){
              setspin(false);
              toast.success('password changed successfully')
              navigate('/login')
            }
          }
          catch(err){
            setspin(false);
            toast.error(`${err}`)
          }


        }
       
          return <>
          <Layout>
          {!spin &&
             <div className="reset_pass">
             <h1>reset_pass page</h1>
             <form onSubmit={handlesubmit}>
<div className="mb-3">
 <input type="text" className="form-control" id="exampleInputpassword" placeholder="password.."  value={password} onChange={(el)=>{setpassword(el.target.value)}} required/>
</div>
<div className="mb-3">
 <input type="text" className="form-control" id="exampleInputpasswordd" placeholder="confirm password.."  value={confirmpassword} onChange={(el)=>{setconfirmpassword(el.target.value)}} required/>
</div>
<button type="submit" className="btn btn-primary m-3">submit</button>
</form>
   </div>
            }
            {spin && <Spinner/>}
          </Layout>
          </>
}
export default Reset_pass