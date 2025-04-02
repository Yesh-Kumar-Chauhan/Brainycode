import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import UserProfile from "../../../utils/UserProfile";

const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First Name is required" })
    .refine((value) => !/\d/.test(value), {
      message: "First Name should not contain numbers",
    })
    .refine((value) => !/\s/.test(value), {
      message: "First Name should not contain space",
    }),
  lastName: z
    .string()
    .min(1, { message: "Last Name is required" })
    .refine((value) => !/\d/.test(value), {
      message: "Last Name should not contain numbers",
    })
    .refine((value) => !/\s/.test(value), {
      message: "Last Name should not contain space",
    }),
  username: z.string(),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Email is invalid"),
  password: z
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
  // organisation: z.string(),
  // organisation: z.string().refine((value) => /^(\S+\s?)*\S+$/.test(value), {
  //   message: "Organisation should not contain spaces at the beginning or end",
  // }),
  // role: z.string().min(1, { message: "User Role is required" }),
  age: z
    .string()
    .min(1, { message: "Age is required" })
    .refine(
      (value) => {
        const age = value;
        return age >= 1 && age <= 100;
      },
      { message: "Age must be between 1 and 100" }
    ),
  gender: z.string().min(1, { message: "Gender is required" }),
});
const GeneralDetails = ({ onNext }) => {
  const navigate = useNavigate();
  const userProfile = UserProfile();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const formData = JSON.parse(localStorage.getItem("formData"));
    if (formData) {
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key]);
      });
    }
  }, [setValue]);

  useEffect(() => {
    localStorage.removeItem("formData");
  }, []);

  const onSubmit = async (values) => {
    localStorage.setItem("formData", JSON.stringify(values));
    // setFormData(values)
    onNext();
    //   const { data } = await api.post("/auth/signup", values);
    //   if (!data) toast.error("Signup failed!");
    //   toast.success("Sign up Successfully!");
    //   navigate("/signin", { replace: false });
    // } catch (error) {
    //   if (isAxiosError(error) && error.response) {
    //     toast.error(error.response.data.message);
    //   };
    // }
    // setLoad(false);
  };

  useEffect(() => {
    if (userProfile?.token || userProfile) {
      navigate("/code", { replace: false });
    } else {
      navigate("/signup", { replace: false });
    }
  }, [userProfile?.token, navigate]);

  const handleBack = () => {
    localStorage.removeItem("formData");
    navigate(0);
  };

  return (
    <>
      {/* <section className="banner_section sign_up_sec generate_banner login_section position-relative d-flex align-items-center">
        <div className="container position-relative" style={{ zIndex: 9 }}>
          <div className="row py-lg-5 position-relative center_border">
            <div className="col-lg-6 col-md-12 col-sm-12 col-12">
              <div className="banner_content">
                <h1 className="m-0">I’m new here.</h1>
              </div>
              <div className="row mt-lg-4 mt-md-4 mt-3">
                <div className="col-lg-9 col-md-12 col-sm-12 col-12">
                  <div className="banner_content">
                    <p className="m-0">
                      By creating new account on our website, you will able to
                      use our exciting services and offers. Register your
                      account with your details
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-10 mt-lg-4 mt-md-4 mt-3 pt-lg-2">
                <form className="login_form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="mb-3 pb-1 position-relative">
                        <input
                          type="text"
                          className={`form-control ${errors.firstName ? "is-invalid" : ""
                            }`}
                          placeholder="Firstname"
                          id="firstname"
                          {...register("firstName", {
                            onBlur: () => trigger("firstName"),
                            onChange: () => trigger("firstName"),
                          })}
                        />
                        {errors.firstName && (
                          <div className="invalid-feedback">
                            {errors.firstName.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="mb-3 pb-1 position-relative">
                        <input
                          type="text"
                          className={`form-control ${errors.lastName ? "is-invalid" : ""
                            }`}
                          placeholder="Lastname"
                          id="lastname"
                          {...register("lastName", {
                            onBlur: () => trigger("lastName"),
                            onChange: () => trigger("lastName"),
                          })}
                        />
                        {errors.lastName && (
                          <div className="invalid-feedback">
                            {errors.lastName.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="mb-3 pb-1 position-relative">
                        <input
                          type="text"
                          className={`form-control ${errors.username ? "is-invalid" : ""
                            }`}
                          placeholder="Username"
                          id="username"
                          {...register("username", {
                            onBlur: () => trigger("username"),
                            onChange: () => trigger("username"),
                          })}
                        />
                        {errors.username && (
                          <div className="invalid-feedback">
                            {errors.username.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="mb-3 pb-1 position-relative">
                        <input
                          type="email"
                          className={`form-control ${errors.email ? "is-invalid" : ""
                            }`}
                          placeholder="Email"
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
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="mb-3 pb-1 position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${errors.password ? "is-invalid" : ""
                            }`}
                          placeholder="Password"
                          {...register("password", {
                            onBlur: () => trigger("password"),
                            onChange: () => trigger("password"),
                          })}
                        />
                        <div className="eye">
                          {showPassword ? (
                            <img
                              src="images/Visibility.png"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          ) : (
                            <VisibilityOffIcon
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          )}
                        </div>
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="mb-3 pb-1 position-relative">
                        <input
                          type="text"
                          className={`form-control
                            }`}
                          placeholder="Organisation "
                          id="organisation "
                          {...register("organisation", {
                            onBlur: () => trigger("organisation"),
                            onChange: () => trigger("organisation"),
                          })}
                        />

                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3 pb-1 position-relative">
                        <select
                          className={`form-control ${errors.role ? "is-invalid" : ""
                            }`}
                          id="role "
                          {...register("role", {
                            onBlur: () => trigger("role"),
                            onChange: () => trigger("role"),
                          })}
                        >
                          <option value="" defaultValue hidden>
                            Select role
                          </option>
                          <option value="role1">Role 1</option>
                          <option value="role2">Role 2</option>
                          <option value="role3">Role 3</option>
                        </select>
                        {errors.role && (
                          <div className="invalid-feedback">
                            {errors.role.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button type="submit"
                    className="btn btn-primary w-100 inner_button"
                  >
                    {load ? (
                      <div className='w-100 align-items-center d-flex justify-content-center'>
                        <h1
                          className="loading-spinner"
                          disabled={load}
                          style={{
                            color: "#101A36",
                            margin: "0",
                          }}
                        ></h1>
                      </div>
                    ) : (
                      "Signup"
                    )}
                  </button>
                </form>
                <div className="row login_form login_option mt-3">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <GoogleSignIn />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <GitHubSignIn />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-12 col-sm-12 col-12 offset-lg-1 mt-lg-0 mt-md-4 mt-4">
              <div className="banner_content">
                <h1 className="m-0">I have an account.</h1>
              </div>
              <div className="row mt-lg-4 mt-md-4 mt-3">
                <div className="col-lg-10 col-md-12 col-sm-12 col-12">
                  <div className="banner_content">
                    <p className="m-0">
                      Registered customers can sign in to their account with
                      their registered username & password details.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mt-lg-4 mt-md-4 mt-3 pt-lg-2">
                <div className="login_form">
                  <Link to="/signin">
                    <button
                      className="btn btn-primary inner_button transparent_button">Sign
                      in</button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section> */}
      <section className="banner_section generate_banner login_section sign_up_screen position-relative d-flex align-items-start">
        <div className="container position-relative" style={{ zIndex: 9 }}>
          <div className="row position-relative justify-content-center">
            <div className="col-lg-5 col-md-10 col-sm-12 col-12 mt-lg-0 mt-md-4 mt-4 px-lg-0">
              <ul className="sign_up_steps gap-3 d-flex align-items-center justify-content-between px-3 mb-4 pb-lg-3">
                <li className="d-flex active align-items-center justify-content-center flex-column">
                  <label className="custom_input_outer d-flex align-items-center justify-content-center">
                    <input
                      name="GenerateType"
                      type="radio"
                      value="architecture"
                      disabled
                      checked
                    />
                    <label className="custom_input"></label>
                  </label>
                  <div className="mt-2">General details</div>
                </li>
                <li className="d-flex align-items-center justify-content-center flex-column">
                  <label className="custom_input_outer d-flex align-items-center justify-content-center">
                    <input
                      name="GenerateType"
                      type="radio"
                      value="architecture"
                      disabled
                    />
                    <label className="custom_input"></label>
                  </label>
                  <div className="mt-2">Field of work</div>
                </li>
                <li className="d-flex align-items-center justify-content-center flex-column">
                  <label className="custom_input_outer d-flex align-items-center justify-content-center">
                    <input
                      name="GenerateType"
                      type="radio"
                      value="architecture"
                      disabled
                    />
                    <label className="custom_input"></label>
                  </label>
                  <div className="mt-2">Expertise in tech</div>
                </li>
              </ul>
              <div className="sign_up_img inner_text">
                <h2 className="text-center m-0 position-relative general_detail">
                  <div className="back_arrow">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={handleBack}
                    >
                      <g clip-path="url(#clip0_1201_769)">
                        <path
                          d="M12.8507 21.6094L11.8077 20.5664L9.31865 18.0773L6.29522 15.0539L3.696 12.4547C3.27412 12.0328 2.85928 11.6062 2.43037 11.189L2.41162 11.1703V12.8273L3.45459 11.7844L5.94365 9.2953L8.96709 6.27186L11.5663 3.67264C11.9882 3.25077 12.4147 2.83358 12.8319 2.40702L12.8507 2.38827C13.064 2.17498 13.1929 1.86092 13.1929 1.55858C13.1929 1.2703 13.0663 0.92811 12.8507 0.728891C12.628 0.524985 12.3351 0.372641 12.021 0.386703C11.7093 0.400766 11.4163 0.506235 11.1913 0.728891L10.1483 1.77186L7.65928 4.26092L4.63584 7.28436L2.03662 9.88358C1.61475 10.3055 1.18818 10.7226 0.770996 11.1492L0.752246 11.168C0.30459 11.6156 0.30459 12.3773 0.752246 12.825C1.10146 13.1765 1.45068 13.5234 1.79756 13.8726L4.28662 16.3617L7.31006 19.3851L9.90928 21.9844C10.3312 22.4062 10.7483 22.8328 11.1749 23.25L11.1937 23.2687C11.4069 23.482 11.721 23.6109 12.0233 23.6109C12.3116 23.6109 12.6538 23.4844 12.853 23.2687C13.0569 23.0461 13.2093 22.7531 13.1952 22.439C13.1788 22.1273 13.0757 21.8344 12.8507 21.6094Z"
                          fill="#271353"
                        />
                        <path
                          d="M1.57756 13.1719H21.5744C21.844 13.1719 22.1158 13.1742 22.3854 13.1719H22.4205C22.7205 13.1719 23.0369 13.0406 23.2502 12.8297C23.4541 12.6258 23.6065 12.293 23.5924 12C23.5783 11.6977 23.4799 11.3836 23.2502 11.1703C23.0205 10.9594 22.7393 10.8281 22.4205 10.8281H2.42365C2.15412 10.8281 1.88225 10.8258 1.61272 10.8281H1.57756C1.27756 10.8281 0.961154 10.9594 0.747873 11.1703C0.543967 11.3742 0.391623 11.707 0.405685 12C0.419748 12.3023 0.518185 12.6164 0.747873 12.8297C0.979904 13.0383 1.26115 13.1719 1.57756 13.1719Z"
                          fill="#271353"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1201_769">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  Let’s start with the basics,
                </h2>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-7 col-md-7 col-sm-12 col-12">
                  <form
                    className="login_form"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="my-4 py-lg-3">
                      <div className="mb-3 pb-1 position-relative">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Username"
                          id="username"
                          {...register("username", {
                            onBlur: () => trigger("username"),
                            onChange: () => trigger("username"),
                          })}
                        />
                        {/* {errors.username && (
                          <div className="invalid-feedback">
                            {errors.username.message}
                          </div>
                        )} */}
                      </div>
                      <div className="mb-3 pb-1 position-relative">
                        <input
                          type="email"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          placeholder="Email"
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
                      <div className="mb-3 pb-1 position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          placeholder="Password"
                          {...register("password", {
                            onBlur: () => trigger("password"),
                            onChange: () => trigger("password"),
                          })}
                        />
                        <div className="eye reset_eye">
                          {showPassword ? (
                            <img
                              src="images/resetPassword-eye.png"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          ) : (
                            <VisibilityOffIcon
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          )}
                        </div>
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password.message}
                          </div>
                        )}

                        <div className="strong_pwd mt-2 pt-1">
                          <p className="m-0">A strong password contains :</p>

                          <div className="row">
                            <div className="col-lg-7 col-md-7 col-12">
                              <ul>
                                <li>8-16 characters</li>
                              </ul>
                            </div>
                            <div className="col-lg-5 col-md-5 col-12">
                              <ul>
                                <li>Number</li>
                              </ul>
                            </div>
                            <div className="col-lg-7 col-md-7 col-12">
                              <ul>
                                <li>Upper &amp; lower case letters</li>
                              </ul>
                            </div>
                            <div className="col-lg-5 col-md-5 col-12">
                              <ul>
                                <li>Special character</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 pb-1 position-relative">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.firstName ? "is-invalid" : ""
                          }`}
                          placeholder="First Name"
                          id="firstname"
                          {...register("firstName", {
                            onBlur: () => trigger("firstName"),
                            onChange: () => trigger("firstName"),
                          })}
                        />
                        {errors.firstName && (
                          <div className="invalid-feedback">
                            {errors.firstName.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3 pb-1 position-relative">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.lastName ? "is-invalid" : ""
                          }`}
                          placeholder="Last Name"
                          id="lastname"
                          {...register("lastName", {
                            onBlur: () => trigger("lastName"),
                            onChange: () => trigger("lastName"),
                          })}
                        />
                        {errors.lastName && (
                          <div className="invalid-feedback">
                            {errors.lastName.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3 pb-1 position-relative">
                        <input
                          type="number"
                          className={`form-control ${
                            errors.age ? "is-invalid" : ""
                          }`}
                          placeholder="Age"
                          id="age"
                          {...register("age", {
                            onBlur: () => trigger("age"),
                            onChange: () => trigger("age"),
                          })}
                        />
                        {errors.age && (
                          <div className="invalid-feedback">
                            {errors.age.message}
                          </div>
                        )}
                      </div>
                      <div className="position-relative mb-3 pb-1 select_outer">
                        <select
                          aria-label="Default select example"
                          className={`form-select ${
                            errors.gender ? "is-invalid" : ""
                          }`}
                          id="gender "
                          {...register("gender", {
                            onBlur: () => trigger("gender"),
                            onChange: () => trigger("gender"),
                          })}
                        >
                          <option value="" selected>
                            Select gender
                          </option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Others">Others</option>
                        </select>
                        {errors.gender && (
                          <div className="invalid-feedback generate_error">
                            {errors.gender.message}
                          </div>
                        )}
                        <div className="dorpdown_icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="24"
                            viewBox="0 0 25 24"
                            fill="none"
                          >
                            <path
                              d="M17.5957 11.5676C18.02 11.2141 18.0773 10.5835 17.7237 10.1592C17.3701 9.73496 16.7396 9.67764 16.3153 10.0312L17.5957 11.5676ZM12.7128 14.335L12.0726 15.1032C12.4435 15.4122 12.9822 15.4122 13.353 15.1032L12.7128 14.335ZM9.11034 10.0312C8.68606 9.67764 8.05549 9.73496 7.70193 10.1592C7.34837 10.5835 7.40569 11.2141 7.82997 11.5676L9.11034 10.0312ZM16.3153 10.0312L12.0726 13.5668L13.353 15.1032L17.5957 11.5676L16.3153 10.0312ZM13.353 13.5668L9.11034 10.0312L7.82997 11.5676L12.0726 15.1032L13.353 13.5668ZM21.1 12C21.1 16.7497 17.2497 20.6 12.5 20.6V22.6C18.3542 22.6 23.1 17.8542 23.1 12H21.1ZM12.5 20.6C7.75038 20.6 3.90002 16.7497 3.90002 12H1.90002C1.90002 17.8542 6.64581 22.6 12.5 22.6V20.6ZM3.90002 12C3.90002 7.25038 7.75038 3.40002 12.5 3.40002V1.40002C6.64581 1.40002 1.90002 6.14581 1.90002 12H3.90002ZM12.5 3.40002C17.2497 3.40002 21.1 7.25038 21.1 12H23.1C23.1 6.14581 18.3542 1.40002 12.5 1.40002V3.40002Z"
                              fill="black"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Next
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GeneralDetails;
