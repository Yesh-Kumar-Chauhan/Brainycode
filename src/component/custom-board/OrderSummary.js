import React, { useEffect, useState } from 'react'
// import { toast } from "react-toastify";
import api from "../../services/axios-config";
import { Link } from 'react-router-dom';
import { useUser } from '../../UserContext';
const OrderSummary = () => {
  const [shippingData, setShippingData] = useState(null);
  const [boardSubscripition, setboardSubscripition] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const [credits, setCredits] = useState(20);
  const {userCredit}= useUser();
  const [error,setError] = useState([])

  useEffect(() => {
    const shippingData = JSON.parse(localStorage.getItem("shippingData"));
    if (shippingData) {
      setShippingData(shippingData);
    }
    getboardSubscripition();
  },
    []);

  const getboardSubscripition = async () => {
    try {
      const {
        data: { subscriptions },
      } = await api.get("/subscription/custom-board-subscription");
      if (!subscriptions) {
        // toast.error("Failed to fetch board subscription Details!");
        return;
      }
      setboardSubscripition(subscriptions);
    } catch (error) {
      // toast.error(error);
    }
  }


  const handleSubscriptionChange = (subscription) => {
    localStorage.setItem("orderSummaryData", JSON.stringify(subscription));
    setSelectedSubscription(subscription.id);
    const newTotalCredits = 20 + parseInt(subscription.credit);
    setCredits(newTotalCredits);
    localStorage.setItem("grandTotal", JSON.stringify(newTotalCredits));

   if(userCredit <= credits + 55){
    setError("user credit is low")
   }

  };

  return (
    <>
      <div
        class="row g-3 flex-lg-row sign_up_screen flex-md-column-reverse flex-column-reverse">
        <div
          class="col-lg-6 col-md-12 col-sm-12 col-12 d-flex flex-column align-items-star">
          <div class="inner_text sign_up_img w-100">
            <h5 class="mb-3"><b>Order Summary</b></h5>
            <h5 class="pt-1 mb-2">Custom board + generated code,
              tested and reviewed.</h5>
            <p>Price : <b class="ps-3">20 Credits</b></p>
            <h5 class="mt-4 pt-lg-3 mb-3">Testing and Review
              Service
              Selection</h5>
            <form action>
              <div className="row g-3 pt-1">
                {
                  boardSubscripition.map((subscription) => (

                    <div
                      className="col-12 d-flex align-items-center gap-2 pt-1"
                      key={subscription.id}
                    >
                      <label className="custom_input_outer d-flex align-items-center justify-content-center">
                        <input
                          name="GenerateType"
                          type="radio"
                          value={subscription.id}
                          checked={selectedSubscription === subscription.id}
                          onChange={() => handleSubscriptionChange(
                            subscription,
                            // subscription.credit
                          )}
                        />
                        <label className="custom_input"></label>
                      </label>
                      <p className="m-0 ps-1">
                        <b>{subscription.title}</b> ({subscription.description}):{' '}
                        {subscription.credit}
                      </p>
                    </div>
                  ))}
              </div>
            </form>
            <div class="mt-4 pt-lg-3">
              <div class="inner_text row g-3">
                <div
                  class="col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
                  <h5
                    class="d-flex align-items-center text-nowrap"><b>Grand
                      total :</b> </h5>
                </div>
                <div
                  class="col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
                  <h5><b><img
                    src="images/Credits.png" alt
                    style={{ width: "24px", height: "24px" }}
                    class="m-0" /> {credits}
                    Credits</b></h5>
                  <p>
                    Running low on Credits?{' '}
                    <Link to="/buy-credit">Get more here.</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-lg-5 col-md-12 col-sm-12 col-12 offset-lg-1">
          <div class="inner_text sign_up_img">
            <h5 class="mb-3"><b>Ship to</b></h5>
            <p class="py-1">
              {shippingData && shippingData.zipcode}<br />
              {shippingData && shippingData.state}<br />
              {shippingData && shippingData.city}<br />
              {shippingData && shippingData.organisation}<br />
              {shippingData && shippingData.address1}<br />
              {shippingData && shippingData.address2}<br />
              {shippingData && shippingData.shipTo}<br />
              {shippingData && shippingData.address1}<br />
              {shippingData && shippingData.mobileNo}<br />
            </p>
            <h5 class="my-3"><b>Shipping charges</b></h5>
            <div class="pt-1 row g-2">
              <div class="col-lg-5 col-md-6 col-sm-12 col-12">
                <p class="m-0"><b>Standard shipping :</b><br />
                  (3-5 business days)</p>
              </div>
              <div class="col-lg-5 col-md-6 col-sm-12 col-12 d-flex align-items-center">
                <p class="m-0">Credits 55</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {error && <span className="text-danger">{error}</span>} */}
    </>
  )
}

export default OrderSummary