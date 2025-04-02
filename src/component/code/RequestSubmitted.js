import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const RequestSubmitted = () => {
    return (
        <div>
            <section className="generate_code_section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-9 col-md-12 col-sm-12 col-12">
                            <div className="inner_text text-start">
                                <h2 className="mb-4 pb-lg-2">Code submission
                                    received!</h2>
                                <p className="m-0">Thank you for choosing us to review
                                    your code. Your code will be tested and reviewed
                                    in<br />the order it was received. You are
                                    number 28 in a queue of 28.<br />
                                    On a time crunch? You can expedite the process.
                                    We appreciate a good ‘morale boost’.</p>
                            </div>
                            <div className="row mt-4 pt-lg-3 g-4">
                                <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                                    <div className="submission_card">
                                        <h3 className="mb-2">I can wait</h3>
                                        <p className="m-0">Free</p>
                                        <p className="m-0">Up to 1 day for
                                            completion.</p>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                                    <div className="submission_card">
                                        <h3 className="mb-2">This is kinda urgent.</h3>
                                        <p className="m-0">$1.00</p>
                                        <p className="m-0">Up to 8 hours for
                                            completion.</p>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                                    <div className="submission_card">
                                        <h3 className="mb-2">MY A** IS ON FIRE!</h3>
                                        <p className="m-0">$20.00</p>
                                        <p className="m-0">Express test and review.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="go_back submission mt-lg-5 mt-4 ">
                            <Link to="/code" className="nav-link ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30"
                                    height="26" viewBox="0 0 30 26" fill="none">
                                    <path
                                        d="M19 10.0004H3.76196L13.641 1.76835C13.7418 1.68418 13.8251 1.58096 13.8861 1.46459C13.947 1.34823 13.9845 1.22099 13.9963 1.09016C14.0081 0.959318 13.994 0.827438 13.9548 0.702047C13.9156 0.576655 13.8521 0.460208 13.768 0.359353C13.6838 0.258498 13.5806 0.17521 13.4642 0.114245C13.3478 0.0532804 13.2206 0.0158321 13.0898 0.00403905C12.9589 -0.00775399 12.827 0.00633882 12.7017 0.0455129C12.5763 0.084687 12.4598 0.148175 12.359 0.232352L0.358964 10.2324C0.347964 10.2414 0.343964 10.2564 0.333964 10.2654C0.263464 10.3331 0.20347 10.4109 0.155964 10.4964C0.132375 10.5284 0.110671 10.5618 0.0909641 10.5964C0.0310603 10.7237 0 10.8626 0 11.0034C0 11.1441 0.0310603 11.283 0.0909641 11.4104C0.110671 11.4449 0.132375 11.4783 0.155964 11.5104C0.20347 11.5958 0.263464 11.6736 0.333964 11.7414C0.343964 11.7504 0.347964 11.7654 0.358964 11.7744L12.359 21.7744C12.4598 21.8585 12.5763 21.922 12.7017 21.9612C12.827 22.0004 12.9589 22.0145 13.0898 22.0027C13.2206 21.9909 13.3478 21.9534 13.4642 21.8925C13.5806 21.8315 13.6838 21.7482 13.768 21.6474C13.8521 21.5465 13.9156 21.43 13.9548 21.3047C13.994 21.1793 14.0081 21.0474 13.9963 20.9165C13.9845 20.7857 13.947 20.6585 13.8861 20.5421C13.8251 20.4257 13.7418 20.3225 13.641 20.2384L3.76196 12.0004H19C21.3861 12.003 23.6737 12.9521 25.361 14.6393C27.0483 16.3266 27.9973 18.6142 28 21.0004V25.0004C28 25.2656 28.1053 25.5199 28.2929 25.7075C28.4804 25.895 28.7347 26.0004 29 26.0004C29.2652 26.0004 29.5195 25.895 29.7071 25.7075C29.8946 25.5199 30 25.2656 30 25.0004V21.0004C29.9965 18.084 28.8365 15.2881 26.7743 13.226C24.7122 11.1638 21.9163 10.0038 19 10.0004Z"
                                        fill="black" />
                                </svg>
                                Back to Generator
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default RequestSubmitted
