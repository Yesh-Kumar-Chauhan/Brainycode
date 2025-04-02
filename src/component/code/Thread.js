import React, { useState, useEffect } from "react";
import api from "../../services/axios-config";
import moment from "moment";
import CodeViewer from "./CodeViewer";
// import { toast } from "react-toastify";
import TestReview from "../model/TestReview";
import SuccessReview from "../model/SuccessReview";
import Modal from "react-modal";
import { isAxiosError } from "axios";
import UploadFile from "../model/UploadFile";
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../services/axios-config';
import { useUser } from "../../UserContext";

// Define a custom validation for the file
const fileSchema = z.object({
  file: z.instanceof(File).refine(file => {
    // Check the file type or extension
    return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.name.endsWith('.csv');
  }, {
    message: "Unsupported file type. Only .csv and .xlsx files are allowed.",
  })
});

const Thread = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [prompts, setPrompts] = useState([]);
  const [CodeIndex, setCodeIndex] = useState(0);
  const [load, setLoad] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [codeData, setCodeData] = useState({
    code: "",
    language: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modelStep, setModelStep] = useState(1);
  const [selectedReviewPlan, setSelectedReviewPlan] = useState(null);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [uploadReviewForm, setUploadReviewForm] = useState({
    file: null,
    description: ''
  });
  const { profile } = useUser();


  useEffect(() => {
    getCodeData();
  }, []);

  const getCodeData = async () => {
    try {
      setLoad(true);
      const [promptsResponse] = await Promise.all([
        api.get(`/code?userId=${userData.id}`),
      ]);

      const {
        data: { prompts },
      } = promptsResponse;

      if (!prompts) {
        // toast.error("Failed to fetch prompts");
        return;
      }
      
      if (prompts.length > 0) {
        const framework = prompts[0].languageDetails.framework || prompts[0].languageDetails.language;

        if (prompts[0].isUploaded) {
          const {
            data: { code },
          } = await api.get(
            `/code/prompt-code?userId=${userData.id}&promptId=${prompts[0].id}`
          );

          if (!code) {
            // toast.error("Failed to fetch prompt code");
            return;
          }

          setCodeData({
            code: code.code,
            language: framework
          });

        }
        else {
          streamGeneratedCode(prompts[0].finalPrompt, framework).then(async (finalCode) => {
            console.log('Streaming complete.')
            const uploadObj = {
              type: prompts[0].type,
              promptId: prompts[0].id,
              generatedPromptCode: finalCode,
              language : prompts[0]?.languageDetails?.language,
              framework : prompts[0]?.languageDetails?.framework
            }
            const { data: { code } } = await api.post(`/code/upload-code?userId=${userData.id}`, uploadObj);

            if (!code) {
              // toast.error("Failed to fetch prompt code");
              return;
            }

            const { fileUrl, promptId, file } = code;
            if (prompts[0].type == "boilerplate") {
              downloadZipFile(fileUrl);
            }
            console.log('code uploaded successfully', fileUrl, promptId, file);
          });
        }

        setPrompts(prompts);
        setCodeIndex(0);
        setActiveSectionId(prompts[0].id);
      }

    } catch (error) {
      if (isAxiosError(error) && error.response) {
        // toast.error(error.response.data.message);
      } else {
        // toast.error(error.message);
      }
    } finally {
      setLoad(false);
    }
  };

  async function streamGeneratedCode(prompt, framework) {
    const response = await fetch(`${BASE_URL}/code/generate-code`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let finalCode = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        console.log('Received chunk:', chunk);
        finalCode += chunk;

        setCodeData((state) => ({
          code: state.code + chunk,
          language: framework,
        }));
      }
    } catch (error) {
      console.error('Streaming failed', error);
    } finally {
      reader.releaseLock();
    }

    return finalCode;
  }


  const downloadZipFile = async (fileUrl) => {
    try {
      if (fileUrl) {
        // const fileUrl = response.code.fileUrl;
        window.open(fileUrl, "_self");
      } else {
        // toast.error("Invalid response received from the API");
      }
    } catch (error) {
      // toast.error("Error handling the download:", error);
    }
  };

  const handleCodeId = async (id) => {
    try {
     
      setLoad(true);
      const index = prompts.findIndex((x) => x.id == id);
      const languageFramework = prompts[index].languageDetails.framework || prompts[index].languageDetails.language;
      setCodeData((state) => ({
        code: '',
        language: languageFramework,
      }));
      debugger
      if (prompts[index].isUploaded) {
        const {
          data: { code },
        } = await api.get(
          `/code/prompt-code?userId=${userData.id}&promptId=${id}`
        );

        if (!code) {
          // toast.error("Failed to fetch prompt code");
          return;
        }

        setCodeData({
          code: code.code,
          language: languageFramework,
        });
      }
      else { //If prompt is not uploaded on s3
        streamGeneratedCode(prompts[index].finalPrompt, languageFramework).then(async (finalCode) => {
          console.log('Streaming complete.')
          const uploadObj = {
            type: prompts[index].type,
            promptId: id,
            generatedPromptCode: finalCode
          }
          const { data: { code } } = await api.post(`/code/upload-code?userId=${userData.id}`, uploadObj);

          if (!code) {
            // toast.error("Failed to fetch prompt code");
            return;
          }
          prompts[index].isUploaded = true;
          setPrompts(prompts);
          const { fileUrl, promptId, file } = code;
          console.log('code uploaded successfully', fileUrl, promptId, file);
        });
      }

      setActiveSectionId(id);
      setCodeIndex(index);

    } catch (error) {
      if (isAxiosError(error) && error.response) {
        // toast.error(error.response.data.message);
      } else {
        // toast.error(error.message);
      }
    } finally {
      setLoad(false);
    }
  };
  const handleCustomClick = () => {
    const id = prompts[CodeIndex]?.id;
    navigate(`/custom-board/${id}`);
  };

  const RegeneratePost = async () => {
    try {
      setLoad(true);
      const prompt = prompts[CodeIndex];
      const { data } = await api.post(`code/regenerate?userId=${userData.id}`, {
        prompt,
      });
      if (!data) {
        // toast.error("Failed to regenerate prompt code");
      }
      const promptIndex = prompts.findIndex(
        (x) => x.id == data.regeneratePrompt.id
      );
      prompts[promptIndex] = data.regeneratePrompt;

      setCodeData((state) => ({ code: data.regeneratePrompt.code, language: prompt.languageDetails.framework || prompt.languageDetails.language, }));
      const newPrompts = prompts;
      setPrompts((state) => [...newPrompts]);
      console.log("Prompt regenerated successfully");
    } catch (error) {
      console.error("Error regenerating prompt:", error);
    }
    finally {
      setLoad(false);
    }
  };

  const handleCopyCode = () => {
    const codeToCopy = codeData.code;
    navigator.clipboard
      .writeText(codeToCopy)
      .then(() => {
        setCopyButtonText('Copied');
        setTimeout(() => setCopyButtonText('Copy'), 3000); // Reset button text after 3 seconds
      })
      // toast.success("Code copied successfully"))
      .catch((error) => console.error("Could not copy prompts: ", error));
  };

  const handleDownloadCode = () => {
    const codeToDownload = codeData?.code;
    const element = document.createElement("a");
    const file = new Blob([codeToDownload], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "prompts.txt";
    document.body.appendChild(element);
    element.click();
  };

  const today = new Date();
  const todayDateString = today.toISOString().split("T")[0];
  const last30Days = moment().subtract(30, "days").format("YYYY-MM-DD");

  function getDateRangeFromYesterdayToOneWeekAgo() {
    const todayDateString = today.toISOString().split("T")[0];
    const oneWeekAgo = moment(todayDateString)
      .subtract(1, "weeks")
      .format("YYYY-MM-DD");
    return { start: todayDateString, end: oneWeekAgo };
  }

  const openModal = (event) => {
    event.preventDefault();
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModelStep(1);
  };

  const testReview = async (subs) => {
    setModelStep(2);
    setSelectedReviewPlan(subs)
  };

  const getUserData = async () => {
    try {
      const response = await api.get(
        `/subscription/credit?userId=${userData.id}`
      );
      // localStorage.setItem("userCredits", response.data.userCredit.credits);
    } catch (error) {
      // toast.error(error);
    }
  };

  const handleUploadAndReview = async (event, withoutFile = false) => {
    event.preventDefault();
    try {
      const promptId = prompts[CodeIndex].id;
      const reviewPlan = {
        ...selectedReviewPlan,
        promptId,
        fileDescription: uploadReviewForm.description
      }
      const formData = new FormData();
      if (uploadReviewForm.file && !withoutFile) {
        formData.append('file', uploadReviewForm.file);
      }
      formData.append('reviewPlan', JSON.stringify(reviewPlan));

      const response = await api.post(`/subscription/review?userId=${userData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data;
      if (!data) {
        // toast.error('Failed to review prompt')
      }
      prompts[CodeIndex].PromptReviews.push(response.data?.reviewPrompt);
      setPrompts(prompts);
      setModelStep(3);
      setSelectedReviewPlan(null)
      setUploadReviewForm({
        file: null,
        description: ''
      })
      getUserData();

    } catch (error) {
      // toast.error(error.response?.data?.message);
    }
  }

  console.log("prompts", { prompts });
  return (
    <>
      <div>
        {load ? (
          <div className="w-100 page_loader align-items-center d-flex justify-content-center">
            <h1
              className="loading-spinner"
              style={{
                color: "#101A36",
                margin: "0",
                backdropFilter: "blur(8px)",
              }}
            ></h1>
          </div>
        ) : (
          ""
        )}
        <section className="generate_code_section  pe-xl-4 pe-lg-0 thread_page">
          <div className="container-fluid pe-xl-5">
            <div className="dashboard_page">
              <aside className="sidebar">
                <div className="sidebar_logo d-flex align-items-center justify-content-center py-4">
                  <a>
                    <img src="images/inner_logo.png" alt="" />
                    {/* <img src={innerLogo} alt="" /> */}
                  </a>
                </div>
                <div className="sidebar_menu">
                  <ul>

                    <li style={{ color: "white" }}>
                      {prompts.some(
                        (section) =>
                          moment(section.createdAt).format("YYYY-MM-DD") ===
                          todayDateString
                      ) ? (
                        <>
                          Today
                          <ul>
                            {prompts
                              .filter(
                                (section) =>
                                  moment(section.createdAt).format(
                                    "YYYY-MM-DD"
                                  ) === todayDateString
                              )
                              .map((section, index) => (
                                <li
                                  key={index}
                                  className={
                                    prompts.findIndex(
                                      (data) => data.id === section.id
                                    ) === index
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <a
                                    className={
                                      activeSectionId === section.id
                                        ? "active"
                                        : ""
                                    }
                                    onClick={() => handleCodeId(section.id)}
                                  >
                                    {section.prompt}
                                  </a>
                                </li>
                              ))}
                          </ul>
                        </>
                      ) : null}
                    </li>

                    <li style={{ color: "white" }}>
                      {prompts.some((section) =>
                        moment(section.createdAt).isBetween(
                          getDateRangeFromYesterdayToOneWeekAgo().end,
                          getDateRangeFromYesterdayToOneWeekAgo().start,
                          null,
                          "[]"
                        )
                      ) ? (
                        <>
                          This Week
                          <ul>
                            {prompts
                              .filter((section) =>
                                moment(section.createdAt).isBetween(
                                  getDateRangeFromYesterdayToOneWeekAgo().end,
                                  getDateRangeFromYesterdayToOneWeekAgo().start,
                                  null,
                                  "[]"
                                )
                              )
                              .map((section, index) => (
                                <li key={index}>
                                  <a
                                    className={
                                      activeSectionId === section.id
                                        ? "active"
                                        : ""
                                    }
                                    onClick={() => handleCodeId(section.id)}
                                  >
                                    {section.prompt}
                                  </a>
                                </li>
                              ))}
                          </ul>
                        </>
                      ) : null}
                    </li>

                    <li style={{ color: "white" }}>
                      {prompts.some(
                        (section) =>
                          moment(section.createdAt).format("YYYY-MM-DD") ===
                          last30Days
                      ) && (
                          <>
                            Last 30 days
                            <ul>
                              {prompts
                                .filter(
                                  (section) =>
                                    moment(section.createdAt).format(
                                      "YYYY-MM-DD"
                                    ) === last30Days
                                )
                                .map((section, index) => (
                                  <li key={index}>
                                    <a
                                      className={
                                        activeSectionId === section.id
                                          ? "active"
                                          : ""
                                      }
                                      onClick={() => handleCodeId(section.id)}
                                    >
                                      {section.prompt}
                                    </a>
                                  </li>
                                ))}
                            </ul>
                          </>
                        )}
                    </li>
                  </ul>
                </div>
              </aside>
              <div className="page_data thread">
                <div className="row">
                  <div className="col-12">
                    <div className="prompt_detail d-flex align-items-center gap-4 p-lg-4 p-md-3 p-0 mb-4">
                      {profile ? (
                        <img src={profile}
                          width="40px" height="40px" style={{ borderRadius: "50%" }}
                        />
                      ) : (
                        userData.profileUrl ? (
                          <img src={userData.profileUrl} width="40px" height="40px" style={{ borderRadius: "50%" }} />
                        ) : (
                          <img src="images/blank-profile-picture.jpg" width="40px" height="40px" style={{ borderRadius: "50%" }} />
                        )
                      )}
                      <div>
                        <h3>Your prompt</h3>
                        <p>{prompts[CodeIndex]?.prompt}</p>
                      </div>
                    </div>

                    <div className="brainycode_outer mt-2">
                      <div className="code_icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                        >
                          <circle cx="20" cy="20" r="20" fill="#1D1A2F" />
                          <mask
                            id="mask0_308_523"
                            style={{ maskType: "alpha" }}
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="40"
                            height="40"
                          >
                            <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
                          </mask>
                          <g mask="url(#mask0_308_523)">
                            <path
                              d="M18.1251 22.3125C17.8765 22.3125 17.638 22.2137 17.4622 22.0379C17.2864 21.8621 17.1876 21.6236 17.1876 21.375C17.1876 21.1264 17.0888 20.8879 16.913 20.7121C16.7372 20.5363 16.4988 20.4375 16.2501 20.4375C16.0015 20.4375 15.763 20.5363 15.5872 20.7121C15.4114 20.8879 15.3126 21.1264 15.3126 21.375C15.3126 21.6236 15.2138 21.8621 15.038 22.0379C14.8622 22.2137 14.6238 22.3125 14.3751 22.3125C12.5845 22.3125 13.4376 18.5625 16.2501 18.5625C19.0626 18.5625 19.9251 22.3125 18.1251 22.3125ZM25.6251 22.3125C25.3765 22.3125 25.138 22.2137 24.9622 22.0379C24.7864 21.8621 24.6876 21.6236 24.6876 21.375C24.6876 21.1264 24.5888 20.8879 24.413 20.7121C24.2372 20.5363 23.9988 20.4375 23.7501 20.4375C23.5015 20.4375 23.263 20.5363 23.0872 20.7121C22.9114 20.8879 22.8126 21.1264 22.8126 21.375C22.8126 21.6236 22.7138 21.8621 22.538 22.0379C22.3622 22.2137 22.1238 22.3125 21.8751 22.3125C20.0845 22.3125 20.9376 18.5625 23.7501 18.5625C26.5626 18.5625 27.4251 22.3125 25.6251 22.3125Z"
                              fill="#B4F43D"
                            />
                            <path
                              d="M30.3125 34.5H24.6875V32.625H27.5C28.2459 32.625 28.9613 32.3287 29.4887 31.8012C30.0162 31.2738 30.3125 30.5584 30.3125 29.8125V28.875H31.25C31.9959 28.875 32.7113 28.5787 33.2387 28.0512C33.7662 27.5238 34.0625 26.8084 34.0625 26.0625V12.9375C34.0625 12.6889 33.9637 12.4504 33.7879 12.2746C33.6121 12.0988 33.3736 12 33.125 12C32.8764 12 32.6379 12.0988 32.4621 12.2746C32.2863 12.4504 32.1875 12.6889 32.1875 12.9375V19.6688C31.5798 19.489 30.9425 19.4317 30.3125 19.5V16.6875C30.3125 15.9416 30.0162 15.2262 29.4887 14.6988C28.9613 14.1713 28.2459 13.875 27.5 13.875H12.5C11.7541 13.875 11.0387 14.1713 10.5113 14.6988C9.98382 15.2262 9.6875 15.9416 9.6875 16.6875V19.5C9.05748 19.4334 8.42051 19.4907 7.8125 19.6688V12.9375C7.8125 12.6889 7.71373 12.4504 7.53791 12.2746C7.3621 12.0988 7.12364 12 6.875 12C6.62636 12 6.3879 12.0988 6.21209 12.2746C6.03627 12.4504 5.9375 12.6889 5.9375 12.9375V26.0625C5.9375 26.8084 6.23382 27.5238 6.76126 28.0512C7.28871 28.5787 8.00408 28.875 8.75 28.875H9.6875V29.8125C9.6875 30.5584 9.98382 31.2738 10.5113 31.8012C11.0387 32.3287 11.7541 32.625 12.5 32.625H15.3125V34.5H9.6875C8.4443 34.5 7.25201 34.9939 6.37294 35.8729C5.49386 36.752 5 37.9443 5 39.1875L5 41.0625C5 41.3111 5.09877 41.5496 5.27459 41.7254C5.4504 41.9012 5.68886 42 5.9375 42H9.6875C9.93614 42 10.1746 41.9012 10.3504 41.7254C10.5262 41.5496 10.625 41.3111 10.625 41.0625C10.625 40.8139 10.5262 40.5754 10.3504 40.3996C10.1746 40.2238 9.93614 40.125 9.6875 40.125H6.875V39.1875C6.875 38.4416 7.17132 37.7262 7.69876 37.1988C8.22621 36.6713 8.94158 36.375 9.6875 36.375H30.3125C31.0584 36.375 31.7738 36.6713 32.3012 37.1988C32.8287 37.7262 33.125 38.4416 33.125 39.1875V40.125H13.4375C13.1889 40.125 12.9504 40.2238 12.7746 40.3996C12.5988 40.5754 12.5 40.8139 12.5 41.0625C12.5 41.3111 12.5988 41.5496 12.7746 41.7254C12.9504 41.9012 13.1889 42 13.4375 42H34.0625C34.3111 42 34.5496 41.9012 34.7254 41.7254C34.9012 41.5496 35 41.3111 35 41.0625V39.1875C35 37.9443 34.5061 36.752 33.6271 35.8729C32.748 34.9939 31.5557 34.5 30.3125 34.5ZM19.0625 30.75V27H20.9375V30.75H19.0625ZM15.3125 30.75V27.9375C15.3125 27.6889 15.4113 27.4504 15.5871 27.2746C15.7629 27.0988 16.0014 27 16.25 27H17.1875V30.75H15.3125ZM22.8125 30.75V27H23.75C23.9986 27 24.2371 27.0988 24.4129 27.2746C24.5887 27.4504 24.6875 27.6889 24.6875 27.9375V30.75H22.8125ZM31.25 21.375C31.4986 21.375 31.7371 21.4738 31.9129 21.6496C32.0887 21.8254 32.1875 22.0639 32.1875 22.3125V26.0625C32.1875 26.3111 32.0887 26.5496 31.9129 26.7254C31.7371 26.9012 31.4986 27 31.25 27H30.3125V21.375H31.25ZM8.75 27C8.50136 27 8.2629 26.9012 8.08709 26.7254C7.91127 26.5496 7.8125 26.3111 7.8125 26.0625V22.3125C7.8125 22.0639 7.91127 21.8254 8.08709 21.6496C8.2629 21.4738 8.50136 21.375 8.75 21.375H9.6875V27H8.75ZM11.5625 29.8125V16.6875C11.5625 16.4389 11.6613 16.2004 11.8371 16.0246C12.0129 15.8488 12.2514 15.75 12.5 15.75H27.5C27.7486 15.75 27.9871 15.8488 28.1629 16.0246C28.3387 16.2004 28.4375 16.4389 28.4375 16.6875V29.8125C28.4375 30.0611 28.3387 30.2996 28.1629 30.4754C27.9871 30.6512 27.7486 30.75 27.5 30.75H26.5625V27.9375C26.5625 27.1916 26.2662 26.4762 25.7387 25.9488C25.2113 25.4213 24.4959 25.125 23.75 25.125H16.25C15.5041 25.125 14.7887 25.4213 14.2613 25.9488C13.7338 26.4762 13.4375 27.1916 13.4375 27.9375V30.75H12.5C12.2514 30.75 12.0129 30.6512 11.8371 30.4754C11.6613 30.2996 11.5625 30.0611 11.5625 29.8125ZM17.1875 34.5V32.625H22.8125V34.5H17.1875Z"
                              fill="#B4F43D"
                            />
                          </g>
                        </svg>
                      </div>
                      <div className="code_details thread_code">
                        <h3>BrainyCode</h3>
                        <div className="btn-group mt-3">
                          {(prompts[CodeIndex]?.PromptReviews[0] && prompts[CodeIndex]?.PromptReviews[0].status) && (
                            <button
                              className="btn btn-primary dark_btn"
                              disabled
                            >
                              {prompts[CodeIndex]?.PromptReviews[0].status === "Pending" ? 'In Review' : prompts[CodeIndex]?.PromptReviews[0].status}
                            </button>
                          )}
                          <button
                            className="btn btn-primary"
                            onClick={handleCopyCode}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 17 17"
                              fill="none"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M2.12367 2.12367C2.20285 2.04448 2.31024 2 2.42222 2H8.82222C8.9342 2 9.04159 2.04448 9.12078 2.12367C9.19996 2.20285 9.24444 2.31024 9.24444 2.42222V3.13333C9.24444 3.68562 9.69216 4.13333 10.2444 4.13333C10.7967 4.13333 11.2444 3.68562 11.2444 3.13333V2.42222C11.2444 1.77981 10.9892 1.16371 10.535 0.709452C10.0807 0.255198 9.46463 0 8.82222 0H2.42222C1.77981 0 1.16371 0.255198 0.709452 0.709452C0.255198 1.16371 0 1.77981 0 2.42222V8.82222C0 9.46463 0.255198 10.0807 0.709452 10.535C1.16371 10.9892 1.77981 11.2444 2.42222 11.2444H3.13333C3.68562 11.2444 4.13333 10.7967 4.13333 10.2444C4.13333 9.69216 3.68562 9.24444 3.13333 9.24444H2.42222C2.31024 9.24444 2.20285 9.19996 2.12367 9.12077C2.04448 9.04159 2 8.9342 2 8.82222V2.42222C2 2.31024 2.04448 2.20285 2.12367 2.12367ZM6.97786 7.4C6.97786 7.16682 7.1669 6.97778 7.40008 6.97778H13.8001C14.0333 6.97778 14.2223 7.16682 14.2223 7.4V13.8C14.2223 14.0332 14.0333 14.2222 13.8001 14.2222H7.40008C7.1669 14.2222 6.97786 14.0332 6.97786 13.8V7.4ZM7.40008 4.97778C6.06233 4.97778 4.97786 6.06225 4.97786 7.4V13.8C4.97786 15.1378 6.06233 16.2222 7.40008 16.2222H13.8001C15.1378 16.2222 16.2223 15.1378 16.2223 13.8V7.4C16.2223 6.06225 15.1378 4.97778 13.8001 4.97778H7.40008Z"
                                fill="black"
                              />
                            </svg>
                            {copyButtonText}
                          </button>
                          <button
                            className="btn btn-primary" 
                            onClick={handleDownloadCode}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 17 16"
                              fill="none"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M8.22169 12C8.09025 12.0007 7.95996 11.9755 7.83828 11.9258C7.71644 11.876 7.60563 11.8027 7.51219 11.71L3.51219 7.71C3.34836 7.5187 3.26275 7.27262 3.27247 7.02094C3.2822 6.76927 3.38653 6.53053 3.56462 6.35243C3.74272 6.17434 3.98146 6.07001 4.23313 6.06029C4.48481 6.05056 4.73088 6.13617 4.92219 6.3L7.22217 8.59301V1C7.22217 0.734784 7.32753 0.48043 7.51506 0.292893C7.7026 0.105357 7.95695 0 8.22217 0C8.48738 0 8.74174 0.105357 8.92927 0.292893C9.11681 0.48043 9.22217 0.734784 9.22217 1V8.59001L11.5122 6.3C11.7035 6.13617 11.9496 6.05056 12.2012 6.06029C12.4529 6.07001 12.6917 6.17434 12.8698 6.35243C13.0478 6.53053 13.1522 6.76927 13.1619 7.02094C13.1716 7.27262 13.086 7.5187 12.9222 7.71L8.98164 11.6505C8.96498 11.67 8.94751 11.6889 8.92927 11.7071C8.74174 11.8946 8.48738 12 8.22217 12C8.22201 12 8.22185 12 8.22169 12ZM0.515061 15.7071C0.702598 15.8946 0.956951 16 1.22217 16H15.2222C15.4874 16 15.7417 15.8946 15.9293 15.7071C16.1168 15.5196 16.2222 15.2652 16.2222 15C16.2222 14.7348 16.1168 14.4804 15.9293 14.2929C15.7417 14.1054 15.4874 14 15.2222 14H1.22217C0.956951 14 0.702598 14.1054 0.515061 14.2929C0.327525 14.4804 0.222168 14.7348 0.222168 15C0.222168 15.2652 0.327525 15.5196 0.515061 15.7071Z"
                                fill="black"
                              />
                            </svg>
                            Download
                          </button>
                          {(
                            <button
                              className="btn btn-primary"
                              onClick={RegeneratePost}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 17 16"
                                fill="none"
                              >
                                <path
                                  d="M15.5757 9.28097C15.3521 9.21128 15.11 9.2328 14.9022 9.34086C14.6944 9.44892 14.5378 9.63474 14.4664 9.85782C14.0471 11.1397 13.2298 12.2544 12.1332 13.0397C11.0367 13.825 9.71819 14.2399 8.36955 14.2241C6.70143 14.2431 5.09387 13.5998 3.89938 12.4352C2.70489 11.2707 2.02097 9.67996 1.99758 8.0119C2.02097 6.34384 2.70489 4.75313 3.89938 3.58858C5.09387 2.42404 6.70143 1.78071 8.36955 1.79967C9.87608 1.79603 11.3363 2.32044 12.4962 3.28173L10.5704 2.96225C10.455 2.94326 10.337 2.94727 10.2231 2.97405C10.1093 3.00084 10.0018 3.04987 9.90699 3.11832C9.81214 3.18677 9.73177 3.2733 9.67048 3.37293C9.60919 3.47256 9.5682 3.58332 9.54987 3.69884C9.53088 3.81426 9.53489 3.93229 9.56168 4.04615C9.58846 4.16001 9.63749 4.26745 9.70594 4.3623C9.7744 4.45714 9.86092 4.53752 9.96055 4.59881C10.0602 4.6601 10.1709 4.70109 10.2865 4.71942L14.0493 5.34064H14.2002C14.3031 5.34052 14.4052 5.3225 14.5019 5.28739C14.5344 5.27505 14.5645 5.25702 14.5906 5.23415C14.6543 5.21048 14.7141 5.17759 14.7681 5.13653L14.848 5.0389C14.848 4.99453 14.9279 4.95903 14.9634 4.90579C14.9989 4.85254 14.9634 4.81704 15.0078 4.78154C15.0323 4.72986 15.053 4.67647 15.0699 4.6218L15.7355 1.07195C15.7576 0.955412 15.7566 0.835649 15.7324 0.719503C15.7083 0.603358 15.6615 0.493104 15.5948 0.395038C15.528 0.296973 15.4426 0.213015 15.3434 0.147958C15.2442 0.0829011 15.1332 0.0380198 15.0166 0.0158767C14.9001 -0.0062665 14.7803 -0.00523803 14.6642 0.0189034C14.548 0.0430449 14.4378 0.0898265 14.3397 0.156577C14.1417 0.291386 14.0053 0.499351 13.9605 0.73472L13.7209 2.02154C12.2353 0.734046 10.3354 0.0251336 8.36955 0.0247513C6.23071 0.00581931 4.17171 0.836153 2.64436 2.33355C1.11702 3.83095 0.246077 5.8731 0.222656 8.0119C0.246077 10.1507 1.11702 12.1928 2.64436 13.6902C4.17171 15.1876 6.23071 16.018 8.36955 15.999C10.1029 16.0257 11.799 15.4951 13.2081 14.4854C14.6172 13.4756 15.6649 12.0402 16.1969 10.3903C16.2306 10.2767 16.2412 10.1575 16.228 10.0397C16.2149 9.92192 16.1783 9.80797 16.1204 9.70458C16.0625 9.60118 15.9844 9.51043 15.8909 9.43767C15.7974 9.36492 15.6902 9.31164 15.5757 9.28097Z"
                                  fill="black"
                                />
                              </svg>
                              Regenerate
                            </button>
                          )}
                          {(!prompts[CodeIndex]?.PromptReviews[0]) && (
                            <button
                              className="btn btn-primary dark_btn"
                              // onClick={handleTestAndReviewClick}
                              onClick={openModal}
                            >
                              Test and review
                            </button>
                          )}
                          {prompts[CodeIndex]?.type === 'custom' && (
                            <button
                              className="btn btn-primary dark_btn"
                              onClick={handleCustomClick}
                            >
                              Custom
                            </button>
                          )}
                        </div>
                        <div className="prompts mt-3">
                          {codeData?.code && codeData?.language && (
                            <CodeViewer
                              code={codeData.code}
                              language={codeData.language}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <Modal className={"generate_modal"} isOpen={modalIsOpen}>
          {showTestReview ? (
            <TestReview
              testReview={testReview}
              closeModal={closeModal}
              openFileUploadModel={openFileUploadModel} />
          ) : (
            <SuccessReview closeModal={closeModal} />
          )}
        </Modal> */}
        <Modal className={"generate_modal"} isOpen={modalIsOpen}>
          {modelStep == 1 && (<TestReview
            testReview={testReview}
            closeModal={closeModal} />
          )}

          {modelStep == 2 && (<UploadFile
            handleUploadAndReview={handleUploadAndReview}
            setUploadReviewForm={setUploadReviewForm}
            uploadReviewForm={uploadReviewForm}
            closeModal={closeModal}
          />
          )}

          {modelStep == 3 && (<SuccessReview closeModal={closeModal} />)}
        </Modal>
      </div>
    </>
  );
};

export default Thread;
