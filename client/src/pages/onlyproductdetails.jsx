import axios from "axios"
import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import Spinner from "../spinner"
import { useContext } from "react"
import  createContext  from "../contextvar.js"
import '../index.css'
import Layout from "../components/layout/layout"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function OnlyProductDetails(){
const [product,setproduct]=useState('');
const [spin,setspin]=useState(true);
const {cart,setcart}=useContext(createContext)
const {id,catid}=useParams()
const [similarproducts,setsimilarproducts]=useState('');
const [category,setcategory]=useState('');
const navigate=useNavigate()

//get product
const get=async ()=>{
          const res=await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/product_detail/${id}`,)
           if(res.data.success && res.status===200){
          setproduct(res.data.product);
                    setspin(false);
           }
}

//get similar products
const similar=async ()=>{
          const res=await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/productsByFilter`,{category:[catid],n_id:id})
           if(res.data.success && res.status===200){
          setsimilarproducts(res.data.products);
                    setspin(false);
           }  
}

//get category name
const catname=async ()=>{
          const res=await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/category_detail/${catid}`)
           if(res.data.success && res.status===200){
          setcategory(res.data.category);
           }  
}

useEffect(()=>{
catname()     
 get()
similar()
},[id,catid])


          return <>
          <Layout>
          {spin && <Spinner/>}
         {!spin && <>
          <div className="row container m-2">
          <div className="col-md-6 text-center border">
          <img src={product.avatar?.secure_url} className="card-img-top w-50 " alt="no photo" />
          </div>
          <div className="col-md-6 ">
         <h1 className="m-3 border-bottom w-50"> Product Details</h1>
         <h5>Name: {product.name}</h5>
         <h5>description: {product.description}</h5>
         <h5>price: {product.price}</h5>
         <h5>category: {category.name}</h5>
         <h5>shipping: {product.shipping?'yes':'no'}</h5>
         <button className="btn btn-secondary" onClick={()=>{setcart([...cart,product]); toast.success('added to cart');localStorage.setItem('cart',JSON.stringify([...cart,el]))}}>add to cart</button>
          </div>
         </div>
         <div className="row mt-5 ms-3 border-bottom ">{similarproducts.length?'Similar Products':'No Similar Products'}</div>
         <div className="d-flex flex-wrap align-items-start justify-content-center">
                  {similarproducts && similarproducts.map((el)=>
               
                   <div key={el._id} className="card m-2 " style={{ width: '18rem' }}>
                   <img src={el.avatar?.secure_url} className="card-img-top product-image" alt="no photo" />
                   <div className="card-body">
                   <h1 className="card-text fs-3">{el.name}</h1>
                   <p className="card-text fs-5">{el.description}</p>
                   <p className="card-text fs-5">{`$${el.price}`}</p>
                   <button className="btn btn-primary m-1" onClick={()=>{navigate(`/only_product_detail/${el._id}/${el.category}`)}}>more details</button>
                   <button className="btn btn-secondary"  onClick={()=>{setcart([...cart,el]); toast.success('added to cart');localStorage.setItem('cart',JSON.stringify([...cart,el]))}}>add to cart</button>
                   </div>
                   </div>
                
                   )}
                </div>
         </>
         }
          </Layout>
         
          </>
}
export default OnlyProductDetails