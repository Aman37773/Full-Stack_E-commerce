import { useContext, useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import  createContext  from "../contextvar.js";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from "../spinner";
import { Link, json } from "react-router-dom";
import {Checkbox,Radio} from 'antd'  //antd provides some additional functionalities for layout like checkbox,dropdown,options etc..
import prices from "../components/layout/pricefilter";
import debounce from "./debounce";
import { useNavigate } from "react-router-dom";

function Homepage(){
          //<pre>{JSON.stringify(auth,null,4)}</pre>    
          //pre tag preserves format of data
          //using json.stringify because vite(also react) does not support object type data to be transfered as children.. 
          const {auth,setauth}=useContext(createContext);
          const {cart,setcart}=useContext(createContext)
          const [products,setproducts]=useState('')
          const [categories,setcategories]=useState([])
          const [spin,setspin]=useState(true)
          const [checked,setchecked]=useState([])
          const [PriceChecked,setPriceChecked]=useState([])
          const [offset,setoffset]=useState(0);
          const [limit,setlimit]=useState(3)
          const [butt,setbutt]=useState(true)
          const [search,setsearch]=useState('')
          const navigate=useNavigate()


           //get all categories
           const getallcategories=async ()=>{
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


          //get all products
          const getallproducts=async()=>{
            setspin(true);
          try{
          const res=await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/limitproducts`,{offset:offset,limit:limit})
          if(res.data.success && res.status===200){
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


          //filter products
          //get all products
          const filterproducts=async()=>{
            try{
            const res=await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/productsByFilter`,{category:checked,price:PriceChecked})
            if(res.data.success && res.status===200){
                   setspin(false);
                  setproducts(res.data.products)
                  setoffset(0)
                  setbutt(true)
            }
            }
            catch(err){
            toast.error(`something went wrong:${err.message}`)
            setspin(false)
            }
            }


             //search products
          const searchproducts=async()=>{
            try{
            const res=await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/searchproducts`,{keyword:search})
            if(res.data.success && res.status===200){
                   setspin(false);
                  setproducts(res.data.products)
                  setoffset(0)
            }
            }
            catch(err){
            toast.error(`something went wrong:${err.message}`)
            setspin(false)
            }
            }


          useEffect(()=>{
           if(!checked.length && !PriceChecked.length ){
            getallcategories()
            getallproducts()
           }
           else if(checked.length || PriceChecked.length){
            filterproducts()
           }
           else{
            setspin(true);
           }
          },[checked,PriceChecked])


          useEffect(()=>{
            if(search.length==0){
              if(!checked.length && !PriceChecked.length ){
                getallcategories()
                getallproducts()
               }
               else if( checked.length || PriceChecked.length){
                filterproducts()
               }
            }
            else{
             searchproducts();
            }
          },[search])

         



          //handlechecked
          const handlechecked=(value,id)=>{
            let all=[...checked];
            if(value){
                  all.push(id)
            }
            else{
                  all=all.filter((c)=>c != id)
            }
            setchecked(all)
          }

         

          return <>
          <Layout>
            {!spin && 
             <div className="row mt-3"> 
             
             <div className="col-md-3">
             <h4 className="fs-3 m-3">Filter By Category</h4>
             <div className="d-flex flex-column m-3 ">
             {categories?.map((el)=>(
             <Checkbox key={el._id} className="fs-6" onChange={(c)=>{handlechecked(c.target.checked,el._id)}} disabled={search.length}>{el.name}</Checkbox>
               ))}
             </div>
             <h4 className="fs-3 m-3">Filter By Prices</h4>
             <div className="d-flex flex-column m-3 ">
               <Radio.Group onChange={(el)=>setPriceChecked(el.target.value)} disabled={search.length}>
               {prices?.map((el)=>(
                 <div key={el.id}>
                 <Radio  className="fs-6" value={el.range}>{el.name}</Radio>
                 </div>
               ))}
               </Radio.Group>
             </div>
             <div className="btn btn-danger ms-3" onClick={()=>{window.location.reload()}}>RESET FILTERS</div>
              </div> 
             
            
             
  
               <div className="col-md-9">
                <div className="text-center">
                <input placeholder="search product.." className="fs-5 p-2" style={{ width: '30rem' }} onChange={debounce((el)=>setsearch(el.target.value))} ></input>
                </div>
                <h1 className="text-center fs-3 mt-5">All Products</h1>
                <div className="d-flex flex-wrap align-items-start justify-content-center">
                  {products && products.map((el)=>
               
                   <div key={el._id} className="card m-2 " style={{ width: '18rem' }}>
                   <img src={el.avatar?.secure_url} className="card-img-top product-image" alt="no photo" />
                   <div className="card-body">
                   <h1 className="card-text fs-3">{el.name}</h1>
                   <p className="card-text fs-5">{el.description}</p>
                   <p className="card-text fs-5">{`$${el.price}`}</p>
                   <button className="btn btn-primary m-1" onClick={()=>{navigate(`/only_product_detail/${el._id}/${el.category}`)}}>more details</button>
                   <button className="btn btn-secondary" onClick={()=>{
                    setcart([...cart,el]); 
                    toast.success('added to cart');
                     localStorage.setItem('cart',JSON.stringify([...cart,el]))}}>add to cart</button>
                   </div>
                   </div>
                
                   )}
                </div>
                <div className="d-flex align-items-start justify-content-center m-3">
                {!search.length && !checked.length && !PriceChecked.length && butt && <button onClick={()=>{getallproducts()}} className="fs-5 btn btn-warning">Load More..</button> }
                </div>
               
               </div>
  
            </div>  
            }
            {spin && <Spinner/>}
            
         
          </Layout>
          </>
}

export default Homepage