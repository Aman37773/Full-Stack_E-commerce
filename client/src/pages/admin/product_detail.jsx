import { useState,useEffect } from "react"
import Adminmenu from "../../components/layout/adminmenu"
import Layout from "../../components/layout/layout"
import axios from "axios";
import { toast } from "react-toastify";
import  createContext from "../../contextvar.js";
import { useContext } from "react";
import {Select} from 'antd'
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../spinner";
const {Option}=Select


function Product_detail(){
  const {auth,setauth}=useContext(createContext)
  const [name,setname]=useState('');
  const [description,setdescription]=useState('');
  const [price,setprice]=useState('');
  const [category,setcategory]=useState([]);
  const [categories,setcategories]=useState([]);
  const [quantity,setquantity]=useState('');
  const [shipping,setshipping]=useState(false);
  const [image,setimage]=useState('');
  const navigate=useNavigate();
  const [spin,setspin]=useState(false);
  const {id} =useParams();
  const [url,seturl]=useState('')

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
    toast.error(`something went wrong for categories: ${err.message}`)
  }
}

useEffect(()=>{
  auth?.token && getallcategories();
},[auth?.token])




  const productdetail=async ()=>{
          
    try{
      const res=await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/product_detail/${id}`,{
        headers:{'Authorization': `Bearer ${auth?.token}`}
      })
      if(res.data.success && res.status===200){
       setname(res.data.product.name)
       setdescription(res.data.product.description)
       setprice(res.data.product.price)
       setquantity(res.data.product.quantity)
       setcategory(res.data.product.category)
        setshipping(res.data.product.shipping)
        seturl(res.data.product.avatar.secure_url)
      }
    }
    catch(err){
      toast.error(`something went wrong : ${err.message}`)
    }
  }
  useEffect(()=>{
    auth?.token &&  productdetail();
},[auth?.token])
  //clicking on label clicks the child element...
  //if chid has a prop named value then that value is used by parent as el of onclick but for input, value means what to display at box...


  //create product function
  const handleupdate=async(el)=>{
    //el.preventDefault();
    setspin(true)
    try{
      const productdata= new FormData();
     productdata.append('name',name)
     productdata.append('description',description)
     productdata.append('quantity',quantity)
     image && productdata.append('avatar',image)
     productdata.append('price',price)
     productdata.append('shipping',shipping)
     productdata.append('category',category)
     
      const res=await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/update_product/${id}`,productdata,{
        headers:{'Authorization': `Bearer ${auth?.token}`}
      })
      if(res.data.success && res.status===200){
       toast.success('updated product successfully')
       navigate('/dashboard/admin/products')
       setspin(false);
      }
    }
    catch(err){
      toast.error(`something went wrong : ${err.message}`)
      setspin(false)
    }
  }


  //handledelete
const handledelete=async ()=>{
  try{
    let answer=window.prompt('are you sure you want to delete')
    if(!answer){
      return
    }
setspin(true);
const res=await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/remove_product/${id}`,{
  headers:{'Authorization':`Bearer ${auth?.token}`}
})

if(res.data.success && res.status===200){
  toast.success('deleted product successfully')
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
          <Layout title='dashboard-update-product'>
            {!spin &&
             <div className="row">
             <div className="col-md-3">
             <Adminmenu/>
            </div>  
            <div className="col-md-6">
              <h1>update product</h1> 
              
              <div className="m-1">
                    {shipping && <div>{shipping}</div>}
                <Select style={{ border: 'none' , height:'3.5vw'}} placeholder='select a category...' size="large" showSearch   className="form-select mb-3" value={category}  onChange={(el)=>{setcategory(el)}}>
                  {categories.map((el)=>(
                      <Option key={el._id} value={el._id}>{el.name}</Option>  //............how adding value acting as a filter for search and for select value is category(id type) then why still name is coming how...............................
                  ))}
                </Select>

                <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">  
                  {image? image.name : 'upload image'}
                  <input type="file" name="photo" accept="image/*" onChange={(el)=>{setimage(el.target.files[0])}} hidden />
                </label>
                </div>
                <div className="mb-3 text-center">
                  <img src={image? URL.createObjectURL(image):`${url}`} alt="product-photo" height={'200px'} className="img img-responsive"/>
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
                    <Select style={{ border: 'none' , height:'3.5vw'}} placeholder='select shipping...' value={shipping? 'yess': 'no'}  size="large" showSearch  className="form-select mb-3" onChange={(el)=>{setshipping(el)}}>
                      <Option value={true}>yes</Option>  
                      <Option value={false}>no</Option>
                    </Select>
                    </div>

                    <div className="mb-3">
                      <button className="btn btn-primary m-2" onClick={()=>handleupdate()}> UPDATE PRODUCT</button>
                      <button className="btn btn-danger" onClick={()=>handledelete()}> DELETE</button>
                    </div>

              </div>
            </div>
          </div>
            }
         {spin && <Spinner duration={15}/>}
          </Layout>
          </>
}
export default Product_detail