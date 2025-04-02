import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
import api from "../../services/axios-config";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

const ShippingDetails = ({
  setShippingData,
  shippingData,
  onSubmit,
  errors,
  schema,
  setErrors,
}) => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [customBoard, setCustomBoard] = useState({ customBoardData: " " })
  const[language ,setLanguage] = useState("")
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update the formData state with the new value
    setShippingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    let validationError;
  const fieldSchema = schema.pick({ [name]: true });
  const validationResult = fieldSchema.safeParse({ [name]: value });

  if (!validationResult.success) {
    validationError = validationResult.error.format();
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationError[name],
    }));
  } else {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };
}

  useEffect(() => {
    const customBoardData = JSON.parse(localStorage.getItem("customBoard"));
    const language = JSON.parse(localStorage.getItem("language"));
    setLanguage(language)
    if (customBoardData) {
      setCustomBoard(customBoardData[0] ? customBoardData[0] : " ")
    }

    fetchCreditPlans();
  }, []);

  const fetchCreditPlans = async () => {
    try {
      const response = await api.get(
        `/subscription/user-billing-address?userId=${userData.id}`
      );
      const billingAddress = response.data.userBillingAddress?.billingAddress;

      if (billingAddress) {
        // If billing address exists, set the default values in the form
        setShippingData({
          ...billingAddress,
          saveInfo: response.data.userBillingAddress.isAddressExists,
        });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.message);
        // toast.error("Failed to fetch billing address. Please try again later.");
      } else {
        console.error(error);
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let validationError;
    const fieldSchema = schema.pick({ [name]: true });
    const validationResult = fieldSchema.safeParse({ [name]: value });

    if (!validationResult.success) {
      validationError = validationResult.error.format();
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validationError[name],
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };


  return (
    <div class="row g-3 flex-lg-row sign_up_screen flex-md-column-reverse flex-column-reverse">
      <div class="col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-star">
        <div class="inner_text sign_up_img w-100">
          <h5>
            <b>Billing address</b>
          </h5>
          <form class="login_form">
            <div class="row mt-4 pt-lg-3">
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <div class="mb-lg-4 mb-3 pb-1 position-relative">
                  <input
                    type="number"
                    name="zipcode"
                    value={shippingData.zipcode}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={(e) => {
                      handleBlur(e);
                    }}
                    className={`form-control ${errors?.zipcode ? "is-invalid" : ""
                      }`}
                    placeholder="Zip Code"
                  />
                  {errors?.zipcode && (
                    <div className="invalid-feedback">
                      {errors?.zipcode?._errors[0]}
                    </div>
                  )}
                </div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <div class="mb-lg-4 mb-3 pb-1 position-relative">
                  <input
                    type="text"
                    className={`form-control ${errors?.state ? "is-invalid" : ""
                      }`}
                    onBlur={(e) => {
                      handleBlur(e);
                    }}
                    placeholder="State"
                    name="state"
                    value={shippingData.state}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {errors?.state && (
                    <div className="invalid-feedback">
                      {errors?.state?._errors[0]}
                    </div>
                  )}
                </div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <div class="mb-2 position-relative">
                  <input
                    id="address1"
                    type="text"
                    className={`form-control ${errors?.address1 ? "is-invalid" : ""
                      }`}
                    onBlur={(e) => {
                      handleBlur(e);
                    }}
                    placeholder="Address line 1"
                    name="address1"
                    value={shippingData.address1}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {errors?.address1 && (
                    <div className="invalid-feedback">
                      {errors?.address1?._errors[0]}
                    </div>
                  )}
                </div>
                <div class="mb-lg-0 mb-3 pb-lg-1 pb-0 position-relative">
                  <input
                    id="address2"
                    type="text"
                    className={`form-control ${errors?.address2 ? "is-invalid" : ""
                      }`}
                    onBlur={(e) => {
                      handleBlur(e);
                    }}
                    placeholder="Address line 2"
                    name="address2"
                    value={shippingData.address2}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {errors?.address2 && (
                    <div className="invalid-feedback">
                      {errors?.address2?._errors[0]}
                    </div>
                  )}
                </div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <div class="mb-0 position-relative">
                  <input
                    type="text"
                    className={`form-control ${errors?.city ? "is-invalid" : ""
                      }`}
                    onBlur={(e) => {
                      handleBlur(e);
                    }}
                    placeholder="City"
                    id="city"
                    name="city"
                    value={shippingData.city}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {errors?.city && (
                    <div className="invalid-feedback">
                      {errors?.city?._errors[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <hr class="my-lg-5 my-4" />
            <h5>
              <b>Contact information</b>
            </h5>
            <div class="row my-4 py-lg-3">
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <div class="mb-lg-4 mb-3 pb-1 position-relative">
                  <input
                    id="shipTo"
                    type="text"
                    className={`form-control ${errors?.shipTo ? "is-invalid" : ""
                      }`}
                    onBlur={(e) => {
                      handleBlur(e);
                    }}
                    placeholder="Ship to"
                    name="shipTo"
                    value={shippingData.shipTo}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {errors?.shipTo && (
                    <div className="invalid-feedback">
                      {errors?.shipTo?._errors[0]}
                    </div>
                  )}
                </div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <div class="mb-lg-4 mb-3 pb-1 position-relative">
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${errors?.email ? "is-invalid" : ""
                      }`}
                    onBlur={(e) => {
                      handleBlur(e);
                    }}
                    placeholder="E-mail"
                    name="email"
                    value={shippingData.email}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {errors?.email && (
                    <div className="invalid-feedback">
                      {errors?.email?._errors[0]}
                    </div>
                  )}
                </div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <div class="mb-lg-4 mb-3 pb-1 position-relative">
                  <input
                    id="organisation"
                    type="text"
                    className={`form-control ${errors?.organisation ? "is-invalid" : ""
                      }`}
                    onBlur={(e) => {
                      handleBlur(e);
                    }}
                    placeholder="Organization"
                    name="organisation"
                    value={shippingData.organisation}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {errors?.organisation && (
                    <div className="invalid-feedback">
                      {errors?.organisation?._errors[0]}
                    </div>
                  )}
                </div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                <div class="mb-lg-4 mb-3 pb-1 position-relative">
                  <input
                    id="mobileNo"
                    type="number"
                    className={`form-control ${errors?.mobileNo ? "is-invalid" : ""
                      }`}
                    onBlur={(e) => {
                      handleBlur(e);
                    }}
                    placeholder="Mobile/Phone"
                    name="mobileNo"
                    value={shippingData.mobileNo}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {errors?.mobileNo && (
                    <div className="invalid-feedback">
                      {errors?.mobileNo?._errors[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="save_next position-relative d-flex align-items-center gap-3">
                  <div class="custom_input">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      className="form-control "
                      value={shippingData.saveInfo}
                      onBlur={(e) => {
                        handleBlur(e);
                      }}
                      onChange={(e) => {
                        setShippingData((prevData) => ({
                          ...prevData,
                          saveInfo: e.target.checked,
                        }));
                      }}
                      id="saveInfo"
                    />

                    <label></label>
                  </div>
                  <label for>Save this information for the next time.</label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="col-lg-5 col-md-12 col-sm-12 col-12 offset-lg-1">
        <div class="pro_img shipping_img w-100">
          <img src="images/generate_img.png" class="w-100" alt />
        </div>
        <div class="mt-4 pt-lg-3 inner_text sign_up_img">
          <h5>
            <b>Review your order</b>
          </h5>
          <div class="row mt-3 pt-1 g-3">
            <div class="col-lg-4 col-md-12 mt-0 col-sm-12 col-12">
              <p class="m-0">
                <b>Model :</b>
              </p>
            </div>
            <div class="col-lg-8 col-md-12 mt-0 col-sm-12 col-12">
              <p class="m-0">{customBoard.model}</p>
            </div>
            <div class="col-lg-4 col-md-12 col-sm-12 col-12">
              <p class="m-0">
                <b>Language :</b>
              </p>
            </div>
            <div class="col-lg-8 col-md-12 col-sm-12 col-12">
              <p class="m-0">{language}</p>
            </div>
            <div class="col-lg-4 col-md-12 col-sm-12 col-12">
              <p class="m-0">
                <b>Architecture :</b>
              </p>
            </div>
            <div class="col-lg-8 col-md-12 col-sm-12 col-12">
              <p class="m-0">{customBoard.architecture}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
