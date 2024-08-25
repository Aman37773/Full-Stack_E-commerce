import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import createContext from "../../contextvar.js";
import { useContext } from "react";
import axios from "axios";
import moment from "moment/moment"; // Import moment for date formatting
import { Select } from "antd";
import { toast } from "react-toastify";
import Adminmenu from "../../components/layout/adminmenu";

function Admin_orders() {
  const { auth, setauth } = useContext(createContext);
  const [orders, setOrders] = useState([]);
  const [optStatusus,setOptStatuses]=useState(['Not Processed','Processing','Shipped','delievered','cancelled'])

  const getOrders = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/getOrders`,
        {paymentStatus: 'Completed' },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );

      if (res.status === 200 && res.data.success) {
        setOrders([...res.data.orders]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, [auth?.token]);


  //handle status update
  const handleUpdate=async (status,session_id)=>{
          try {
                    const res = await axios.post( `${import.meta.env.VITE_BACKEND_API}/api/updateStatus`,{status: status ,sessionId:session_id},
                      { headers: { Authorization: `Bearer ${auth?.token}` } }
                    );
              
                    if (res.status === 200 && res.data.success) {
                      toast.success(res.data.message)
                    }
                  } catch (error) {
                    toast.error(err.message)
                  }
  }

  return (
    <>
      <Layout title="dashboard-orders">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <Adminmenu />
            </div>
            <div className="col-md-9">
                    {orders.length?
                    <>
                     <h1 className="text-center">All Orders</h1>

<table className="table fs-6 m-3">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Status</th>
      <th scope="col">Date</th>
      <th scope="col">Buyer</th>
      <th scope="col">Payment</th>
      <th scope="col">Items</th>
      <th scope="col">Address</th>
    </tr>
  </thead>
  <tbody>
    {orders?.map((el, i) => (
      <React.Fragment key={el._id}>
        <tr>
          <td>{i + 1}</td>
          <td>
                <Select onChange={(val)=>handleUpdate(val,el.session_id)} defaultValue={el.status}>
      {optStatusus.map((el,i)=>(
                <Select.Option key={i} value={el}>{el}</Select.Option>
      ))}
                </Select>
          </td>
          <td>{moment(el.createdAt).fromNow()}</td>
          <td>{auth.user.fullname}</td>
          <td>{el.payment}</td>
          <td>{el.products.length}</td>
          <td>{el.address}</td>
        </tr>

        <tr key={`${el._id}-products`}>
          <td colSpan="6">
            {el.products.map((product) => (
              <div
                className="row card d-flex flex-row m-2"
                key={product._id}
              >
                <div className="col-md-4 card m-1">
                  <img
                    src={product.photo}
                    alt={product.name}
                    width="50%"
                  />
                </div>
                <div className="col-md-6 ms-3 text-center">
                  <h4 className="m-2 fs-5">
                    Name: {product.name}
                  </h4>
                  <h3 className="m-2 fs-5">
                    Price: ${product.price}
                  </h3>
                  <h3 className="m-2 fs-5">
                    Quantity: {product.quantity}
                  </h3>
                </div>
              </div>
            ))}
          </td>
        </tr>
      </React.Fragment>
    ))}
  </tbody>
</table>
                    </>
                    :
                    <div className="text-center m-5">No Orders</div>}
             
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Admin_orders;
