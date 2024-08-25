import { useState,useEffect } from "react";
import axios from "axios";
 function getcategories(){
          const [categories,setcategories]=useState('');

          const get=async ()=>{
                    try{
                    const res=await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/categories`)
                     if(res.data.success && res.status===200){
                      setcategories(res.data?.categories);
                    }
                    }
                    catch(err){
                     toast.error(`something went wrong : ${err.message}`)
                    }
          }
          useEffect(()=>{
          get()
          },[])
         
            return categories
      }

      export default getcategories;