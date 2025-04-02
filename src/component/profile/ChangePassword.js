import React, { useState } from "react";
import { NewPassword } from "./NewPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
import api from "../../services/axios-config";
import { isAxiosError } from "axios";
const Schema = z
  .object({
      currentPassword: z
        .string()
        .min(1, { message: "Password is required" })
        .refine(
          (value) =>
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
              value
            ),
          {
            message:
              "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
          }
        ),

  }
  );

const ChangePassword = () => {
  const [load, setLoad] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userCurrentPassword = userData.password;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(Schema),
  });

  const onSubmit = async (values) => {
    setErrorMessage(null)
      try {
        setLoad(true);
        const { data } = await api.post(
          `/auth/change-password?userId=${userData.id}`,
          values
        );
        if (!data) {
          // toast.error("Password is not Exist");
          return;
        }
        // toast.success("Change Password successful!");
        setShowNewPassword(true);
        setErrorMessage("");
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          // toast.error(error.response.data.message);
          setErrorMessage(error.response.data.message);
        }
        setLoad(false);
      }
  };

  const onCancel = () => {
    setShowNewPassword(false);
    setLoad(false);
    reset();
    setErrorMessage(null);
  };

  //   const checkPasswordMatch = () => {
  //     const newPassword = getValues("currentPassword");
  //     if (newPassword === userCurrentPassword) {
  //       return "New password must be different from the current password";
  //     }
  //     return true;
  //   };

  //   const checkPasswordMatch = () => {
  //     const currentPassword = getValues("currentPassword");
  //     const newPassword = getValues("newPassword");
  //     if (currentPassword === newPassword) {
  //       return "New password must be different from the current password";
  //     }
  //     return true;
  //   };
  return (
    <div
      class="tab-pane fade"
      id="change-password"
      role="tabpanel"
      aria-labelledby="change-password-tab"
    >
      <h5 class="m-0">
        <b>Change password</b>
      </h5>
     
      <div class="mt-lg-5 mt-md-4 mt-4 pt-lg-3 pt-lg-2">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12 col-12">
            {showNewPassword ? (
              <NewPassword onCancel={onCancel} />
            ) : (
              <form
                class="login_form mt-3 pt-1"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div class="row w-100">
                  <div class="col-lg-2 d-flex align-items-start pt-3 col-md-12 col-sm-12 col-12">
                    <label for class="text-nowrap pe-1 mb-lg-0 mb-md-0 mb-3">
                      Current password:
                    </label>
                  </div>
                  <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                    <div class="position-relative w-100">
                      <input
                        className={`form-control ${
                          errors.currentPassword ? "is-invalid" : ""
                        }`}
                        type={showPassword ? "text" : "Password"}
                        class="form-control"
                        placeholder="----------"
                        id="currentPassword"
                        {...register("currentPassword", {
                          onBlur: () => trigger("currentPassword"),
                          onChange: () => trigger("currentPassword"),
                        })}
                      />
                       {errorMessage && <div className="text-danger">{errorMessage}</div>}
                      <div className="eye">
                        {showPassword ? (
                          <img
                            src="images/eye.png"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ width: "24px" }}
                          />
                        ) : (
                          <img
                            src="images/eyeicon.png"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ width: "24px" }}
                          />
                        )}
                      </div>
                      {errors.currentPassword && (
                        <div className="invalid-feedback">
                          {errors.currentPassword.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div class="btn_group d-flex align-items-center flex-wrap gap-4 mt-4 pt-lg-1 pt-md-1">
                  <button
                    style={{
                      height: "48px",
                      borderRadius: "48px",
                      width: "100%",
                      maxWidth: "197px",
                    }}
                    type="submit"
                    class="btn justify-content-center btn-outline-primary py-3 px-4"
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
                      "Reset Password"
                    )}
                  </button>
                </div>
              </form>
            )}
            {/* {showNewPassword && <NewPassword />} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
