import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
// import { toast } from "react-toastify";
import api from "../../services/axios-config";
import { isAxiosError } from "axios";
import Modal from 'react-modal';
import GenerateVariable from "../model/GenerateVariable"
import AddFileColumn from "../model/AddFileColumns"

const Schema = z.object({
  type: z.string().min(1, { message: "Please select an option!" }),
  prompt: z.string().min(1, { message: "This field is required" }),
  language: z.string().min(1, { message: "Language is required" }),
  framework: z.string(),
})
  .refine((values) => {
    if (values && values.type === "boilerplate") {
      return values.framework && values.framework.length > 0;
    }
    return true;
  }, {
    message: "Framework is required for boilerplate",
    path: ["framework"]
  })

const Generate = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [generateError, setGenerateError] = useState(null)
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      type: "", // Set a default value for type
    }
  });

  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addColumnModel, setAddColumnModel] = useState(false);
  const [load, setLoad] = useState(false);
  const [isRadioSelected, setIsRadioSelected] = useState(false);
  const [fomData, setfomData] = useState({
    framework: "",
    language: "",
    prompt: "",
    type: "",
    inputType: "",
    inputVariable: "",
    outputType: "",
    outputVariable: "",

  })

  const [inputs, setInputs] = useState([
    { id: Math.random(), name: '' },
    { id: Math.random(), name: '' },
    { id: Math.random(), name: '' },
    { id: Math.random(), name: '' }
  ]);

  useEffect(() => {
    getLanguageData();
  }, []);

  const getLanguageData = async () => {
    try {
      const response = await api.get("/code/data");
      const data = response.data;
      const groupByLanguage = data.languages.reduce((acc, language) => {
        const key = language.language;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(language);
        return acc;
      }, {});
      setLanguages(groupByLanguage);

    } catch (error) {
      // toast.error(error);
    }
  };

  const handleLanguageChange = (selectedLanguage) => {
    setSelectedLanguage(selectedLanguage);
    setValue("framework", "");
  };

  const handleFrameworkChange = (selectedFramework) => {
    setSelectedFramework(selectedFramework);
  };

  const onSubmit = async (values) => {
    setGenerateError(null)
    setLoad(true);
    setfomData((state) => ({
      ...state,
      ...values
    }));
    const updatedFomData = {
      ...fomData,
      ...values
    };
    const columnInput = inputs.filter(x => x.name.trim() != '').map(x => x.name);
    if (columnInput.length > 0) {
      updatedFomData['columns'] = columnInput;
    }


    try {
      const { data } = await api.post(
        `/code/generate?userId=${userData.id}`,
        updatedFomData
      );

      if (!data) {
        // toast.error("Generate code failed!");
        return;
      }

      const { id : promptId } = data.prompt;
      if (values.type === "generate") {
        // toast.success("Generate code successful!");
        navigate("/thread", { replace: false });
      } else if (values.type === "boilerplate") {
        // toast.success("Boilerplate code successful!");
        //downloadZipFile(fileUrl);
        navigate("/thread", { replace: false });

      } else if (values.type === "custom") {
        // toast.success("Custom Board code generate successful!");
        localStorage.setItem("customPromptObject", JSON.stringify(updatedFomData));
        navigate(`/custom-board/${promptId}`, { replace: false });
      }

    } catch (error) {
      if (isAxiosError(error) && error.response) {
        // toast.error(error.message);
        setGenerateError('Code generation failed. Please try again.');
      }
    } finally {
      setLoad(false);
    }
  };

  const makeRequestWithRetry = async (url, data, retries, delay) => {
    try {
      return await api.post(url, data); // Attempt the request
    } catch (error) {
      if (isAxiosError(error) && retries > 0) {
        // Wait for a specified delay before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        // Retry the request with one less retry count
        return makeRequestWithRetry(url, data, retries - 1, delay);
      }

      setGenerateError('Code generation failed, Please try again.')
      // Re-throw the error if not a 504 or out of retries
      throw error;
    }
  };

  const openModal = (event) => {
    event.preventDefault();
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: modalIsOpen ? 1000 : -1,
    },
    content: {
      top: '0',
      left: '0',
      right: '0',
      bottom: 'auto',
      margin: 'auto',
      width: '50%',
      transform: 'translate(0%, 0%)',
      backgroundColor: '#fff',
      border: 'none',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      marginTop: "120px",
      borderRadius: "30px",
      // height: "500px"
    },
  };

  const openAddColumnModel = () => {
    console.log('fomData', fomData);
    setModalIsOpen(false);
    setAddColumnModel(true);
  }

  const addColumns = (inputColumn) => {
    console.log('fomData', fomData);
    setModalIsOpen(false);
    setAddColumnModel(false);
  }

  const handleRadioChange = () => {
    setIsRadioSelected(true);
  };

  return (
    <>
      <section className="generate_code_section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="creadits text-center">
                <h5 className="m-0">Get a custom embedded board with fully tested AI code customization for <b>20 Credits!</b></h5>
              </div>
              <div className="inner_text text-center mt-4 pt-lg-3 pt-2">
                <h2 className="mb-4 pb-lg-2">Generate your code here.</h2>
                <p className="m-0">
                  Type in your idea, or prompt, select the platform and specify
                  the language you
                  <br />
                  want to use for the generated code and simply hit ‘Generate’.
                </p>
              </div>
              <div className="tracking_form mt-lg-5 mt-md-4 mt-4 pt-lg-1">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div 
                  className="mt-0 code_steps" 
                    >
                    <label className="d-flex align-items-center justify-content-start gap-2">
                      <label className="custom_input_outer">
                        <input
                          type="radio"
                          value="generate"
                          id="generate"
                          {...register("type")
                          }
                          onChange={handleRadioChange}
                        />
                        <label className="custom_input"></label>
                      </label>
                      Generate a single piece of Code.
                    </label>
                    <label className="d-flex align-items-center justify-content-start gap-2">

                      <label className="custom_input_outer">
                        <input
                          type="radio"
                          value="boilerplate"
                          id="boilerplate"
                          {...register("type")
                          }
                          onChange={handleRadioChange}
                        />
                        <label className="custom_input"></label>
                      </label>
                      Generate boilerplate.
                    </label>
                    <label className="d-flex custom_board align-items-center justify-content-start gap-2">

                      <label className="custom_input_outer">
                        <input
                          type="radio"
                          value="custom"
                          id="custom"
                          {...register("type")
                          }
                          onChange={handleRadioChange}
                        />
                        <label className="custom_input"></label>
                      </label>
                      Custom board + code

                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="#FF13E5">
                        <path d="M7.26076 2.11472C7.51473 1.42839 8.48547 1.42839 8.73943 2.11472L10.0035 5.53082C10.0833 5.7466 10.2535 5.91673 10.4693 5.99657L13.8853 7.26064C14.5717 7.51461 14.5717 8.48534 13.8853 8.73931L10.4693 10.0034C10.2535 10.0832 10.0833 10.2534 10.0035 10.4691L8.73943 13.8852C8.48547 14.5716 7.51473 14.5716 7.26076 13.8852L5.99669 10.4691C5.91685 10.2534 5.74672 10.0832 5.53094 10.0034L2.11485 8.73931C1.42852 8.48534 1.42851 7.51461 2.11485 7.26064L5.53094 5.99657C5.74672 5.91673 5.91685 5.7466 5.99669 5.53082L7.26076 2.11472Z" stroke="#FF13E5" stroke-width="2" stroke-linejoin="round" />
                      </svg>
                    </label>
                  </div>
                  {/* {errors.type && (
                    <div className="code_erro">
                      <p style={{ color: "#dc3545" }}>
                        {errors.type.message}
                      </p>
                    </div>
                  )} */}
                  <div className="mb-1 pb-3 mt-4 pt-3">
                    <textarea
                      className={`form-control ${errors.prompt ? "is-invalid" : ""
                        }`}
                      placeholder="What’s brewing in your mind?"
                      id="prompt"
                      {...register("prompt", {
                        onBlur: () => trigger("prompt"),
                        onChange: () => trigger("prompt"),
                      })}
                    ></textarea>
                    {errors.prompt && (
                      <div className="invalid-feedback">
                        {errors.prompt.message}
                      </div>
                    )}
                  </div>
                  {inputs.some(input => input.name.trim() !== '') && (
                    <div className="row pb-3 mb-1">
                      <div className="col-12">
                        <div className="inner_text sign_up_img">
                          <h6>Column definition</h6>
                        </div>
                        <div>
                          <ul className="d-flex align-items-center gap-3 flex-wrap definition_col mt-3">
                            {inputs.map((input, index) => (
                              input.name.trim() !== '' && (
                                <li key={index}>
                                  {input.name}
                                </li>
                              )
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row g-4 justify-content-between">
                    <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                      <div className="position-relative select_outer">
                        <select
                          className={`form-select ${errors.language ? "is-invalid" : ""
                            }`}
                          aria-label="Default select example"
                          id="language"
                          {...register("language", {
                            onBlur: () => trigger("language"),
                            onChange: (e) => {
                              handleLanguageChange(e.target.value);
                              trigger("language");
                            },
                          })}
                        >
                          <option value="">Select language</option>
                          {Object.keys(languages).map((language) => (
                            <option
                              key={language}
                              value={language}
                            >
                              {language}
                            </option>
                          ))}
                        </select>
                        {errors.language && (
                          <div className="invalid-feedback generate_error">
                            {errors.language.message}
                          </div>
                        )}
                        <div className="dorpdown_icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                          >
                            <path
                              d="M26.96 31H5.04C3.96893 30.9987 2.94211 30.5726 2.18475 29.8153C1.42739 29.0579 1.00132 28.0311 1 26.96V5.04C1.00132 3.96893 1.42739 2.94211 2.18475 2.18475C2.94211 1.42739 3.96893 1.00132 5.04 1H26.96C28.0311 1.00132 29.0579 1.42739 29.8153 2.18475C30.5726 2.94211 30.9987 3.96893 31 5.04V26.96C30.9987 28.0311 30.5726 29.0579 29.8153 29.8153C29.0579 30.5726 28.0311 30.9987 26.96 31ZM5.04 3C4.49936 3.00132 3.98125 3.21667 3.59896 3.59896C3.21667 3.98125 3.00132 4.49936 3 5.04V26.96C3.00132 27.5006 3.21667 28.0188 3.59896 28.401C3.98125 28.7833 4.49936 28.9987 5.04 29H26.96C27.5006 28.9987 28.0188 28.7833 28.401 28.401C28.7833 28.0188 28.9987 27.5006 29 26.96V5.04C28.9987 4.49936 28.7833 3.98125 28.401 3.59896C28.0188 3.21667 27.5006 3.00132 26.96 3H5.04Z"
                              fill="black"
                            />
                            <path
                              d="M16.0001 20.565C15.7922 20.5651 15.5895 20.5004 15.4201 20.38L5.42007 13.255C5.31304 13.1788 5.22206 13.0823 5.15233 12.971C5.0826 12.8597 5.03548 12.7357 5.01365 12.6062C4.99183 12.4766 4.99574 12.3441 5.02515 12.216C5.05456 12.088 5.1089 11.967 5.18507 11.86C5.26123 11.753 5.35774 11.662 5.46906 11.5923C5.58039 11.5225 5.70436 11.4754 5.8339 11.4536C6.09551 11.4095 6.36392 11.4712 6.58007 11.625L16.0001 18.335L25.4201 11.625C25.6362 11.4712 25.9046 11.4095 26.1662 11.4536C26.4279 11.4977 26.6612 11.6438 26.8151 11.86C26.9689 12.0762 27.0306 12.3446 26.9865 12.6062C26.9424 12.8678 26.7962 13.1012 26.5801 13.255L16.5801 20.38C16.4107 20.5004 16.2079 20.5651 16.0001 20.565Z"
                              fill="black"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                      <div className="position-relative select_outer">
                        <select
                          className={`form-select ${errors.framework ? "is-invalid" : ""}`}
                          aria-label="Default select example"
                          id="framework"
                          {...register("framework", {
                            onBlur: () => trigger("framework"),
                            onChange: (e) => {
                              handleFrameworkChange(e.target.value);
                              trigger("framework");
                            },
                          })}
                        >
                          <option value="">Select framework</option>
                          {selectedLanguage &&
                            languages[selectedLanguage].map((el, i) => (
                              <option key={i} value={el.framework}>
                                {el.framework}
                              </option>
                            ))}
                        </select>
                        {errors.framework && (
                          <div className="invalid-feedback generate_error">
                            {errors.framework.message}
                          </div>
                        )}
                        <div className="dorpdown_icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                          >
                            <path
                              d="M26.96 31H5.04C3.96893 30.9987 2.94211 30.5726 2.18475 29.8153C1.42739 29.0579 1.00132 28.0311 1 26.96V5.04C1.00132 3.96893 1.42739 2.94211 2.18475 2.18475C2.94211 1.42739 3.96893 1.00132 5.04 1H26.96C28.0311 1.00132 29.0579 1.42739 29.8153 2.18475C30.5726 2.94211 30.9987 3.96893 31 5.04V26.96C30.9987 28.0311 30.5726 29.0579 29.8153 29.8153C29.0579 30.5726 28.0311 30.9987 26.96 31ZM5.04 3C4.49936 3.00132 3.98125 3.21667 3.59896 3.59896C3.21667 3.98125 3.00132 4.49936 3 5.04V26.96C3.00132 27.5006 3.21667 28.0188 3.59896 28.401C3.98125 28.7833 4.49936 28.9987 5.04 29H26.96C27.5006 28.9987 28.0188 28.7833 28.401 28.401C28.7833 28.0188 28.9987 27.5006 29 26.96V5.04C28.9987 4.49936 28.7833 3.98125 28.401 3.59896C28.0188 3.21667 27.5006 3.00132 26.96 3H5.04Z"
                              fill="black"
                            />
                            <path
                              d="M16.0001 20.565C15.7922 20.5651 15.5895 20.5004 15.4201 20.38L5.42007 13.255C5.31304 13.1788 5.22206 13.0823 5.15233 12.971C5.0826 12.8597 5.03548 12.7357 5.01365 12.6062C4.99183 12.4766 4.99574 12.3441 5.02515 12.216C5.05456 12.088 5.1089 11.967 5.18507 11.86C5.26123 11.753 5.35774 11.662 5.46906 11.5923C5.58039 11.5225 5.70436 11.4754 5.8339 11.4536C6.09551 11.4095 6.36392 11.4712 6.58007 11.625L16.0001 18.335L25.4201 11.625C25.6362 11.4712 25.9046 11.4095 26.1662 11.4536C26.4279 11.4977 26.6612 11.6438 26.8151 11.86C26.9689 12.0762 27.0306 12.3446 26.9865 12.6062C26.9424 12.8678 26.7962 13.1012 26.5801 13.255L16.5801 20.38C16.4107 20.5004 16.2079 20.5651 16.0001 20.565Z"
                              fill="black"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                      <button
                        type="submit"
                        className="btn btn-outline-primary align-items-center" onClick={openModal}
                      >Add input/output
                      </button>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                      <button
                        type="submit"
                        className="btn btn-primary align-items-center"
                        disabled={!isRadioSelected}
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
                          "Generate code"
                        )}
                      </button>

                    </div>
                    <div className="col-12">
                      <div className="code_genertae_error">
                        {generateError && <span className="text-danger">{generateError}</span>}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        className='login_modal'
      >
        <GenerateVariable
          fomData={fomData}
          closeModal={closeModal}
          setfomData={setfomData}
          openAddColumnModel={openAddColumnModel}
        />
      </Modal>

      <Modal
        isOpen={addColumnModel}
        // style={customStyles}
        className='login_modal'
      >
        <AddFileColumn
          addColumns={addColumns}
          inputs={inputs}
          setInputs={setInputs} />
      </Modal>

    </>
  );
};

export default Generate;