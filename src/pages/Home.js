import React, { useEffect } from 'react'
import UserProfile from '../utils/UserProfile'
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
    const userProfile = UserProfile();
    const navigate = useNavigate();

    useEffect(() => {
        if (userProfile?.token || userProfile) {
            navigate("/code", { replace: false });
        } else {
            navigate("/", { replace: false });
        }
    }, [userProfile?.token, navigate]);

    return (
        <div>
            <section
                className="banner_section generate_banner position-relative d-flex align-items-center">
                <div className="container position-relative" style={{ zIndex: 9 }}>
                    <div className="row pt-lg-5">
                        <div className="col-12 pt-lg-5 pt-md-4 pt-0">
                            <div className="banner_content">
                                <h1 className="m-0">Generate. Test. Review. Repeat.</h1>
                            </div>
                        </div>
                        <div
                            className="col-lg-5 col-md-7 col-sm-12 col-12 mt-lg-3 mt-md-3 mt-3">
                            <div className="banner_content">
                                <p>From your whimsical ideas to functional reality,
                                    let your imagination run wild as our tool
                                    effortlessly crafts code snippets.</p>
                            </div>
                            <Link to="/signin"
                                className="btn btn-primary inner_button mt-lg-5 mt-md-4 mt-4">Log in
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="bg_video">
                    <video autoPlay muted loop >
                        <source src="video/test-bg.mp4" type="video/mp4" />
                    </video>
                </div>
            </section>
        </div>
    )
}

export default Home