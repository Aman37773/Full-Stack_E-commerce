import Layout from "../../components/layout/layout"
import Usermenu from "../../components/layout/usermenu"
import  createContext from "../../contextvar.js"
import { useContext, useState } from "react"
function UserDashboard(){
          const {auth,setauth}=useContext(createContext)
          return <>
          <Layout>
          <div className="container-fluid">
             <div className="row">
               <div className="col-md-3">
                     <Usermenu/>
                </div>
                <div className="col-md-9">
                    <div className="card w-75 p-3 fs-2 m-3 text-uppercase text-center">
                    <div className="d-flex justify-content-center align-items-center m-3">
                 <img src={auth?.user.avatar.secure_url} width={"35%"} alt="no" className="img-fluid" />
                     </div>
                    <h3 className="">{auth?.user.fullname}</h3>
                    <h3>{auth?.user.email}</h3>
                    <h3>{auth?.user.address}</h3>
                    </div>
                </div>
               </div>
          </div>
          </Layout>
          </>
}
export default UserDashboard