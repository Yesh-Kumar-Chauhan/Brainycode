import React, { useState,useEffect } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import api from "../../../services/axios-config"
import { isAxiosError } from "axios";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import UserProfile from '../../../utils/UserProfile';

const ResetPassword = () => {
    const userProfile = UserProfile();
    const [load, setLoad] = useState(false);
    const userId = JSON.parse(localStorage.getItem("userId"));
    const navigate = useNavigate();
    const signupSchema = z.object({
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

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (password) => {
        setLoad(true)
        try {
            const { data } = await api.post(`/auth/reset-password?userId=${userId}`, password);
            if (!data) 
            // toast.error("reset password failed!");
            setLoad(false)
            navigate("/success-password", { replace: false });
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                // toast.error(error.response.data.message);
            };
        }
        setLoad(false)
    };

    useEffect(() => {
        if (userProfile?.token || userProfile) {
            navigate("/code", { replace: false });  
        } else {
            navigate("/reset-password", { replace: false });
        }
    }, [userProfile?.token, navigate]);
    return (
        <div>
            <section
                class="banner_section generate_banner forgot_flow login_section sign_up_screen position-relative d-flex align-items-center">
                <div class="container position-relative" style={{ zIndex: 9 }}>
                    <div class="row position-relative g-3">
                        <div
                            class="col-lg-7 col-md-12 col-sm-12 col-12 mt-lg-0 mt-md-4 mt-4 px-lg-0 d-flex align-items-center">
                            <div class="inner_text w-100">
                                <h2 class="mb-4">Reset your password.</h2>
                                <p class="m-0">We thought about sending you your old
                                    password, but we figured it's<br /> probably
                                    time for
                                    a refresh.</p>
                                <p class="m-0">Remember, a strong password is :</p>
                                <ul>
                                    <li>8-16 characters long.</li>
                                    <li>Contains a mix of upper and lower case
                                        letters.</li>
                                    <li>Contains numeric and special
                                        characters.</li>
                                    <li>Not your birthdate.</li>
                                </ul>
                                <div class="row mt-4 pt-2">
                                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <form class="login_form" onSubmit={handleSubmit(onSubmit)}>
                                            <div
                                                class="mb-3 position-relative">
                                                <input type={showPassword ? "text" : "password"}
                                                    className={`form-control ${errors.password ? "is-invalid" : ""
                                                        }`}
                                                    placeholder="Enter new password"
                                                    {...register("password", {
                                                        onBlur: () => trigger("password"),
                                                        onChange: () => trigger("password"),
                                                    })} />
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
                                            </div>

                                            <button
                                                class="btn mt-1 btn-primary w-100 px-lg-4 px-3">
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
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="col-lg-5 col-md-12 col-sm-12 col-12 d-flex align-items-center justify-content-end">
                            <div class="forgot_img">
                                <img src="images/reset_pwd.png" alt />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ResetPassword