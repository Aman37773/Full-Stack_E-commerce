import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from 'react-toastify';//this gives beautiful alert message
  import 'react-toastify/dist/ReactToastify.css';  
import {BrowserRouter} from 'react-router-dom'  //this helps in creating routes



ReactDOM.createRoot(document.getElementById('root')).render(
 
<BrowserRouter>  
    <App />
    <ToastContainer/>
  </BrowserRouter>
  

)
