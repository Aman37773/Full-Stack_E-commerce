import { useState,useEffect } from "react"
import Adminmenu from "../../components/layout/adminmenu"
import Layout from "../../components/layout/layout"
import  createContext  from "../../contextvar.js";
import { useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import '../../index.css'

function Product(){
          const [products,setproducts]=useState('');
          const {auth,setauth}=useContext(createContext);
          const getproducts=async ()=>{
                              try{
                                const res=await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/products`,{
                                  headers:{'Authorization': `Bearer ${auth?.token}`}
                                })
                                if(res.data.success && res.status===200){
                                  setproducts(res.data?.products);
                                }
                              }
                              catch(err){
                                toast.error(`something went wrong : ${err.message}`)
                              }
          }
          useEffect(()=>{
                   auth?.token && getproducts();
                },[auth?.token])

          return<>
          <Layout>
          <div>
           <div className="row">
             <div className="col-md-3">
                   <Adminmenu/> 
             </div>

              <div className="col-md-9">
               <h1 className="text-center">all products</h1>
                <div className="d-flex flex-wrap ">
                  {products && products.map((el)=>
                  <Link key={el._id} to={`/dashboard/admin/product_detail/${el._id}`} className="product-link">
                   <div className="card m-3" style={{ width: '18rem' }}>
                   <img src={el.avatar?.secure_url} className="card-img-top product-image" alt="no photo" />
                   <div className="card-body">
                   <h1 className="card-text fs-3">{el.name}</h1>
                   <p className="card-text fs-5">{el.description}</p>
                   </div>
                   </div>
                  </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          </Layout>
          </>
}
export default Product