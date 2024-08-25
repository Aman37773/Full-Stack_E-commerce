
import Adminmenu from "../../components/layout/adminmenu"
import Layout from "../../components/layout/layout"
import OrdersChart from "../charrt";
import { useEffect, useState } from "react";
import  createContext  from "../../contextvar.js";
import { useContext } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import Spinner from "../../spinner";

function Users(){
  const {auth,setauth}=useContext(createContext)
  const [spin,setspin]=useState(true)
  const [chartData, setChartData] = useState({
    labels: ["today", "Yesterday", "Before Yesterday"],
    orders:  []
});
const [users,settotusers]=useState('')


const getData=async()=>{
try{
  setspin(true)
  const res=await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/totUsers`, { 
    headers: { Authorization: `Bearer ${auth?.token}` } 
  })

  if(res.status===200 && res.data.success){
    setChartData({...chartData,orders:[...res.data.count]});
    settotusers(res.data.totusers)
    setspin(false)
  }
}
catch(err){
  console.log(err.message)
  setspin(false)
 toast.error('something wrong: ',err.message)
}
}

useEffect(()=>{
getData();
},[auth?.token])


          return <>
          <Layout title='dashboard-users'>
          
              <div className="row">
              <div className="col-md-3">
              <Adminmenu/>
             </div>  
             {!spin?
             <div className="col-md-9">
             <div className="App">
             <h1 className="text-center m-3 fs-3">Users Per Day</h1>
             <OrdersChart data={chartData} />
             </div>
             <div className="fs-4 mt-3">Total Users till date: {users?users:'0'}</div>
 
             </div>
             : <Spinner/>}
           </div>
 
            
           
        
          

          </Layout>
          </>
}
export default Users