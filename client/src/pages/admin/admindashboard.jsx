import Adminmenu from "../../components/layout/adminmenu";
import Layout from "../../components/layout/layout"
import  createContext  from "../../contextvar.js"
import { useContext } from "react"
function AdminDashboard(){
          const {auth,setauth}=useContext(createContext);
          return <>
          <Layout>
          <div className="container-fluid">
             <div className="row">
               <div className="col-md-3">
                     <Adminmenu/>
                </div>
                <div className="col-md-9">
                    <div className="card w-75 p-3 m-3 text-uppercase d-flex justify-content-center align-items-center mt-3">
                      <img src={auth.user?.avatar?.secure_url} width={'35%'} alt="hello..."></img>
                              <h3 className="m-2 fs-4">{auth?.user.fullname}</h3>
                              <h3 className="m-2 fs-4">{auth?.user.email}</h3>
                              <h3 className="m-2 fs-4">{auth?.user.phone}</h3>
                    </div>
                </div>
               </div>
          </div>
                    
          </Layout>
          </>
}
export default AdminDashboard