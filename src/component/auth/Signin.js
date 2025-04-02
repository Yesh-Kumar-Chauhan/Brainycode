import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GoogleSignIn from "./googleAuth";
import api from "../../services/axios-config";
import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import GitHubSignIn from "./githubAuth";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import UserProfile from '../../utils/UserProfile'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid Email address"),
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
});

const SignIn = () => {
  const userProfile = UserProfile();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [load, setLoad] = useState(false);
  const onSubmit = async (values) => {
    setLoad(true);
    try {
      const { data } = await api.post("/auth/signin", values);
      if (!data)
      console.log("singIn failed ")
      //  toast.error("Signin failed!");
      localStorage.setItem("userData", JSON.stringify(data.user.dataValues));
      localStorage.setItem("token", JSON.stringify(data.token));
      // localStorage.setItem("token", JSON.stringify(data.authTokens.AccessToken));
      // toast.success("Sign in Successfully!");
      navigate("/code", { scroll: false });
    } catch (error) {
      // toast.error(error.message);
      // toast.error(error.response.data.message);
    }
    setLoad(false);
  };

  useEffect(() => {
    if (userProfile?.token || userProfile) {
      navigate("/code", { replace: false });
    } else {
      navigate("/signin", { replace: false });
    }
  }, [userProfile?.token, navigate]);

  return (
    <div>
      <section className="banner_section generate_banner sign_in_page login_section position-relative d-flex align-items-center">
        <div className="container position-relative" style={{ zIndex: 9 }}>
          <div className="row py-lg-5 position-relative center_border">
            <div className="col-lg-6 col-md-12 col-sm-12 col-12">
              <div className="banner_content">
                <h1 className="m-0">I have an account.</h1>
              </div>
              <div className="row mt-lg-4 mt-md-4 mt-3">
                <div className="col-lg-9 col-md-12 col-sm-12 col-12">
                  <div className="banner_content">
                    <p className="m-0">
                      Registered customers can sign in to their account with
                      their registered email & password details.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 mt-lg-4 mt-md-4 mt-3 pt-lg-2">
                <form className="login_form  px-lg-4 px-md-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3 pb-1 position-relative">
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""
                        }`}
                      placeholder=" Email"
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
                  <button
                    type="submit"
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
                      "Login"
                    )}
                  </button>
                </form>
                <div className="row login_form login_option mt-3 pt-1 px-lg-4 px-md-4">
                  <Link to='/forgot-password' className="text-white">
                    I forgot my password...
                  </Link>
                </div>
                <div className="row login_form login_option mt-4 pt-2">
                  <div className="col-12 mb-4 pb-2">
                    <div className="login_with inner_text text-center position-relative">
                      <p className="m-0 text-white">OR</p>
                    </div>
                  </div>
                  {/* <div className="col-lg-6 col-md-6 mb-2 pb-2 col-sm-12 col-12 px-lg-4 px-md-4">
                    <div className="px-lg-2">
                      <GoogleSignIn />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12 px-lg-4 px-md-4">
                    <div className="px-lg-2">
                      <GitHubSignIn />
                    </div>
                  </div> */}
                </div>
                <div className="row login_form login_option">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12 ps-lg-4 ps-md-4">
                    <div className="ps-lg-2">
                      <GoogleSignIn />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12 pe-lg-4 pe-md-4">
                    <div className="pe-lg-2">
                      <GitHubSignIn />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-12 col-sm-12 col-12 offset-lg-1 mt-lg-0 mt-md-4 mt-4">
              <div className="banner_content">
                <h1 className="m-0">I’m new here.</h1>
              </div>
              <div className="row mt-lg-4 mt-md-4 mt-3">
                <div className="col-lg-10 col-md-12 col-sm-12 col-12">
                  <div className="banner_content">
                    <p className="m-0">
                      By creating new account on our website, you will able to
                      use our exciting services and offers. Register your
                      account with your details
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mt-lg-4 mt-md-4 mt-3 pt-lg-2">
                <div className="login_form">
                  <Link to="/signup">
                    <button className="btn btn-primary inner_button transparent_button">
                      Sign up
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
