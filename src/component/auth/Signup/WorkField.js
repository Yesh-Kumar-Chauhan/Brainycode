import React, { useState, useEffect } from "react";

const WorkField = ({ onNext, onBack, formData }) => {
  const [organisation, setSelectedOption] = useState(null);
  const [error, setError] = useState('')

  const handleCheckboxChange = (value) => {
    setSelectedOption(value);
    // if(organisation !== null){
    //   setError('');
    // }
  };

  useEffect(() => {
    const formData = JSON.parse(localStorage.getItem("formData"));
    if (formData) {
      setSelectedOption(formData.organisation || null);
    }
  }, []);

  const formDataString = JSON.parse(localStorage.getItem("formData"));

  const onSubmit = (e) => {
  
    e.preventDefault();
    // if (organisation == null) {
    //   setError("Please select at least one option");
    // }
  
    const updatedFormData = {
      ...formDataString,
      // organisation: organisation,
      ...(organisation ? { organisation: organisation } : {}),
    };
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
    onNext();
  };

  return (
    <section className="banner_section generate_banner login_section sign_up_screen position-relative d-flex align-items-start">
      <div className="container position-relative" style={{ zIndex: 9 }}>
        <div className="row position-relative justify-content-center">
          <div className="col-lg-7 col-md-10 col-sm-12 col-12 mt-lg-0 mt-md-4 mt-4 px-lg-0">
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
                Field of Work
              </h2>
              <h5 className="text-center mt-3 pt-1 mb-0">
                Tell us what you do, but make it sound cool. We're all ears.
              </h5>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-7 col-sm-12 col-12">
                {/* <form className="login_form work_form" onSubmit={onSubmit}> */}
                <form className="login_form work_form" onSubmit={onSubmit}>
                  <div className="my-4 py-lg-3 px-3">
                    <div className="mb-3 pb-1 position-relative d-flex align-items-center gap-4">
                      <div className="custom_input">
                        <input
                          type="checkbox"
                          value="Student"
                          name="Select"
                          className="form-control"
                          // {...register("Select", {
                          //   onBlur: () => trigger("Select"),
                          //   onChange: () => trigger("Select"),
                          // })}
                          checked={organisation === "Student"}
                          onChange={() => handleCheckboxChange("Student")}
                        />
                        <label></label>
                      </div>
                      <label for>Student</label>
                    </div>
                    <div className="mb-3 pb-1 position-relative d-flex align-items-center gap-4">
                      <div className="custom_input">
                        <input
                          type="checkbox"
                          name="Select"
                          className="form-control"
                          // {...register("Select", {
                          //   onBlur: () => trigger("Select"),
                          //   onChange: () => trigger("Select"),
                          // })}
                          checked={
                            organisation === "Employed (Corporate ninja)"
                          }
                          onChange={() =>
                            handleCheckboxChange("Employed (Corporate ninja)")
                          }
                          value="Employed (Corporate ninja)"
                        />
                        <label></label>
                      </div>
                      <label for>Employed (Corporate ninja)</label>
                    </div>
                    <div className="mb-3 pb-1 position-relative d-flex align-items-center gap-4">
                      <div className="custom_input">
                        <input
                          type="checkbox"
                          name="Select"
                          className="form-control"
                          // {...register("Select", {
                          //   onBlur: () => trigger("Select"),
                          //   onChange: () => trigger("Select"),
                          // })}
                          checked={organisation === "Scientist (Lab wizard)"}
                          onChange={() =>
                            handleCheckboxChange("Scientist (Lab wizard)")
                          }
                          value="Scientist (Lab wizard)"
                        />
                        <label></label>
                      </div>
                      <label for>Scientist (Lab wizard)</label>
                    </div>
                    <div className="mb-3 pb-1 position-relative d-flex align-items-center gap-4">
                      <div className="custom_input">
                        <input
                          type="checkbox"
                          name="Select"
                          className="form-control"
                          // {...register("Select", {
                          //   onBlur: () => trigger("Select"),
                          //   onChange: () => trigger("Select"),
                          // })}
                          checked={organisation === "Engineer (Regular wizard)"}
                          onChange={() =>
                            handleCheckboxChange("Engineer (Regular wizard)")
                          }
                          value="Engineer (Regular wizard)"
                        />
                        <label></label>
                      </div>
                      <label for>Engineer (Regular wizard)</label>
                    </div>
                    <div className="position-relative d-flex align-items-center gap-4">
                      <div className="custom_input">
                        <input
                          type="checkbox"
                          name="Select"
                          className="form-control"
                          // {...register("Select", {
                          //   onBlur: () => trigger("Select"),
                          //   onChange: () => trigger("Select"),
                          // })}
                          checked={
                            organisation === "Spy (Just kidding... unless?)"
                          }
                          onChange={() =>
                            handleCheckboxChange(
                              "Spy (Just kidding... unless?)"
                            )
                          }
                          value="Spy (Just kidding... unless?)"
                        />
                        <label></label>
                      </div>
                      <label for>Spy (Just kidding... unless?)</label>
                    </div>
                  </div>
                  {/* {error && (
                    <div className="code_erro">
                      <p style={{ color: "#dc3545" }}>
                        {error}
                      </p>
                    </div>
                  )} */}
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
  );
};

export default WorkField;
