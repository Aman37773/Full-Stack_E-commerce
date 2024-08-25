import { NavLink } from "react-router-dom"
function Usermenu(){
          return <>
         <div className="list-group  text-center">
      <h3 className="m-4">Dashboard</h3>
      <NavLink to="/dashboard/user/profile" className="list-group-item list-group-item-action fs-4">Profile</NavLink>
      <NavLink to="/dashboard/user/orders" className="list-group-item list-group-item-action fs-4">Orders</NavLink>
    </div>
          </>
}
export default Usermenu