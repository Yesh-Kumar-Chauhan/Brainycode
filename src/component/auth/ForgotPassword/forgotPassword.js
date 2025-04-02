import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import { toast } from "react-toastify";
import api from "../../../services/axios-config";
import { isAxiosError } from "axios";
import UserProfile from "../../../utils/UserProfile";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid Email address"),
});

const ForgotPassword = () => {
  const userProfile = UserProfile();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values) => {
    setLoad(true);
    try {
      const { data } = await api.post("/auth/forgot-password", values);
      if (!data) {
        // toast.error("Forgot Password data failed!");
        return;
      }
      localStorage.setItem("userId", JSON.stringify(data.data.userId));
      setLoad(false);
      navigate("/verification-code", { scroll: false });
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        // toast.error(error.response.data.message);
      }
    }
    setLoad(false);
  };

  useEffect(() => {
    if (userProfile?.token || userProfile) {
      navigate("/code", { replace: false });
    } else {
      navigate("/forgot-password", { replace: false });
    }
  }, [userProfile?.token, navigate]);

  return (
    <section class="banner_section generate_banner forgot_flow login_section sign_up_screen position-relative d-flex align-items-center">
      <div class="container position-relative" style={{ zindex: 9 }}>
        <div class="row position-relative g-3">
          <div class="col-lg-7 col-md-12 col-sm-12 col-12 mt-lg-0 mt-md-4 mt-4 px-lg-0 d-flex align-items-center">
            <div class="inner_text w-100">
              <h2 class="mb-4">Let's jog your memory!</h2>
              <p class="m-0">
                Enter the email you think you might’ve used. We promise not to
                send any
                <br /> judgmental looks your way.
              </p>
              <div class="row mt-4 pt-2">
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">
                  <form class="login_form" onSubmit={handleSubmit(onSubmit)}>
                    <div class="mb-3 pb-1 position-relative">
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="Enter your email address"
                        id="email"
                        {...register("email", {
                          onBlur: () => trigger("email"),
                          onChange: () => trigger("email"),
                        })}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <button class="btn btn-primary w-100 px-lg-4 px-3">
                    {load ? (
                     
                        <h1
                          className="loading-spinner"
                          style={{
                            color: "#101A36",
                            margin: "0",
                          }}
                        ></h1>
      
                    ) : (
                      "Send verification code"
                    )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-5 col-md-12 col-sm-12 col-12 d-flex align-items-center justify-content-end">
            <div class="forgot_img">
              <img src="images/send_otp.png" alt />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
