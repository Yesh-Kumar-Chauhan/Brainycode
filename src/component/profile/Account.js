import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/axios-config";
import { isAxiosError } from "axios";
import moment from "moment";
import Modal from "react-modal";
import ProfileEdit from "../model/ProfileEdit";
import { useUser, UserProvider } from "../../UserContext";

const editSchema = z.object({
    firstName: z
        .string()
        .min(1, { message: "Firstname is required" })
        .refine((value) => !/\d/.test(value), {
            message: "Firstname should not contain numbers",
        })
        .refine((value) => !/\s/.test(value), {
            message: "Firstname should not contain space",
        }),
    lastName: z
        .string()
        .min(1, { message: "Lastname is required" })
        .refine((value) => !/\d/.test(value), {
            message: "Lastname should not contain numbers",
        })
        .refine((value) => !/\s/.test(value), {
            message: "Lastname should not contain space",
        }),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email("Email is invalid"),
    gender: z.string().min(1, { message: "Gender is required" }),
    age: z
        .string()
        .min(1, { message: "Age is required" })
        .refine(
            (value) => {
                const age = parseInt(value);
                return age >= 1 && age <= 100;
            },
            { message: "Age must be between 1 and 100" }
        ),
});

const Account = () => {
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState("");
    const [userCredit, setUserCredit] = useState("");
    const { setUserData } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [load, setLoad] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue,
        getValues,
    } = useForm({
        resolver: zodResolver(editSchema),

    });

    useEffect(() => {
        const userCredit = JSON.parse(localStorage.getItem("userCredit"));
        setUserCredit(userCredit);

        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData) {
            setUsername(userData);
            const { firstName, lastName, email, gender, age } = userData;
            setValue("firstName", firstName || "");
            setValue("lastName", lastName || "");
            setValue("email", email || "");
            setValue("gender", gender || "");
            setValue("age", age ? age.toString() : "");
            trigger();
        }
    }, []);

    const handleEditPictureClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        setProfilePicture(userData?.profileUrl)
        setIsModalOpen(false);
    };

    const handleCancelEdit = () => {
        setShowConfirmation(true);
    };

    const handleConfirmCancel = () => {
        setEditMode(false);
        setShowConfirmation(false);
        resetModifiedFields();
    };

    const handleCancelConfirmation = () => {
        setShowConfirmation(false);
    };

    const resetModifiedFields = () => {
        const formValues = getValues(); // Get current form values
        // Reset only the modified fields
        Object.keys(formValues).forEach((key) => {
            if (formValues[key] !== username[key]) {
                setValue(key, username[key]); // Reset the field to original value
            }
        });
    };

    const onSubmit = async (values, e) => {
        e.preventDefault();
        setLoad(true);
        try {
            const data = await api.post(
                `/auth/account?userId=${username.id}`,
                values
            );
            if (!data) {
                toast.error("Changes failed!");
                return;
            }
            toast.success("Changes successful!");
            localStorage.removeItem("userData");
            localStorage.setItem("userData", JSON.stringify(data.data.user));
            setUsername(data.data.user);
            setUserData(data.data.user);
            navigate(0);
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.message);
            }
        } finally {
            setLoad(false);
        }
    };

    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: isModalOpen ? 1000 : -1,
        },
        content: {
            top: "100px",
            left: "0",
            right: "10px",
            bottom: "auto",
            margin: "auto",
            width: "30%",
            transform: "translate(0%, 0%)",
            backgroundColor: "#fff",
            border: "none",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            marginTop: "120px",
            borderRadius: "30px",
            // height: "500px"
        },
    };
    return (
        <div
            className="tab-pane fade show active"
            id="account-overview"
            role="tabpanel"
            aria-labelledby="account-overview-tab"
        >
            {editMode ? (
                <div className="overview_profile edit_profile">
                    <div className="d-lg-flex d-md-flex d-block align-items-center">
                        <div
                            className="profile_img position-relative"
                            onClick={handleEditPictureClick}
                        >
                            {profilePicture ? (
                                <img src={profilePicture} alt="Profile" />
                            ) : username.profileUrl ? (
                                <img src={username.profileUrl} alt="Profile" />
                            ) : (
                                <img src="images/blank-profile-picture.jpg" alt />
                            )}
                            <div className="edit_sign">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M12.324 1.90711C12.7144 1.51656 13.3474 1.51629 13.738 1.90651L16.0914 4.25727C16.4823 4.64766 16.4825 5.28098 16.092 5.67169L6.13422 15.635C5.99494 15.7743 5.81759 15.8694 5.62444 15.9084L1.19922 16.8L2.09247 12.3801C2.13142 12.1873 2.22634 12.0103 2.36535 11.8712L12.324 1.90711Z"
                                        stroke="#271353"
                                        stroke-width="2"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="profile_detail sign_up_img inner_text ms-lg-3 ps-lg-1 ms-md-3 ps-md-1 mt-lg-0 mt-md-0 mt-4">
                            <h5 className="mb-0">
                                Welcome, {username.firstName} {username.lastName}
                            </h5>
                            <p className="my-2">
                                {username.age}{" "}
                                {username.gender === "Male"
                                    ? "M"
                                    : username.gender === "Female"
                                        ? "F"
                                        : "Other"}
                                ,{username.organisation}
                            </p>
                            <p className="mb-0">
                                Member since {moment(username.createdAt).format("MMMM DD YYYY")}
                            </p>
                        </div>
                    </div>
                    <div className="inner_text sign_up_img mt-4 pt-lg-3">
                        <h5 className="mb-0">
                            <b>Edit account details</b>
                        </h5>
                    </div>
                    <div className="row">
                        <div className="col-lg-7 col-md-12 col-sm-12 col-12">
                            <form
                                className="login_form mt-3 pt-1"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div className="mb-3 pb-1 position-relative">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.firstName ? "is-invalid" : ""
                                                    }`}
                                                placeholder="First Name"
                                                id="firstName"
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
                                                type="number"
                                                className={`form-control ${errors.age ? "is-invalid" : ""
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
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div className="mb-3 pb-1 position-relative">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.lastName ? "is-invalid" : ""
                                                    }`}
                                                placeholder="Last Name"
                                                id="lastName"
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
                                        <div className="position-relative mb-3 pb-1 select_outer">
                                            <select
                                                className={`form-select ${errors.gender ? "is-invalid" : ""
                                                    }`}
                                                aria-label="Default select example"
                                                id="gender"
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
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div className="position-relative">
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
                                                readOnly
                                            />
                                            {errors.email && (
                                                <div className="invalid-feedback">
                                                    {errors.email.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="btn_group d-flex align-items-center flex-wrap gap-4 mt-4 pt-lg-3 pt-md-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-3 px-4"
                                        style={{
                                            height: "48px",
                                            maxWidth: "180px",
                                            borderRadius: "48px",
                                        }}
                                    >
                                        {load ? (
                                            <div className="w-100 align-items-center d-flex justify-content-center">
                                                <h1
                                                    className="loading-spinner"
                                                    style={{
                                                        color: "#101A36",
                                                        margin: "0",
                                                    }}
                                                ></h1>
                                            </div>
                                        ) : (
                                            " Save Changes"
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-primary py-3 px-4"
                                        style={{ height: "48px", borderradius: "48px" }}
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="overview_profile d-lg-flex d-md-flex d-block align-items-center">
                        <div className="profile_img">
                            {profilePicture ? (
                                <img src={profilePicture} alt="Profile" />
                            ) : username.profileUrl ? (
                                <img src={username.profileUrl} alt="Profile" />
                            ) : (
                                <img src="images/blank-profile-picture.jpg" alt />
                            )}
                        </div>
                        <div className="profile_detail sign_up_img inner_text ms-lg-3 ps-lg-1 ms-md-3 ps-md-1 mt-lg-0 mt-md-0 mt-4">
                            <h5 className="mb-0">
                                Welcome, {username.firstName} {username.lastName}{" "}
                            </h5>
                            <p className="my-2">
                                {username.age}{" "}
                                {username.gender === "Male"
                                    ? "M"
                                    : username.gender === "Female"
                                        ? "F"
                                        : "Other"}
                                , {username.organisation}
                            </p>
                            <p className="pb-1 mb-0">
                                Member since {moment(username.createdAt).format("MMMM DD YYYY")}
                            </p>
                            <div
                                className="edit_button mt-3 d-flex aling-items-center gap-1"
                                onClick={() => setEditMode(true)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M15.324 4.90711C15.7144 4.51656 16.3474 4.51629 16.738 4.90651L19.0914 7.25727C19.4823 7.64766 19.4825 8.28098 19.092 8.67169L9.13422 18.635C8.99494 18.7743 8.81759 18.8694 8.62444 18.9084L4.19922 19.8L5.09247 15.3801C5.13142 15.1873 5.22634 15.0103 5.36535 14.8712L15.324 4.90711Z"
                                        stroke="#271353"
                                        stroke-width="2"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                Edit
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 pt-lg-3 pt-md-3">
                        <div className="inner_text sign_up_img d-flex align-items-center">
                            <h5 className="m-0">
                                <b>Credits available :</b>{" "}
                                <img
                                    src="images/Credits.png"
                                    style={{ width: " 24px", height: "24px" }}
                                    className="ms-4"
                                    alt
                                />
                                <b className="ms-2">{userCredit}</b>
                            </h5>
                            <Link to="/buy-credit">
                                <button className="btn btn-outline-primary ms-4 ps-2 pe-3 py-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M11.9992 7.2L11.9992 16.8M16.7992 12L7.19922 12"
                                            stroke="black"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                        />
                                    </svg>
                                    Add Credits
                                </button>
                            </Link>
                        </div>
                    </div>
                </>
            )}

            <Modal
                isOpen={showConfirmation}
                onRequestClose={handleCancelConfirmation}
                contentLabel="Confirmation"
                className="login_modal"
            >
                <div
                    className="modal generate_modal show definition_modal code_submission justify-content-center align-items-lg-center align-items-md-start align-items-start  show"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body p-0">
                                <div className="inner_text sign_up_img">
                                    <h5 className="text-center">
                                        <b>Are you sure?</b>
                                    </h5>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-3 justify-content-center mt-4">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleConfirmCancel}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={handleCancelConfirmation}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                style={customStyles}
                contentLabel="Edit Profile Picture"
            >
                <ProfileEdit
                    handleCloseModal={handleCloseModal}
                    profilePicture={profilePicture}
                    setProfilePicture={setProfilePicture}
                />
            </Modal>
        </div>
    );
};

export default Account;
