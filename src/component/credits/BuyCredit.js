import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
import api from "../../services/axios-config";
import { isAxiosError } from "axios";
import { loadStripe } from "@stripe/stripe-js";


const BuyCredit = () => {
  const [creditPlans, setCreditPlans] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [load, setLoad] = useState(false);
  useEffect(() => {
    fetchCreditPlans();
  }, []);

  const fetchCreditPlans = async () => {
    try {
      setLoad(true);
      const response = await api.get("/subscription/credit-plans");
      setCreditPlans(response.data.plans);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.message);
        // toast.error("Failed to fetch credit plans. Please try again later.");
      } else {
        console.error(error);
      }
    }
    setLoad(false);
  };

  const handleBuyPlan = async (plan) => {
    try {
      const obj = {
        amount: {
          createdAt: plan.createdAt,
          credit: plan.credit,
          id: plan.id,
          updatedAt: plan.updatedAt,
          userId: userData.id,
          price: plan.price,
          callbackUrl: sessionStorage.getItem('lastPageURL')
        },
      };
      const stripePromise = await loadStripe(
        "pk_test_51Ok3mhSE6dF2qCWlCYT6iDk2fBA3AJN4X3eleq8PDBTe9h0u88WPydQw0LxiY4TDkHZz1DZ7u197A6lXOaQRTlKX00aRQGQcrg"
      );
      const { data } = await api.post(
        "/subscription/create-checkout-session",
        obj.amount
      );
      if (!data) {
        console.log("error ");
      }
      stripePromise.redirectToCheckout({ sessionId: data.session.id });
    } catch (error) {
      // toast.error(error);
    }
  };
  return (
    <>
     {load ? (
          <div className="w-100 page_loader align-items-center d-flex justify-content-center">
            <h1
              className="loading-spinner"
              style={{
                color: "#101A36",
                margin: "0",
                backdropFilter: "blur(8px)",
              }}
            ></h1>
          </div>
        ) : (
          ""
        )}
      <section class="banner_section generate_banner login_section sign_up_screen position-relative d-flex align-items-center">
        <div class="container position-relative" style={{ zindex: 9 }}>
          <div class="row position-relative g-3">
            <div class="col-lg-6 pe-lg-4 col-md-12 col-sm-12 col-12 mt-lg-0 mt-md-4 mt-4 px-lg-0 d-flex align-items-center">
              <div class="inner_text w-100">
                <h2 class="mb-4">Buy Credits</h2>
                <p class="m-0">
                  Power your projects with our easy-to-use credits. Select the
                  amount you need and get started immediately.
                </p>
              </div>
            </div>
          </div>
          <div class="row pt-lg-5 g-3 mt-lg-5 pt-4">
            {creditPlans.map((plan) => (
              <div class="col-lg-4 col-md-6 col-sm-12 col-12">
                <div class="credis_card inner_text sign_up_img">
                  <h5>
                    <b>{plan.title}</b>
                  </h5>
                  <h5 class="mt-3 pt-1 mb-1">{plan.credit} Credits</h5>
                  <p class="mb-3 pb-1">{plan.description}</p>
                  <button
                    class="btn btn-outline-primary"
                    onClick={() => handleBuyPlan(plan)}
                  >
                    Buy for ${plan.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BuyCredit;
