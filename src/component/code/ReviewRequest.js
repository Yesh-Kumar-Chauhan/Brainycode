import React from 'react'




const ReviewRequest = () => {
    return (
        <>
            <section className="generate_code_section">
                <div className="container position-relative">
                    <div className="go_back">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30"
                            height="26" viewBox="0 0 30 26" fill="none">
                            <path
                                d="M19 10.0004H3.76196L13.641 1.76835C13.7418 1.68418 13.8251 1.58096 13.8861 1.46459C13.947 1.34823 13.9845 1.22099 13.9963 1.09016C14.0081 0.959318 13.994 0.827438 13.9548 0.702047C13.9156 0.576655 13.8521 0.460208 13.768 0.359353C13.6838 0.258498 13.5806 0.17521 13.4642 0.114245C13.3478 0.0532804 13.2206 0.0158321 13.0898 0.00403905C12.9589 -0.00775399 12.827 0.00633882 12.7017 0.0455129C12.5763 0.084687 12.4598 0.148175 12.359 0.232352L0.358964 10.2324C0.347964 10.2414 0.343964 10.2564 0.333964 10.2654C0.263464 10.3331 0.20347 10.4109 0.155964 10.4964C0.132375 10.5284 0.110671 10.5618 0.0909641 10.5964C0.0310603 10.7237 0 10.8626 0 11.0034C0 11.1441 0.0310603 11.283 0.0909641 11.4104C0.110671 11.4449 0.132375 11.4783 0.155964 11.5104C0.20347 11.5958 0.263464 11.6736 0.333964 11.7414C0.343964 11.7504 0.347964 11.7654 0.358964 11.7744L12.359 21.7744C12.4598 21.8585 12.5763 21.922 12.7017 21.9612C12.827 22.0004 12.9589 22.0145 13.0898 22.0027C13.2206 21.9909 13.3478 21.9534 13.4642 21.8925C13.5806 21.8315 13.6838 21.7482 13.768 21.6474C13.8521 21.5465 13.9156 21.43 13.9548 21.3047C13.994 21.1793 14.0081 21.0474 13.9963 20.9165C13.9845 20.7857 13.947 20.6585 13.8861 20.5421C13.8251 20.4257 13.7418 20.3225 13.641 20.2384L3.76196 12.0004H19C21.3861 12.003 23.6737 12.9521 25.361 14.6393C27.0483 16.3266 27.9973 18.6142 28 21.0004V25.0004C28 25.2656 28.1053 25.5199 28.2929 25.7075C28.4804 25.895 28.7347 26.0004 29 26.0004C29.2652 26.0004 29.5195 25.895 29.7071 25.7075C29.8946 25.5199 30 25.2656 30 25.0004V21.0004C29.9965 18.084 28.8365 15.2881 26.7743 13.226C24.7122 11.1638 21.9163 10.0038 19 10.0004Z"
                                fill="black" />
                        </svg>
                        Go back
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-9 col-md-12 col-sm-12 col-12">
                            <div className="inner_text text-center">

                                <h2 className="mb-4 pb-lg-2">You generate, we test.</h2>
                                <p className="m-0">Please provide detailed input
                                    variables and expected outputs for your code.
                                    This<br />information is essential for our
                                    testing and review process.<br />
                                    Note: Input variables from your code have been
                                    automatically included.</p>
                            </div>
                            <div className="row mt-4 pt-lg-2 justify-content-center">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                                    <div className="row justify-content-center">
                                        <div
                                            className="col-lg-5 col-md-12 col-sm-12 col-12">
                                            <div className="generate_test">
                                                <h3 className="m-0 text-center">Input
                                                    variables</h3>
                                            </div>
                                            <form className="mt-3 pt-lg-1">
                                                <div
                                                    className="add_variable position-relative">
                                                    <div className="add_icon">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24" height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none">
                                                            <path
                                                                d="M19 0H5C3.67392 0 2.40215 0.526784 1.46447 1.46447C0.526784 2.40215 0 3.67392 0 5V19C0 20.3261 0.526784 21.5979 1.46447 22.5355C2.40215 23.4732 3.67392 24 5 24H19C20.3261 24 21.5979 23.4732 22.5355 22.5355C23.4732 21.5979 24 20.3261 24 19V5C24 3.67392 23.4732 2.40215 22.5355 1.46447C21.5979 0.526784 20.3261 0 19 0ZM22 19C22 19.7956 21.6839 20.5587 21.1213 21.1213C20.5587 21.6839 19.7956 22 19 22H5C4.20435 22 3.44129 21.6839 2.87868 21.1213C2.31607 20.5587 2 19.7956 2 19V5C2 4.20435 2.31607 3.44129 2.87868 2.87868C3.44129 2.31607 4.20435 2 5 2H19C19.7956 2 20.5587 2.31607 21.1213 2.87868C21.6839 3.44129 22 4.20435 22 5V19Z"
                                                                fill="#1D1A2F" />
                                                            <path
                                                                d="M16 11H13V8C13 7.73478 12.8946 7.48043 12.7071 7.29289C12.5196 7.10536 12.2652 7 12 7C11.7348 7 11.4804 7.10536 11.2929 7.29289C11.1054 7.48043 11 7.73478 11 8V11H8C7.73478 11 7.48043 11.1054 7.29289 11.2929C7.10536 11.4804 7 11.7348 7 12C7 12.2652 7.10536 12.5196 7.29289 12.7071C7.48043 12.8946 7.73478 13 8 13H11V16C11 16.2652 11.1054 16.5196 11.2929 16.7071C11.4804 16.8946 11.7348 17 12 17C12.2652 17 12.5196 16.8946 12.7071 16.7071C12.8946 16.5196 13 16.2652 13 16V13H16C16.2652 13 16.5196 12.8946 16.7071 12.7071C16.8946 12.5196 17 12.2652 17 12C17 11.7348 16.8946 11.4804 16.7071 11.2929C16.5196 11.1054 16.2652 11 16 11Z"
                                                                fill="#1D1A2F" />
                                                        </svg>
                                                    </div>
                                                    <input type="text"
                                                        placeholder="Add variable" />
                                                </div>
                                                <div className="generate_input">
                                                    <input type="text"
                                                        className="form-input"
                                                        placeholder="(num)" />
                                                </div>
                                                <div className="generate_input">
                                                    <input type="text"
                                                        className="form-input"
                                                        placeholder="(start_range)" />
                                                </div>
                                                <div className="generate_input">
                                                    <input type="text"
                                                        className="form-input"
                                                        placeholder="(end_range)" />
                                                </div>
                                            </form>
                                        </div>
                                        <div
                                            className="col-lg-5 col-md-12 col-sm-12 col-12 mt-lg-0 mt-md-4 mt-4">
                                            <div className="generate_test">
                                                <h3
                                                    className="m-0 text-center">Output</h3>
                                            </div>
                                            <form className="mt-3 pt-lg-1">
                                                <div
                                                    className="add_variable position-relative">
                                                    <div className="add_icon">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24" height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none">
                                                            <path
                                                                d="M19 0H5C3.67392 0 2.40215 0.526784 1.46447 1.46447C0.526784 2.40215 0 3.67392 0 5V19C0 20.3261 0.526784 21.5979 1.46447 22.5355C2.40215 23.4732 3.67392 24 5 24H19C20.3261 24 21.5979 23.4732 22.5355 22.5355C23.4732 21.5979 24 20.3261 24 19V5C24 3.67392 23.4732 2.40215 22.5355 1.46447C21.5979 0.526784 20.3261 0 19 0ZM22 19C22 19.7956 21.6839 20.5587 21.1213 21.1213C20.5587 21.6839 19.7956 22 19 22H5C4.20435 22 3.44129 21.6839 2.87868 21.1213C2.31607 20.5587 2 19.7956 2 19V5C2 4.20435 2.31607 3.44129 2.87868 2.87868C3.44129 2.31607 4.20435 2 5 2H19C19.7956 2 20.5587 2.31607 21.1213 2.87868C21.6839 3.44129 22 4.20435 22 5V19Z"
                                                                fill="#1D1A2F" />
                                                            <path
                                                                d="M16 11H13V8C13 7.73478 12.8946 7.48043 12.7071 7.29289C12.5196 7.10536 12.2652 7 12 7C11.7348 7 11.4804 7.10536 11.2929 7.29289C11.1054 7.48043 11 7.73478 11 8V11H8C7.73478 11 7.48043 11.1054 7.29289 11.2929C7.10536 11.4804 7 11.7348 7 12C7 12.2652 7.10536 12.5196 7.29289 12.7071C7.48043 12.8946 7.73478 13 8 13H11V16C11 16.2652 11.1054 16.5196 11.2929 16.7071C11.4804 16.8946 11.7348 17 12 17C12.2652 17 12.5196 16.8946 12.7071 16.7071C12.8946 16.5196 13 16.2652 13 16V13H16C16.2652 13 16.5196 12.8946 16.7071 12.7071C16.8946 12.5196 17 12.2652 17 12C17 11.7348 16.8946 11.4804 16.7071 11.2929C16.5196 11.1054 16.2652 11 16 11Z"
                                                                fill="#1D1A2F" />
                                                        </svg>
                                                    </div>
                                                    <input type="text"
                                                        placeholder="Add output" />
                                                </div>
                                                <div className="generate_input">
                                                    <input type="text"
                                                        className="form-input"
                                                        placeholder="" />
                                                </div>
                                                <div className="generate_input">
                                                    <input type="text"
                                                        className="form-input"
                                                        placeholder="" />
                                                </div>
                                                <div className="generate_input">
                                                    <input type="text"
                                                        className="form-input"
                                                        placeholder="" />
                                                </div>
                                            </form>
                                        </div>
                                        <div
                                            className="col-12 d-flex justify-content-center generate_button mt-4 pt-lg-2">
                                            <button
                                                className="btn btn-primary align-items-center w-auto px-lg-4">Test
                                                and review my code</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ReviewRequest
