import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import api from "../../services/axios-config";
const CustomBoard = () => {
  const { id } = useParams();
  const [userCredit, setUserCredit] = useState(null);
  const [newObject, setNewObject] = useState(null);
  const [boardSpecification, setboardSpecification] = useState([]);
  const [prompt, setPrompt] = useState([]);

  const [load, setLoad] = useState(false);

  useEffect(() => {
    const credits = localStorage.getItem("userCredit");
    if (credits) {
      const userCredit = JSON.parse(credits);
      setUserCredit(userCredit);
    }
    const customPromptObject = localStorage.getItem("customPromptObject");
    console.log("customPromptObject", customPromptObject);
    if (customPromptObject) {
      const customPrompt = JSON.parse(customPromptObject);
      setNewObject(customPrompt);
    }
    
    getboardSpecifications();
  }, []);

  useEffect(() => {
    getPromptsById(id);
  }, [id]);

  const getPromptsById = async (id) => {
    try {
      setLoad(true);
      const response = await api.get(`code/getPromptsById?promptId=${id}`);
      setPrompt(response.data.prompt);
      localStorage.setItem("customBoardPromptId",(response.data.prompt.id));
      localStorage.setItem("language", JSON.stringify(response.data.prompt.language));

    } catch (error) {
      if (error) {
        console.error(error.message);
        // toast.error("Failed to fetch credit plans. Please try again later.");
      } else {
        console.error(error);
      }
    }
    finally {
      setLoad(false);
    }
  };

  const getboardSpecifications = async () => {
    try {
      const {
        data: { boardSpecification },
      } = await api.get("/subscription/board-specifications");
      if (!boardSpecification) {
        // toast.error("Failed to fetch board Specifications Details!");
        return;
      }
      localStorage.setItem("customBoard", JSON.stringify(boardSpecification));
      setboardSpecification(boardSpecification);
    } catch (error) {
      // toast.error(error);
    }
  };
  const navigate = useNavigate();
  const cancleOrder = () => {
    navigate("/code", { replace: false });
  }
  return (
    <>
      <section class="board_section py-5">
        <div class="container">
          <div class="row g-3 flex-lg-row flex-md-column-reverse flex-column-reverse">
            <div class="col-lg-7 col-md-12 col-sm-12 col-12 d-flex align-items-center">
              <div class="inner_text">
                <h2 class="mb-0">
                  Custom board + generated code, tested and reviewed.
                </h2>
                <div class="d-flex gap-2 mt-4 pt-lg-1 align-items-center">
                  <img src="/images/Credits.png" width="20px" alt />
                  <h5 class="m-0">{userCredit} Credits</h5>
                </div>
                <p class="mt-1">
                  Running low on Credits?{" "}
                  <a >
                    <Link to="/buy-credit">Get more here.</Link>
                  </a>
                </p>
                <div class="button_box d-flex align-items-center gap-4  my-4 py-lg-1">
                  <Link class="btn btn-primary" to="/custom-board-order">Order now</Link>

                  <a class="btn btn-outline-primary"
                    onClick={cancleOrder}>
                    Cancel
                  </a>
                </div>
                <p class="mb-0">
                  Get a custom embedded board with tested AI code delivered to
                  your doorstep.
                </p>
                <p class="mb-0">
                  Ready-to-use and optimized for peak performance. Elevate your
                  projects today!
                </p>
              </div>
            </div>
            <div class="col-lg-5 col-md-12 col-sm-12 col-12">
              <div class="pro_img w-100">
                <img src="/images/generate_img.png" class="w-100" alt />
              </div>
            </div>
          </div>
          <div class="row mt-4 pt-lg-3 g-3">
            <div class="col-lg-6 col-md-12 col-sm-12 col-12">
              <div class="inner_text sign_up_img">
                <h5 class="mb-1">
                  <b>Prompt</b>
                </h5>
                {/* <h5 class="mb-0">{newObject && newObject.prompt}</h5> */}
                <h5 class="mb-0">{prompt && prompt.prompt}</h5>
              </div>
            </div>
            <div class="col-lg-5 col-md-12 col-sm-12 col-12 offset-lg-1">
              <div class="item_specification">
                <div class="inner_text sign_up_img mb-3 pb-1">
                  <h5>
                    <b>Board specifications</b>
                  </h5>
                </div>
                <div class="inner_text">
                  <div class="row g-3">
                    <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                      <p class="m-0">
                        <b>Model :</b>
                      </p>
                    </div>
                    <div class="col-lg-8 col-md-12 col-sm-12 col-12">
                      <div class="select_box">
                        <select name id>
                          {boardSpecification &&
                            boardSpecification.map((board) => (
                              <option key={board.id} value={board.model}>
                                {board.model}
                              </option>
                            ))}
                        </select>
                        <div class="down_arrow">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M17.096 11.5676C17.5203 11.2141 17.5776 10.5835 17.2241 10.1592C16.8705 9.73494 16.24 9.67762 15.8157 10.0312L17.096 11.5676ZM12.2132 14.335L11.573 15.1032C11.9438 15.4122 12.4825 15.4122 12.8534 15.1032L12.2132 14.335ZM8.6107 10.0312C8.18643 9.67762 7.55586 9.73494 7.2023 10.1592C6.84873 10.5835 6.90606 11.2141 7.33033 11.5676L8.6107 10.0312ZM15.8157 10.0312L11.573 13.5667L12.8534 15.1032L17.096 11.5676L15.8157 10.0312ZM12.8534 13.5667L8.6107 10.0312L7.33033 11.5676L11.573 15.1032L12.8534 13.5667ZM20.6004 12C20.6004 16.7496 16.75 20.6 12.0004 20.6V22.6C17.8546 22.6 22.6004 17.8542 22.6004 12H20.6004ZM12.0004 20.6C7.25074 20.6 3.40039 16.7496 3.40039 12H1.40039C1.40039 17.8542 6.14617 22.6 12.0004 22.6V20.6ZM3.40039 12C3.40039 7.25035 7.25074 3.4 12.0004 3.4V1.4C6.14617 1.4 1.40039 6.14578 1.40039 12H3.40039ZM12.0004 3.4C16.75 3.4 20.6004 7.25035 20.6004 12H22.6004C22.6004 6.14578 17.8546 1.4 12.0004 1.4V3.4Z"
                              fill="black"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                      <p class="m-0">
                        <b>Model :</b>
                      </p>
                    </div>
                    <div class="col-lg-8 col-md-12 col-sm-12 col-12">
                      {boardSpecification &&
                        boardSpecification.map((board) => (
                          <p key={board.id} value={board.model} class="m-0">{board.processor}</p>
                        ))}
                    </div>
                    <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                      <p class="m-0">
                        <b>Memory :</b>
                      </p>
                    </div>
                    <div class="col-lg-8 col-md-12 col-sm-12 col-12">
                      {boardSpecification &&
                        boardSpecification.map((board) => (
                          <p key={board.id} value={board.model} class="m-0">{board.memory}</p>
                        ))}
                    </div>
                    <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                      <p class="m-0">
                        <b>Storage :</b>
                      </p>
                    </div>
                    <div class="col-lg-8 col-md-12 col-sm-12 col-12">
                      {boardSpecification &&
                        boardSpecification.map((board) => (
                          <p key={board.id} value={board.model} class="m-0">{board.storage}</p>
                        ))}
                    </div>
                    <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                      <p class="m-0">
                        <b>Connectivity :</b>
                      </p>
                    </div>
                    <div class="col-lg-8 col-md-12 col-sm-12 col-12">
                      {boardSpecification &&
                        boardSpecification.map((board) => (
                          <p key={board.id} value={board.model} class="m-0">{board.connectivity}</p>
                        ))}
                    </div>
                    <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                      <p class="m-0">
                        <b>I/O Ports :</b>
                      </p>
                    </div>
                    <div class="col-lg-8 col-md-12 col-sm-12 col-12">
                      {boardSpecification &&
                        boardSpecification.map((board) => (
                          <p key={board.id} value={board.model} class="m-0">{board.ioports}</p>
                        ))}
                    </div>
                    <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                      <p class="m-0">
                        <b>Dimensions :</b>
                      </p>
                    </div>
                    <div class="col-lg-8 col-md-12 col-sm-12 col-12">
                      {boardSpecification &&
                        boardSpecification.map((board) => (
                          <p key={board.id} value={board.model} class="m-0">{board.dimensions}</p>
                        ))}
                    </div>
                    <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                      <p class="m-0">
                        <b>Language :</b>
                      </p>
                    </div>
                    <div class="col-lg-8 col-md-12 col-sm-12 col-12">

                      {/* <p class="m-0">{newObject && newObject.language}</p> */}
                      {prompt && (
                        <p className="m-0"> {prompt.language}</p>
                      )}
                    </div>
                    <div class="col-lg-4 col-md-12 col-sm-12 col-12">
                      <p class="m-0">
                        <b>Architecture :</b>
                      </p>
                    </div>
                    <div class="col-lg-8 col-md-12 col-sm-12 col-12">
                      {boardSpecification &&
                        boardSpecification.map((board) => (
                          <p key={board.id} value={board.model} class="m-0">{board.architecture}</p>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default CustomBoard;
