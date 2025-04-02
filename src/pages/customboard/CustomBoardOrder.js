import React, { useState, useEffect } from "react";
import ShippingDetails from "../../component/custom-board/ShippingDetails";
import OrderSummary from "../../component/custom-board/OrderSummary";
import Checkout from "../../component/custom-board/Checkout";
import { z } from "zod";
// import { toast } from "react-toastify";
import api from "../../services/axios-config";
import { isAxiosError } from "axios";
import { loadStripe } from '@stripe/stripe-js'
import { useNavigate } from "react-router-dom";

const schema = z.object({
  zipcode: z.string().min(1, { message: "Zip Code is required" }),
  state: z
    .string()
    .min(1, { message: "State is required" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Only alphabets are allowed for the State" }),
  address1: z.string().min(1, { message: "Address Line 1 is required" }),
  city: z.string().min(1, { message: "City is required" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Only alphabets are allowed for the City" }),
  address2: z.string().min(1, { message: "Address Line 2 is required" }),
  shipTo: z.string().min(1, { message: "ShipTo is required" })
    .refine(value => value !== "0", { message: "ShipTo cannot be '0'" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Email is invalid"),
  organisation: z.string().min(1, { message: "Organization is required" }),
  mobileNo: z.string().min(1, { message: "Mobile/Phone is required" })
    .length(10, { message: "Mobile/Phone number should be exactly 10 characters long (without country code)" }),
});

const CustomBoardOrder = () => {

  const navigate = useNavigate()
  const [userCredit, setUserData] = useState('');
  const [activeComponent, setActiveComponent] = useState("ShippingDetails");
  const [errors, setErrors] = useState(null);
  const [load, setload] = useState(false);
  const [promptId, setPromptId] = useState(false);
  const [shippingData, setShippingData] = useState({
    zipcode: "",
    state: "",
    address1: "",
    city: "",
    address2: "",
    shipTo: "",
    email: "",
    organisation: "",
    mobileNo: "",
    saveInfo: false,
  });
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [isTestingAndReview, setIsTestingAndReview] = useState(false);
  const customBoardPromptId = localStorage.getItem("customBoardPromptId");



  const handleComponentChange = (componentName) => {
    if (activeComponent === "ShippingDetails" && !isShippingDetailsFilled()) {
      return;
    }
    setActiveComponent(componentName);
    setIsTestingAndReview(componentName === "OrderSummary");
  };

  const onSubmit = async (data) => {
    let validationError;
    if (activeComponent == "ShippingDetails") {
      const result = schema.safeParse(shippingData);
      if (!result.success) {
        validationError = result.error.format();
        setErrors(validationError);
      } else {
        setErrors(null);
      }
    }

    if (!validationError) {
      try {
        setload(true);
        const { data } = await api.post(
          `/subscription/billing-address?userId=${userData.id}`,
          shippingData
        );
        if (!data) {
          // toast.error("Shipping details data failed!");
          return;
        }
        localStorage.setItem("shippingData", JSON.stringify(shippingData));
        // toast.success("Shipping details successful!");
        setActiveComponent("OrderSummary");
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          // toast.error(error.message);
        }
      }
    }
    setload(false);
  };

  const handleBackButtonClick = () => {
    if (activeComponent === "OrderSummary") {
      setActiveComponent("ShippingDetails");
      // setIsTestingAndReview(false);
    } else if (activeComponent === "Checkout") {
      setActiveComponent("OrderSummary");
    }
    else if (activeComponent === "ShippingDetails") {
      navigate(`/custom-board/${promptId}`);
    }
  };

  const isShippingDetailsFilled = () => {
    return (
      shippingData.zipcode &&
      shippingData.state &&
      shippingData.address1 &&
      shippingData.city &&
      shippingData.address2 &&
      shippingData.shipTo &&
      shippingData.email &&
      shippingData.organisation &&
      shippingData.mobileNo
    );
  };


  useEffect(() => {
    const customBoardPromptId = localStorage.getItem("customBoardPromptId");
    setPromptId(customBoardPromptId)
    getUserData()
  }, [setUserData]);

  const getUserData = async () => {
    try {
      const response = await api.get(
        `/subscription/credit?userId=${userData.id}`
      );
      setUserData(response.data.userCredit.credits)
    } catch (error) {
      // toast.error(error);
    }
  };

  const proceedToCheckout = async (e) => {
        //generate orderId
        setload(true);
    const randomDigits = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
    const newOrderId = `ORD-${randomDigits}`;
    localStorage.setItem("orderNumber", JSON.stringify(newOrderId));
    const orderSummary = JSON.parse(localStorage.getItem("orderSummaryData"));
    const grandTotal = JSON.parse(localStorage.getItem("grandTotal"));
    const allCredits = grandTotal + 55;
    if (parseInt(userCredit) >= allCredits) {
      try {
        const values = {
          createdAt: orderSummary.createdAt,
          credit: allCredits,
          id: orderSummary.id,
          updatedAt: orderSummary.updatedAt,
          userId: userData.id,
          price: 0,
          orderId: newOrderId,
        };
        // const stripePromise = await loadStripe('pk_test_51Ok3mhSE6dF2qCWlCYT6iDk2fBA3AJN4X3eleq8PDBTe9h0u88WPydQw0LxiY4TDkHZz1DZ7u197A6lXOaQRTlKX00aRQGQcrg');
        const { data } = await api.post("/subscription/create-order-and-checkout", values);
        if (!data) console.log("error ")
        navigate("/order-confirm");
        localStorage.setItem("userCredits", parseInt(data.session.credits, 10));
        // stripePromise.redirectToCheckout({ sessionId: data.session.id })
      } catch (error) {
        // toast.error(error);
      } finally {
         setload(false);
      }
    }
    else {
      // toast.error("User is low in credit please buy some credit");
      setload(false);
    }

  }

  return (
    <section className="generate_code_section">
      <div class="container">
        <div class="row mb-4 pb-lg-3 g-3">
          <div class="col-lg-6 col-md-8 col-sm-12 col-12 d-flex align-items-center">
            <ul class="d-flex gap-lg-4 gap-3">
              <li class="d-flex align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  onClick={handleBackButtonClick}
                  style={{ cursor: "pointer" }}
                >
                  <g clip-path="url(#clip0_702_1786)">
                    <path
                      d="M12.8512 21.6094L11.8082 20.5664L9.31914 18.0774L6.2957 15.0539L3.69648 12.4547C3.27461 12.0328 2.85977 11.6063 2.43086 11.1891L2.41211 11.1703V12.8274L3.45508 11.7844L5.94414 9.29533L8.96758 6.27189L11.5668 3.67267C11.9887 3.2508 12.4152 2.83361 12.8324 2.40705L12.8512 2.3883C13.0645 2.17502 13.1934 1.86095 13.1934 1.55861C13.1934 1.27033 13.0668 0.92814 12.8512 0.728921C12.6285 0.525015 12.3355 0.372671 12.0215 0.386734C11.7098 0.400796 11.4168 0.506265 11.1918 0.728921L10.1488 1.77189L7.65977 4.26095L4.63633 7.28439L2.03711 9.88361C1.61523 10.3055 1.18867 10.7227 0.771484 11.1492L0.752734 11.168C0.305078 11.6156 0.305078 12.3774 0.752734 12.825C1.10195 13.1766 1.45117 13.5235 1.79805 13.8727L4.28711 16.3617L7.31055 19.3852L9.90977 21.9844C10.3316 22.4063 10.7488 22.8328 11.1754 23.25L11.1941 23.2688C11.4074 23.482 11.7215 23.611 12.0238 23.611C12.3121 23.611 12.6543 23.4844 12.8535 23.2688C13.0574 23.0461 13.2098 22.7531 13.1957 22.4391C13.1793 22.1274 13.0762 21.8344 12.8512 21.6094Z"
                      fill="#271353"
                    />
                    <path
                      d="M1.57707 13.1719H21.5739C21.8435 13.1719 22.1154 13.1742 22.3849 13.1719H22.42C22.72 13.1719 23.0364 13.0406 23.2497 12.8297C23.4536 12.6258 23.606 12.293 23.5919 12C23.5779 11.6977 23.4794 11.3836 23.2497 11.1703C23.02 10.9594 22.7388 10.8281 22.42 10.8281H2.42317C2.15363 10.8281 1.88176 10.8258 1.61223 10.8281H1.57707C1.27707 10.8281 0.960666 10.9594 0.747385 11.1703C0.543478 11.3742 0.391135 11.707 0.405197 12C0.41926 12.3023 0.517697 12.6164 0.747385 12.8297C0.979416 13.0383 1.26067 13.1719 1.57707 13.1719Z"
                      fill="#271353"
                    />
                  </g>
                  <defs>
                    <clippath id="clip0_702_1786">
                      <rect width="24" height="24" fill="white" />
                    </clippath>
                  </defs>
                </svg>
              </li>
              <li
                // class="py-2 px-3 active pagination_button"
                className={`py-2 px-3 ${activeComponent == "ShippingDetails" ? 'active' : ''} pagination_button`}
                onClick={() => handleComponentChange("ShippingDetails")}
              >
                Shipping details
              </li>
              <li
                // class="py-2 px-3 active pagination_button"
                className={`py-2 px-3 ${activeComponent === "OrderSummary" ? 'active' : ''} pagination_button`}
                // onClick={() => handleComponentChange("OrderSummary")}
              >
                Testing and Review
              </li>
            </ul>
          </div>
          <div class="col-lg-6 col-md-4  col-sm-12 col-12 d-flex align-items-center justify-content-lg-end justify-content-md-end justify-content-start">

            {activeComponent === "ShippingDetails" && (
              <div className="d-flex align-items-center gap-lg-4 gap-3">
                <button className="btn btn-outline-primary">Cancel</button>
                <button
                  className="btn btn-primary"
                  type="button"
                  style={{width:'100%',maxWidth:'102px',minWidth:'102px'}}
                  onClick={(e) => {
                    onSubmit(e);
                  }}
                >
                  {load ? (
                    <h1
                      className="loading-spinner"
                      style={{
                        color: "#101A36",
                        margin: "0",
                      }}
                    ></h1>
                  ) : (
                    "Next"
                  )}
                </button>

              </div>
            )}

            {activeComponent === "OrderSummary" && (
              <div className="d-flex align-items-center gap-lg-4 gap-3">
                <button className="btn btn-outline-primary">Cancel</button>
                <button
                  className="btn btn-primary"
                  type="button"
                  style={{width:'100%',maxWidth:'129px',minWidth:'129px'}}
                  onClick={(e) => {
                    proceedToCheckout(e);
                  }}
                >
                  {load ? (
                    <h1
                      className="loading-spinner"
                      style={{
                        color: "#101A36",
                        margin: "0",
                      }}
                    ></h1>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        {activeComponent === "ShippingDetails" && (
          <ShippingDetails
            setShippingData={setShippingData}
            shippingData={shippingData}
            onSubmit={onSubmit}
            errors={errors}
            setErrors={setErrors}
            schema={schema}
          />
        )}
        {activeComponent === "OrderSummary" && <OrderSummary />}
        {/* {activeComponent === "Checkout" && <Checkout />} */}
      </div>
    </section>
  );
};

export default CustomBoardOrder;