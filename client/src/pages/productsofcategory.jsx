import { useParams } from "react-router-dom"
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../spinner";
import { useContext, useEffect, useState } from "react";
import  createContext  from "../contextvar.js";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/layout";
function Productsofcategory(){
          let {id}=useParams();
          //console.log(id)
          const [offset,setoffset]=useState(0);
          const [limit,setlimit]=useState(3)
          const [products,setproducts]=useState('')
          const [butt,setbutt]=useState(true)
          const [spin,setspin]=useState(false);
          const {cart,setcart}=useContext(createContext)
          const navigate=useNavigate()

           //get all products
          const get= async ()=>{
                    try{
                              setspin(true);
                    const res=await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/productsofcategory`,{offset:offset,limit:limit,category:id})
                    if(res.data?.success && res.status===200){
                      setspin(false);
                      if(offset==0){
                        setproducts([...res.data.products])
                      }
                      else{
                        setproducts([...products,...res.data.products])
                      }
                              setoffset(offset+limit)
                              if(res.data.totalcount==0){
                                setbutt(false)
                              }
                    }
                    }
                    catch(err){
                    toast.error(`something went wrong:${err.message}`)
                    setspin(false)
                    }
                    
          }

useEffect(()=>{
setoffset(0);   //sometimes usestate variables takes so much time to reset where ?(also &&) condition may expire so use another useeffect..
setproducts('');
setbutt(true);
},[id])

useEffect(()=>{
offset==0 && get()
},[offset])

          return (
          <Layout>
          {!spin && 
             <div className="row mt-3"> 
               <div className="col-md-9">
                <h1 className="text-center fs-3 mt-5"> {(products && products.length) ?`All Products`:'No Product Available'}</h1>
                <div className="d-flex flex-wrap align-items-start justify-content-center">
                  {products && products.map((el)=>
               
                   <div key={el._id} className="card m-2 " style={{ width: '18rem' }}>
                   <img src={el.avatar?.secure_url} className="card-img-top product-image" alt="no photo" />
                   <div className="card-body">
                   <h1 className="card-text fs-3">{el.name}</h1>
                   <p className="card-text fs-5">{el.description}</p>
                   <p className="card-text fs-5">{`$${el.price}`}</p>
                   <button className="btn btn-primary m-1" onClick={()=>{navigate(`/only_product_detail/${el._id}/${el.category}`)}}>more details</button>
                   <button className="btn btn-secondary"  onClick={()=>{setcart([...cart,el]); toast.success('added to cart'); localStorage.setItem('cart',JSON.stringify([...cart,el]))}}>add to cart</button>
                   </div>
                   </div>
                
                   )}
                </div>
                <div className="d-flex align-items-start justify-content-center m-3">
                { butt && <button onClick={()=>{get()}} className="fs-5 btn btn-warning">Load More..</button> }
                </div>
               
               </div>
  
            </div>  
            }
            {spin && <Spinner/>}
          </Layout>
          )
}

export default Productsofcategory