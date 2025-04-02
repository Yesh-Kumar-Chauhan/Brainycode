import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import UserProfile from '../../../utils/UserProfile';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const userProfile = UserProfile();
    const navigate = useNavigate();

    localStorage.removeItem('userId')

    useEffect(() => {
        if (userProfile?.token || userProfile) {
            navigate("/code", { replace: false });
        } else {
            navigate("/success-password", { replace: false });
        }
    }, [userProfile?.token, navigate]);
    return (
        <div><section
            class="banner_section generate_banner forgot_flow login_section sign_up_screen position-relative d-flex align-items-center">
            <div class="container position-relative" style={{ zIndex: 9 }}>
                <div class="row position-relative g-3">
                    <div
                        class="col-lg-7 col-md-12 col-sm-12 col-12 mt-lg-0 mt-md-4 mt-4 px-lg-0 d-flex align-items-center">
                        <div class="inner_text w-100">
                            <h2 class="mb-4">Success!</h2>
                            <p class="m-0">Your password has been updated. Go
                                ahead, log in and enjoy the<br /> unparalleled
                                joy of not having to reset your password... for
                                now.</p>
                            <div class="row mt-4 pt-2">
                                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">
                                    <form class="login_form" >
                                        <Link to="/signin">
                                            <button
                                                class="btn btn-primary w-100 px-lg-4 px-3">Return
                                                to login page</button>
                                        </Link>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="col-lg-5 col-md-12 col-sm-12 col-12 d-flex align-items-center justify-content-end">
                        <div class="forgot_img">
                            <img src="images/success.png" alt />
                        </div>
                    </div>
                </div>
            </div>
        </section></div>
    )
}

export default Success