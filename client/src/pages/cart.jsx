import { toast } from "react-toastify";
import Layout from "../components/layout/layout"
import  createContext from "../contextvar.js"
import { useContext, useEffect } from "react"
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../spinner";
import Stripe from "stripe";





function Cart(){
const {cart,setcart}=useContext(createContext);
const {auth,setauth}=useContext(createContext);
const [price,setprice]=useState('')
const navigate=useNavigate();
const [spin,setspin]=useState(false)
  const [mainspin,setmainspin]=useState(false);




const handlepayment=async()=>{
  try {
   const {url,sessionId}= await stripeget()
   console.log(cart)
const products=cart.map((el)=>({product:el._id,quantity:el.quantity,photo:el.avatar.secure_url,name:el.name,price:el.price}))
const payment=price
const session_id=sessionId
const buyer=auth.user._id
const address=auth.user.address
  //save in db
   const res=await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/setorders`,{products,payment,session_id,buyer,address},{
   headers:{'Authorization': `Bearer ${auth?.token}`}
   })

if(res.status===200 && res.data.success){
  window.location.href=url;
}

   setspin(false)

  } catch (err) {  
    console.error("Payment error:", err);
    setspin(false)
    toast.error(`Something went wrong: ${err.message}`);
  }
}

//verify payment
const verifypay=async ()=>{
  const urlParams = new URLSearchParams(window.location.search);
  const ID = urlParams.get('session_id');
  
   // console.log(session.payment_status)
 
  if(ID){
    setmainspin(true);
    const session=await stripe.checkout.sessions.retrieve(ID)
    if(session?.payment_status==='paid'){
      try{
        const res=await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/verifyOrder`,{sessionId:ID},{
          headers:{'Authorization': `Bearer ${auth?.token}`}
          })
       
       if(res.status===200 && res.data.success){
        localStorage.setItem('cart',[])
        setcart([])
        setmainspin(false);
        toast.success(res.data.message)
       }
      }
      catch(err){
        console.log(err.message)
        setmainspin(false);
        toast.error('do not bluff')
      }
    } 
  }
}
useEffect(()=>{
 auth?.token && verifypay()
},[auth?.token])


//sessionpayment
const stripe=new Stripe(import.meta.env.VITE_STRIPE_SECRET)
const stripeget= async ()=>{
  try{
    
    setspin(true)
    const items = cart.map(item => ({
      price_data:{
        currency:'usd',
        product_data:{
          name:item.name
        },
        unit_amount:item.price*100
      },
      quantity:item.quantity
    }));
  
  const session = await stripe.checkout.sessions.create({
    line_items:[
       ...items  
    ],
mode:'payment',
success_url:`${import.meta.env.VITE_FRONTEND_URL}/cart?session_id={CHECKOUT_SESSION_ID}`,
cancel_url:`${import.meta.env.VITE_FRONTEND_URL}/cart`,

  })
  
 
  return {url:session.url,sessionId:session.id}
  }
  catch(err){
    console.log(err.message)
  }
  
}




const handlecartdel=(id)=>{
let get=cart.filter((el)=>el._id!==id)
localStorage.setItem('cart',JSON.stringify([...get]))
setcart(get)
}

const handlequantity=(id,val)=>{
let get=cart.map((el)=>(el._id==id) ? {...el,quantity:val}:el)
setcart(get)
localStorage.setItem('cart',JSON.stringify([...get]))
}

useEffect(()=>{
  let total=0
  cart?.map((el)=>{
    total=total+el.price*((el.quantity) || 1)
  })
  setprice(total)
},[cart])


return (<>
<Layout>
  {!mainspin?
  <div className="container">
  <div className="row">
    <div className="col-md-12">
      <h1 className="text-center bg-light p-2 mb-1">
         hello {`${auth.user? `${auth.user?.fullname}`:'my friend'}`}
      </h1>
      <h4 className="text-center">{cart.length? `you have ${cart.length} ${cart.length>1? 'items':'item'} in your cart. ${auth.user?'':'Please Login To Checkout.'}`:`Your Cart Is Empty`}</h4>
    </div>
  </div>  
  <div className="row mt-5">
<div className="col-md-8 fs-3 ">
         {cart.map((el)=>(
         <div className="row card d-flex flex-row m-2 " key={el._id}>
         <div className="col-md-4 card m-1"><img src={`${el.avatar.secure_url}`} alt={`${el.name}`} width='100%'></img></div>
         <div className="col-md-6 ms-3  text-center">
            <h4 className="m-2">Name: {el.name}</h4>
            <h4 className="m-2">Description: {el.description}</h4>
            <h3 className="m-2">Price: ${el.price}</h3>
            <h3 className="m-2 d-flex flex-row">quantity: <input  min="1" type="number"defaultValue={el.quantity} style={{ width: '20%' }}  className="text-center" onChange={(p)=>{handlequantity(el._id,p.target.value)}}></input></h3>
            <button className="btn btn-danger m-2" onClick={()=>handlecartdel(el._id)}>Remove Item</button>
         </div>
         </div>
         ))}
</div>
{cart.length? <div className="col-md-4 fs-3 text-center ">
 <h2>Cart Summary</h2>
<p className="fs-5 mt-3">Total | Checkout | Payment</p>
<hr/>
<p>Total: ${price}</p>
{auth.user? 
<div className="mb-3">
<h4>Shipping Address: {auth.user?.address}</h4>
<button className="btn btn-outline-warning" onClick={()=>navigate('/dashboard/user/profile')}>Change Address</button>
</div>
:
<button className="btn btn-outline-warning" onClick={()=>navigate('/login',{state:'/cart'})}>Login</button>
}
{!spin?
 <div className="mt-2">   
<button className="btn btn-primary" onClick={()=>{ handlepayment()}} disabled={!auth.user}>Make Payment</button>
</div> 
:'please wait...'}


   
</div>:''}
</div>  

</div>       
  : <Spinner/> }


</Layout>
</>)
}

export default Cart