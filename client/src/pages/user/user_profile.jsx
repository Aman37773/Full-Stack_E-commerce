import Layout from "../../components/layout/layout";
import Usermenu from "../../components/layout/usermenu";
import { useState,useEffect, useContext } from "react";
import  createContext  from "../../contextvar.js";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from "../../spinner";

function User_profile(){
  const {auth,setauth}=useContext(createContext)
  const [fullname,setname]=useState('');
const [address,setaddress]=useState('');
const [phone,setphone]=useState('');
const [password,setpassword]=useState('');
const [oldpass,setoldpass]=useState('');
const [file,setfile]=useState('');
const [spin,setspin]=useState(false)

useEffect(()=>{
setname(auth.user.fullname);
setphone(auth.user.phone)
setaddress(auth.user.address)
},[auth?.token])

const handlesubmit= async (event)=>{
  event.preventDefault();
try{
  setspin(true);
  const formData = new FormData();
        formData.append("fullname", fullname);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("avatar", file);

  const res= await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/update_profile`,formData,{
    headers:{'Authorization':` Bearer ${auth?.token}`}
  })
  if(res.status===200 && res.data?.success){
    toast.success('updated profile')
    setauth({...auth,user:res.data.userinfo,token:res.data.token})
    localStorage.setItem('auth',JSON.stringify(res.data,null,4))  
    setspin(false)
  }
}
catch(err){
  setspin(false)
toast.err(`something went wrong: ${err.message}`)
}
}


//reset pass
const handleresetpass=async (event)=>{
  setspin(true);
  event.preventDefault();
  try{
    const res= await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/change_password`,{oldpassword:oldpass,newpassword:password},{
      headers:{'Authorization':` Bearer ${auth?.token}`}
    })
    if(res.status===200 & res.data.success){
      toast.success('password changed')
      setpassword('')
      setoldpass('')
      setspin(false)
    }
  }
  catch(err){
    setspin(false)
    toast.error(`something went wrong: ${err.response.data.message}`)
  }
}
          return <>
          <Layout title='dashboard-user_profile'>
          <div className="container-fluid">
             <div className="row">
               <div className="col-md-3">
                     <Usermenu/>
                </div>
                {!spin && 
                 <div className="col-md-9 mt-3 ">
                  <div className="row">
                    <div className="col-md-7">
                    <div className="card w-60 p-3 m-2">
                 
                 <h1 className="fs-3 text-center mb-3">User Profile</h1>
                 <form onSubmit={handlesubmit}>
   <div className="mb-3 fs-5 ">
   Name<input type="text" className="form-control" id="exampleInputname" aria-describedby="emailHelp" placeholder="name.." value={fullname} onChange={(el)=>{setname(el.target.value)}} required/> 
   </div>
   <div className="mb-3 fs-5">
   Phone  <input type="text" className="form-control" id="exampleInputphone" placeholder="phone no.."  value={phone} onChange={(el)=>{setphone(el.target.value)}} required/>
   </div>
   <div className="mb-3 fs-5">
    Address <input type="text" className="form-control" id="exampleInputaddress" placeholder="address.."   value={address} onChange={(el)=>{setaddress(el.target.value)}}  required/>
   </div>
   <div className="mb-3 fs-5">
   Avatar  <input type="file" className="form-control" id="exampleInputfile" placeholder="file.."    onChange={(el)=>{setfile(el.target.files[0])}}  />
   </div>
   <button type="submit" className="btn btn-primary">update</button>
 </form>
       </div>
                    </div>



                    <div className="col-md-5">
                    <div className="card w-30 p-3">
                 
                 <h1 className="fs-3 text-center mb-3">Change Password</h1>
                 <form onSubmit={handleresetpass}>
   
   <div className="mb-3 fs-5">
    Old Password <input type="text" className="form-control" id="exampleInputpassword" placeholder="old password.."   value={oldpass} onChange={(el)=>{setoldpass(el.target.value)}}  required/>
   </div>
   <div className="mb-3 fs-5">
   New Password  <input type="text" className="form-control" id="exampleInputpassword" placeholder="new password.."   value={password} onChange={(el)=>{setpassword(el.target.value)}}  required/>
   </div>
   <button type="submit" className="btn btn-primary">Reset Password</button>
 </form>
       </div>
                    </div>

                  </div>

                
    


     
        </div>

        
        
                }
                {spin && <Spinner duration={15}/>}
               
                </div>
               </div>
          
          </Layout>
          </>
}
export default User_profile
