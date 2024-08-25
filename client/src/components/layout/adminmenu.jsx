import { NavLink } from "react-router-dom"
function Adminmenu(){
          return <>
         <div className="list-group m-3">
      <h4 className="m-4">ADMIN PANEL</h4>
      <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-item-action fs-5">Create Category</NavLink>
      <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action fs-5">Create Product</NavLink>
      <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action fs-5">Products</NavLink>
      <NavLink to="/dashboard/admin/admin_orders" className="list-group-item list-group-item-action fs-5">Orders</NavLink>
      <NavLink to="/dashboard/admin/users" className="list-group-item list-group-item-action fs-5">Users</NavLink>
    </div>
          </>
}
export default Adminmenu