import React, { useState, useEffect } from "react";
import api from "../../services/axios-config";
import moment from "moment";
// import { toast } from "react-toastify";
import { isAxiosError } from "axios";

const Orders = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [orderData, setOrderData]= useState([])

  useEffect(() => {
    getOrderData()
  }, [])

    const getOrderData = async () => {
        try {
          const response = await api.get(
            `/subscription/orders?userId=${userData.id}`
          );
          setOrderData(response.data.orders)
        } catch (error) {
          // toast.error(error);
        }
      };

  return (
    <div class="tab-pane fade" id="orders"
    role="tabpanel"
    aria-labelledby="orders-tab">

    <h5 class="m-0"><b>Order history</b></h5>
    {orderData.length === 0 ? (
        <p>No orders found.</p>
      ) : (
    <div class="row request_table">
        <div class="col-12 mt-3 pt-1">
            <table class="table">
                <thead>
                    <tr>
                        <th
                            class="text-nowrap text-start">Description</th>
                        <th
                            class="text-nowrap text-center">Order
                            date</th>
                        <th
                            class="text-nowrap text-center">Credits
                            used</th>
                        <th
                            class="text-nowrap text-center">Status</th>
                    </tr>
                </thead>
                {orderData.map((plan) => (
                <tbody key={plan.id}>
                    <tr>
                        <td
                            class="text-start"><b>XeonBoard
                                Pro V2 |<br /></b>
                            <span>
                                Temperature
                                monitoring system
                                with real-time
                                alerts and data
                                logging.</span>
                        </td>
                        <td
                            class="text-center">{moment(plan.createdAt).format('MMMM DD YYYY')}</td>
                        <td
                            class="text-center">{plan.amount}</td>
                        <td
                            class="text-center"><b>{plan.status}</b></td>
                    </tr>
                </tbody>
                 ))}
            </table>
        </div>
    </div>
     )}
</div>
  )
}

export default Orders