import { useEffect, useState } from 'react'
import './index.css'
import { Navigate, useNavigate, useLocation } from 'react-router-dom';

function Spinner({path='/login', duration=10}){
          let [count,setcount]=useState(duration)
          let navigate=useNavigate()
          const location=useLocation();
          useEffect(()=>{
          const interval=setInterval(() => {
                 setcount((prevval)=>--prevval)   
          }, 1000);
          if(count==0){
                    navigate(`${path}`,{
                              state:location.pathname
                    })
          }
          return ()=>clearInterval(interval);
          },[count,navigate,location])  //include all statevar for good practice..

          return <>
          <div className="spinner">
                    <h1>redirecting to you in {count} </h1>
          <div className=" spinner-border text-warning" role="status">
         <span className="visually-hidden">Loading...</span>
          </div>
          </div>
          </>
}

export default Spinner