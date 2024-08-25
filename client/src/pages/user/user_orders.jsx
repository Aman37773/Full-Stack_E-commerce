import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import Usermenu from "../../components/layout/usermenu";
import createContext from "../../contextvar.js";
import { useContext } from "react";
import axios from "axios";
import moment from "moment/moment"; // Import moment for date formatting

function User_orders() {
  const { auth, setauth } = useContext(createContext);
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/getOrders`,
        { buyer: auth?.user?._id, paymentStatus: 'Completed' },
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

  return (
    <>
      <Layout title="dashboard-orders">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <Usermenu />
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
          <td>{el.status}</td>
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
            : <div className="text-center mt-5">No Orders....</div>
            }
             
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default User_orders;
