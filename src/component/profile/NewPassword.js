
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import api from "../../services/axios-config";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
const Schema = z.object({
    newPassword: z
        .string()
        .min(1, { message: "Password is required" })
        .refine(
            (value, data) =>
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                    value
                ),
            {
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
            }
        ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 

});

export const NewPassword = ({onCancel}) => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const [load, setLoad] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        reset
    } = useForm({
        resolver: zodResolver(Schema),
    });


    const onSubmit = async (values) => {
        setErrorMessage(null)
        if (values.newPassword !== values.confirmPassword) {
            return;
        }
        try {
              setLoad(true);
            const { data } = await api.post(`/auth/new-password?userId=${userData.id}`, values);
            if (!data) {
                return;
            }
            onCancel()
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data.message);
            };
        }
        setLoad(false);
        reset(); 

    };


    return (
        <>
                    <div class="row">
                        <div
                        class="col-lg-12 col-md-12 col-sm-12 col-12">
                        <form class="login_form mt-3 pt-1"
                            onSubmit={handleSubmit(onSubmit)}>
                            <div
                                class="mb-3 pb-1 w-100 position-relative">
                                <div class="row w-100">
                                    <div
                                        class="col-lg-2 d-flex align-items-start pt-3 col-md-12 col-sm-12 col-12">
                                        <label for
                                            class="text-nowrap pe-1 mb-lg-0 mb-md-0 mb-3">New
                                            password
                                            :</label>
                                    </div>
                                    <div
                                        class="col-lg-4 col-md-12 col-sm-12 col-12">
                                        <div
                                            class="position-relative w-100">
                                            <input
                                                className={`form-control ${errors.newPassword ? "is-invalid" : ""
                                                    }`}
                                                type="password"
                                                class="form-control"
                                                placeholder="----------"
                                                id="newPassword"
                                                {...register("newPassword", {
                                                    onBlur: () => trigger("newPassword"),
                                                    onChange: () => trigger("newPassword"),
                                                })} />
                                                 {errorMessage && <div className="text-danger">{errorMessage}</div>}
                                            {errors.newPassword && (
                                                <div className="invalid-feedback">
                                                    {errors.newPassword.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="row w-100 mt-2 pt-1">
                                    <div
                                        class="col-lg-2 d-flex align-items-center col-md-12 col-sm-12 col-12">
                                    </div>
                                    <div
                                        class="col-lg-4 col-md-12 col-sm-12 col-12">
                                        <div
                                            class="position-relative w-100">
                                            <input
                                                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""
                                                    }`}
                                                type="password"
                                                class="form-control"
                                                placeholder="----------"
                                                id="confirmPassword"
                                                {...register("confirmPassword", {
                                                    onBlur: () => trigger("confirmPassword"),
                                                    onChange: () => trigger("confirmPassword"),
                                                })} />
                                                 {errorMessage && <div className="text-danger">{errorMessage}</div>}
                                            {
                                            errors.confirmPassword && (
                                                <div className="invalid-feedback">
                                                    {errors.confirmPassword.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="row w-100 mt-3 pt-1">
                                    <div
                                        class="col-lg-2 d-flex align-items-center col-md-12 col-sm-12 col-12">
                                    </div>
                                    <div
                                        class="col-lg-4 col-md-12 col-sm-12 col-12">
                                        <div
                                            class="btn_group d-flex align-items-center flex-wrap gap-4">
                                            <button
                                                type="submit"
                                                className="btn   justify-content-center  btn-primary py-3 px-4"
                                                style={{ height: '48px', borderRadius: '48px', width: "100%", maxWidth: "177px" }}
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
                                                    "Save changes"
                                                )}
                                            </button>
                                            <button 
                                            onClick={onCancel}
                                                class="btn btn-outline-primary py-3 px-4"
                                                style={{ height: '48px', borderradius: '48px' }}
                                            >Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>

        </>
    )
}
