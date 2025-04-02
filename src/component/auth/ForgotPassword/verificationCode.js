import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import api from "../../../services/axios-config";
import { isAxiosError } from "axios";
import { z } from "zod";
import UserProfile from "../../../utils/UserProfile";

const Schema = z.object({
  otp: z
    .string()
    .min(1, { message: "Verification code is required" })
    .min(4,"Please Enter Valid Code"),
});

const VerifacationCode = () => {
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const userProfile = UserProfile();
  const userId = JSON.parse(localStorage.getItem("userId"));

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm({
    resolver: zodResolver(Schema),
  });

  const onSubmit = async (values) => {
    setLoad(true);
    try {
      const { data } = await api.post(
        `/auth/verify-otp?userId=${userId}`,
        values
      );
      // if (!data) {
      // toast.error("Verification code failed!");
      if (!data)
      //  toast.error("Verification code failed!");
      // }
      setLoad(false);
      navigate("/reset-password", { replace: false });
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
      navigate("/verification-code", { replace: false });
    }
  }, [userProfile?.token, navigate]);

  return (
    <>
      <section class="banner_section generate_banner forgot_flow login_section sign_up_screen position-relative d-flex align-items-center">
        <div class="container position-relative" style={{ zIndex: "9" }}>
          <div class="row position-relative g-3">
            <div class="col-lg-7 col-md-12 col-sm-12 col-12 mt-lg-0 mt-md-4 mt-4 px-lg-0 d-flex align-items-center">
              <div class="inner_text w-100">
                <h2 class="mb-4">Verification code sent.</h2>
                <p class="m-0">
                  We’ve sent you a verification code on the email you shared
                  with us. Check
                  <br /> your inbox (and maybe your spam folder, just in case we
                  got too cheeky for
                  <br /> your email provider).
                </p>
                <div class="row mt-4 pt-2">
                  <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">
                    <form class="login_form" onSubmit={handleSubmit(onSubmit)}>
                      <div class="mb-3 pb-1 position-relative">
                        <input
                          type="text"
                          maxLength={4}
                          className={`form-control ${errors.otp ? "is-invalid" : ""
                            }`}
                          placeholder="Enter verification code"
                          id="otp"
                          {...register("otp", {
                            onBlur: () => trigger("otp"),
                          })}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                          }}
                        />
                        {errors.otp && (
                          <div className="invalid-feedback">
                            {errors.otp.message}
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
                        "Submit"
                      )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-5 col-md-12 col-sm-12 col-12 d-flex align-items-center justify-content-end">
              <div class="forgot_img">
                <img src="images/verification-code.png" alt />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default VerifacationCode;
