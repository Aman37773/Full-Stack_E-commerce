import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import axios from "axios";
import { useContext } from "react";
import  createContext  from "../contextvar.js";
import Spinner from "../spinner.jsx";

import '../index.css'

function Dashboard_middleware(){
const [ok,setok]=useState(false);
const {auth,setauth}=useContext(createContext)
const navigate=useNavigate();
          useEffect(()=>{
                    const check=async ()=>{
                              const res=await  axios.get(`${import.meta.env.VITE_BACKEND_API}/api/userprofile`,{
                                        headers:{'Authorization':`Bearer ${auth?.token}`}
                              })
                              if(res.data.success && res.status===200){

                                        setok(true);
                              }
                              else{


                              }
                    }
                   if(auth.token){
                    check();
                   }
          },[auth.token,navigate])   //why we need to include specifically while accessing dashboard directly through url..

          return <>
          {ok? <Outlet/>:<Spinner/>}
          </>
}
export default Dashboard_middleware