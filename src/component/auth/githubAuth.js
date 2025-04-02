import React from "react";
import api from "../../services/axios-config";
import GitHubLogin from "react-github-login";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

const GitHubSignIn = () => {

  // const CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
  const CLIENT_ID = 'd3574a70f71cdd955be0';
  const navigate = useNavigate();

  const sendCodeAndSignup = async (code) => {
    try {
      const { data } = await api.post('/auth/callback/github', code);
      if (data) localStorage.setItem("userData", JSON.stringify(data.user));
      navigate("/code");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
      }
    }
  };


  const onSuccess = async (response) => {
    sendCodeAndSignup(response)
  };

  const onFailure = (response) => {
  };

  return (
    <div>
      <GitHubLogin
        className="btn w-100 px-2 btn-primary inner_button github_btn"
        clientId={CLIENT_ID}
        onSuccess={onSuccess}
        onFailure={onFailure}
        buttonText='Sign in with Github'
        // redirectUri="http://localhost:3000/api/auth/callback/github"
        redirectUri="https://brainycode.software/api/auth/callback/github"
        scope="user"
      />
    </div>
  );
};

export default GitHubSignIn;