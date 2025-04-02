import React, { useState } from "react";
import Select from "react-select";
// import { toast } from "react-toastify";
import api from "../../../services/axios-config";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

const WorkExpertise = ({ onBack }) => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [values, setValues] = useState([]);
  const [load, setLoad] = useState(false);
  const formData = JSON.parse(localStorage.getItem("formData"));

  const options = [
    { value: "python", label: "Python" },
    { value: "ml", label: "Machine Learning" },
    { value: "javascript", label: "JavaScript" },
    { value: "c#", label: "C#" },
    { value: "react", label: "React" },
    { value: "angular", label: "Angular" },
    { value: "node.js", label: "Node.js" },
    { value: "vue", label: "Vue" },
    { value: "fastapi", label: "FastApi" },
    { value: "django", label: "Django" },
    { value: "flask", label: "Flask" },
    { value: "pyramid", label: "Pyramid" },
  ];

  const [error, setError] = useState("");

  const handleChange = async (selectedOptions) => {
    setSelectedLanguage(selectedOptions);
    const technologies = selectedLanguage.map((option) => option.value);
    const value = {
      ...formData,
      technologies,
    };
    setValues(value);
    if (values.length !== 0) {
      setError("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (selectedLanguage.length === 0) {
      setError("Please select at least one option");
    } else {
      const technologies = selectedLanguage.map((option) => option.value);
      const values = {
        ...formData,
        technologies,
      };
      setLoad(true);
      try {
        const secretKey = "your-secret-key";
        const encryptedValues = AES.encrypt(
          JSON.stringify(values),
          secretKey
        ).toString();

        const { data } = await api.post("/auth/signup", {
          encryptedData: encryptedValues,
        });
        // localStorage.setItem('response', JSON.stringify(data));
        if (!data) console.log("Signup failed!");

        //  toast.error('Signup failed!');
        // toast.success('Sign up Successfully!');
        localStorage.removeItem("formData");
        navigate("/signin", { replace: false });
      } catch (error) {
        // localStorage.setItem('response', JSON.stringify(error));
        if (isAxiosError(error) && error.response) {
          // toast.error(error.response.data.message);
        }
      } finally {
        setLoad(false);
      }
    }
  };

  return (
    <section className="banner_section generate_banner login_section sign_up_screen position-relative d-flex align-items-start">
      <div className="container position-relative" style={{ zIndex: 9 }}>
        <div className="row position-relative justify-content-center">
          <div className="col-lg-8 col-md-10 col-sm-12 col-12 mt-lg-0 mt-md-4 mt-4 px-lg-0">
            <ul className="sign_up_steps gap-lg-3 gap-md-3 gap-2 d-flex align-items-center justify-content-between px-lg-3 px-md-3 px-0 mb-4 pb-lg-3">
              <li className="d-flex filled align-items-center justify-content-center flex-column">
                <label className="custom_input_outer d-flex align-items-center justify-content-center">
                  <input
                    name="GenerateType"
                    type="radio"
                    value="architecture"
                    disabled
                  />
                  <label className="custom_input"></label>
                </label>
                <div className="filled_icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                  >
                    <rect
                      x="0.5"
                      width="32"
                      height="32"
                      rx="16"
                      fill="#B4F43D"
                    />
                    <path
                      d="M20.9686 13.1313L14.9 19.2L12.8313 17.1313M16.5 3.19995C9.43071 3.19995 3.69995 8.93071 3.69995 16C3.69995 23.0692 9.43071 28.7999 16.5 28.7999C23.5692 28.7999 29.2999 23.0692 29.2999 16C29.2999 8.93071 23.5692 3.19995 16.5 3.19995Z"
                      stroke="#271353"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div className="mt-2">General details</div>
              </li>
              <li className="d-flex filled align-items-center justify-content-center flex-column">
                <label className="custom_input_outer d-flex align-items-center justify-content-center">
                  <input
                    name="GenerateType"
                    type="radio"
                    value="architecture"
                    disabled
                  />
                  <label className="custom_input"></label>
                </label>
                <div className="filled_icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                  >
                    <rect
                      x="0.5"
                      width="32"
                      height="32"
                      rx="16"
                      fill="#B4F43D"
                    />
                    <path
                      d="M20.9686 13.1313L14.9 19.2L12.8313 17.1313M16.5 3.19995C9.43071 3.19995 3.69995 8.93071 3.69995 16C3.69995 23.0692 9.43071 28.7999 16.5 28.7999C23.5692 28.7999 29.2999 23.0692 29.2999 16C29.2999 8.93071 23.5692 3.19995 16.5 3.19995Z"
                      stroke="#271353"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div className="mt-2">Field of work</div>
              </li>
              <li className="d-flex active align-items-center justify-content-center flex-column">
                <label className="custom_input_outer d-flex align-items-center justify-content-center">
                  <input
                    name="GenerateType"
                    type="radio"
                    value="architecture"
                    checked
                    disabled
                  />
                  <label className="custom_input"></label>
                </label>
                <div className="filled_icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                  >
                    <rect
                      x="0.5"
                      width="32"
                      height="32"
                      rx="16"
                      fill="#B4F43D"
                    />
                    <path
                      d="M20.9686 13.1313L14.9 19.2L12.8313 17.1313M16.5 3.19995C9.43071 3.19995 3.69995 8.93071 3.69995 16C3.69995 23.0692 9.43071 28.7999 16.5 28.7999C23.5692 28.7999 29.2999 23.0692 29.2999 16C29.2999 8.93071 23.5692 3.19995 16.5 3.19995Z"
                      stroke="#271353"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div className="mt-2">Expertise in tech</div>
              </li>
            </ul>
            <div className="sign_up_img inner_text">
              <h2 className="text-center m-0 position-relative">
                <div className="back_arrow">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={onBack}
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
                Your Tech Arsenal
              </h2>
              <h5 className="text-start mt-3 pt-1 mb-0">
                What technologies are you good with? Let us know your expertise,
                even if it's just making the perfect cup of coffee using a smart
                kettle.
              </h5>
            </div>
            <form className="login_form work_form">
              <div className="my-4 py-lg-3">
                <div className="tech_container">
                  <ul className="d-flex gap-2">
                    <Select
                      options={options}
                      isMulti
                      value={selectedLanguage}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      placeholder="Select your expertise..."
                    />
                  </ul>
                </div>
                {error && (
                  <div className="code_erro">
                    <p style={{ color: "#dc3545" }}>{error}</p>
                  </div>
                )}
              </div>
              <div className="hint mb-4 pb-3">
                <p className="m-0 text-center">
                  Hint: Type in the box and press 'Enter' to add. Feel free to
                  boast; this is a bragging zone.
                </p>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-5 col-md-7 col-sm-12 col-12">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    onClick={onSubmit}
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
                      "Submit to AI Gods"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkExpertise;
