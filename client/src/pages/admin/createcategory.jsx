import Adminmenu from "../../components/layout/adminmenu.jsx"
import Layout from "../../components/layout/layout"
import axios from "axios";
import { toast } from "react-toastify";
import  createContext  from "../../contextvar.js";
import { useState,useEffect } from "react";
import { useContext } from "react";
import {Modal} from 'antd'
import Categoryform from "../../components/layout/form/categoryform.jsx";

function CreateCategory(){
  const [visible,setvisible]=useState(false);
  const {auth,setauth}=useContext(createContext);
  const [name,setname]=useState('');
  const [updatedname,setupdatedname]=useState('');
  const [selected,setselected]=useState(null);

  const handlesubmit=async (el)=>{
    el.preventDefault(); 
  try{
    const res=await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/create_category`,{name},{
      headers:{'Authorization': `Bearer ${auth?.token}`}
    })
    if(res.data.success && res.status===200){
      getallcategories()
      toast.success('added category successfully')
    }
  }
  catch(err){
    toast.error(`something went wrong ${err.message}`)
  }
  }
          const [categories,setcategory]=useState([]);
          
          //get all categories
            const getallcategories=async ()=>{
              try{
                const res=await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/categories`,{
                  headers:{'Authorization': `Bearer ${auth?.token}`}
                })
                if(res.data.success && res.status===200){
                  setcategory(res.data?.categories);
                }
              }
              catch(err){
                toast.error(`something went wrong : ${err.message}`)
              }
            }
            
            useEffect(()=>{
              auth?.token && getallcategories();
          },[auth?.token])
         
         //update category
         const handleupdate=async (el)=>{
          el.preventDefault(); 
          try{
            const res=await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/update_category/${selected._id}`,{name:updatedname},{
              headers:{'Authorization': `Bearer ${auth?.token}`}
            })
            if(res.data.success && res.status===200){
              setselected(null);
              setupdatedname('');
              setvisible(false);
              getallcategories()
              toast.success('updated category successfully')
            }
          }
          catch(err){
            toast.error(`something went wrong ${err.message}`)
          }
         }

         //delete category
         const handledelete=async (id)=>{
          try{
            const res=await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/remove_category/${id}`,{
              headers:{'Authorization': `Bearer ${auth?.token}`}
            })
            if(res.data.success && res.status===200){
              getallcategories()
              toast.success('deleted category successfully')
            }
          }
          catch(err){
            toast.error(`something went wrong ${err.message}`)
          }
         }

          return <>
          <Layout title='dashboard-create-category'>
          <div className="row">
             <div className="col-md-3">
             <Adminmenu/>
            </div>  
            <div className="col-md-9">
              <h1>MANAGE CATEGORY</h1> 
              <div>
                <div className="p-3">
                  <Categoryform value={name} setvalue={setname} handlesubmit={handlesubmit}/>
                </div>
              <table className="table fs-5 m-3">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
      {categories.map((el)=> 
        <tr key={el._id}>
        <td >{el.name}</td>
      <td>
        <button className="btn btn-primary m-2" onClick={()=>{setvisible(true); setupdatedname(el.name); setselected(el)}}>edit</button>
        <button className="btn btn-danger m-2" onClick={()=>{ handledelete(el._id)}}>delete</button>
        </td>
        </tr>
       )}
      </tbody>
    </table>
              </div>
          <Modal onCancel={()=>setvisible(false)} footer={null} open={visible}>
            <Categoryform value={updatedname} setvalue={setupdatedname} handlesubmit={handleupdate} />
          </Modal>
            </div>
          </div>
          </Layout>
          </>
}
export default CreateCategory