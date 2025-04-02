import React from 'react';
import api from "../../services/axios-config";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

const GoogleSignIn = () => {

    // const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const CLIENT_ID = '725087358741-nsjp135ggdk2ojgttskgugmfb7ohivci.apps.googleusercontent.com';
    const navigate = useNavigate();

    const handleGoogleLoginSuccess = async (userDetails) => {
        try {
            const { data } = await api.post('/auth/google', userDetails);
            if (data) localStorage.setItem("userData", JSON.stringify(data.user));
            navigate("/code");
        } catch (error) {
            if (isAxiosError(error) && error.response) {
            }
        }
    };

    const onSuccess = (response) => {
        try {
            const decoded = jwtDecode(response.credential);
            handleGoogleLoginSuccess(decoded, "Google");
        } catch (error) {
        }
    };

    const onFailure = (response) => {
    };

    return (
        <div>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
                <GoogleLogin
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                />
            </GoogleOAuthProvider>
        </div>
    )
}

export default GoogleSignIn