
import { useState,useEffect } from "react"
import Adminmenu from "../../components/layout/adminmenu"
import Layout from "../../components/layout/layout"
import axios from "axios";
import { toast } from "react-toastify";
import  createContext from "../../contextvar.js";
import { useContext } from "react";
import {Select} from 'antd'
import { useNavigate } from "react-router-dom";
import Spinner from "../../spinner";
const {Option}=Select

function CreateProduct(){
  const {auth,setauth}=useContext(createContext)
  const [name,setname]=useState('');
  const [description,setdescription]=useState('');
  const [price,setprice]=useState('');
  const [category,setcategory]=useState([]);
  const [categories,setcategories]=useState([]);
  const [quantity,setquantity]=useState('');
  const [shipping,setshipping]=useState('');
  const [image,setimage]=useState('');
  const navigate=useNavigate();
  const [spin,setspin]=useState(false);

//get categories
  const getallcategories=async ()=>{
    try{
      const res=await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/categories`,{
        headers:{'Authorization': `Bearer ${auth?.token}`}
      })
      if(res.data.success && res.status===200){
        setcategories(res.data?.categories);
      }
    }
    catch(err){
      toast.error(`something went wrong : ${err.message}`)
    }
  }
  useEffect(()=>{
    auth?.token && getallcategories();
},[auth?.token])
  //clicking on label clicks the child element...
  //if chid has a prop named value then that value is used by parent as el of onclick but for input, value means what to display at box...


  //create product function
  const handlesubmit=async(el)=>{
    //el.preventDefault();
    setspin(true)
    try{
      const productdata= new FormData();
     productdata.append('name',name)
     productdata.append('description',description)
     productdata.append('quantity',quantity)
     productdata.append('avatar',image)
     productdata.append('price',price)
     productdata.append('shipping',shipping)
     productdata.append('category',category)
      const res=await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/create_product`,productdata,{
        headers:{'Authorization': `Bearer ${auth?.token}`}
      })
      if(res.data.success && res.status===200){
       toast.success('created product successfully')
       navigate('/dashboard/admin/products')
       setspin(false);
      }
    }
    catch(err){
      toast.error(`something went wrong : ${err.message}`)
      setspin(false)
    }
  }
          return <>
          <Layout title='dashboard-create-product'>
            {!spin &&
             <div className="row">
             <div className="col-md-3">
             <Adminmenu/>
            </div>  
            <div className="col-md-6">
              <h1>create product</h1> 
              
              <div className="m-1">

                <Select style={{ border: 'none' , height:'3.5vw'}} placeholder='select a category...' size="large" showSearch  className="form-select mb-3" onChange={(el)=>{setcategory(el)}}>
                  {categories.map((el)=>(
                      <Option key={el._id} value={el._id}>{el.name}</Option>  //............how adding value acting as a filter for search...............................
                  ))}
                </Select>

                <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">  
                  {image? image.name : 'upload image'}
                  <input type="file" name="photo" accept="image/*" onChange={(el)=>{setimage(el.target.files[0])}} hidden />
                </label>
                </div>
                <div className="mb-3 text-center">
                  {image && <img src={URL.createObjectURL(image)} alt="product-photo" height={'200px'} className="img img-responsive"/>}
                </div>

                    <div className="mb-3">
                    <input type="text" value={name} placeholder="write name.." className="form-control" onChange={(el)=>{setname(el.target.value)}}/>
                    </div>

                    <div className="mb-3">
                    <textarea type="text" value={description} placeholder="write description.." className="form-control" onChange={(el)=>{setdescription(el.target.value)}}/>
                    </div>

                    <div className="mb-3">
                    <input type="number" value={price} placeholder="write price.." className="form-control" onChange={(el)=>{setprice(el.target.value)}}/>
                    </div>

                    <div className="mb-3">
                    <input type="number" value={quantity} placeholder="write quantity.." className="form-control" onChange={(el)=>{setquantity(el.target.value)}}/>
                    </div>

                    <div className="mb-3">
                    <Select style={{ border: 'none' , height:'3.5vw'}} placeholder='select shipping...' size="large" showSearch  className="form-select mb-3" onChange={(el)=>{setshipping(el)}}>
                      <Option value={1}>yes</Option>  
                      <Option value={0}>no</Option>
                    </Select>
                    </div>

                    <div className="mb-3">
                      <button className="btn btn-primary" onClick={()=>handlesubmit()}>CREATE PRODUCT</button>
                    </div>

              </div>
            </div>
          </div>
            }
         {spin && <Spinner duration={15}/>}
          </Layout>
          </>
}
export default CreateProduct