import React from 'react'

const SuccessReview = ({ closeModal }) => {

    const cancelModel = () => {
        closeModal();
    };

    return (
        <div
            class="modal generate_modal code_submission align-items-lg-center align-items-md-start align-items-start show fade"
            id="exampleModal" tabindex="-1"
            aria-labelledby="exampleModalLabel" aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <button type="button" class="button_close"
                        data-bs-dismiss="modal" aria-label="Close" onClick={cancelModel}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="41"
                            height="40" viewBox="0 0 41 40" fill="none">
                            <path
                                d="M22.8502 20.0001L33.3502 9.51673C33.6641 9.20289 33.8404 8.77723 33.8404 8.3334C33.8404 7.88956 33.6641 7.4639 33.3502 7.15006C33.0364 6.83623 32.6107 6.65991 32.1669 6.65991C31.7231 6.65991 31.2974 6.83623 30.9836 7.15006L20.5002 17.6501L10.0169 7.15006C9.70305 6.83623 9.27739 6.65991 8.83356 6.65991C8.38972 6.65991 7.96406 6.83623 7.65022 7.15006C7.33638 7.4639 7.16007 7.88956 7.16007 8.3334C7.16007 8.77723 7.33638 9.20289 7.65022 9.51673L18.1502 20.0001L7.65022 30.4834C7.49401 30.6383 7.37002 30.8227 7.28541 31.0258C7.20079 31.2289 7.15723 31.4467 7.15723 31.6667C7.15723 31.8867 7.20079 32.1046 7.28541 32.3077C7.37002 32.5108 7.49401 32.6951 7.65022 32.8501C7.80516 33.0063 7.9895 33.1303 8.1926 33.2149C8.39569 33.2995 8.61354 33.3431 8.83356 33.3431C9.05358 33.3431 9.27142 33.2995 9.47452 33.2149C9.67762 33.1303 9.86195 33.0063 10.0169 32.8501L20.5002 22.3501L30.9836 32.8501C31.1385 33.0063 31.3228 33.1303 31.5259 33.2149C31.729 33.2995 31.9469 33.3431 32.1669 33.3431C32.3869 33.3431 32.6048 33.2995 32.8079 33.2149C33.011 33.1303 33.1953 33.0063 33.3502 32.8501C33.5064 32.6951 33.6304 32.5108 33.715 32.3077C33.7997 32.1046 33.8432 31.8867 33.8432 31.6667C33.8432 31.4467 33.7997 31.2289 33.715 31.0258C33.6304 30.8227 33.5064 30.6383 33.3502 30.4834L22.8502 20.0001Z"
                                fill="#271353" />
                        </svg></button>
                    <div class="modal-body p-0">
                        <div class="inner_text">
                            <h2 class="text-center m-0">Code submission
                                received!</h2>
                            <div class="my-3 py-1">
                                <p class="text-center m-0">Thank you for
                                    choosing us to review your code. Our
                                    team will review your code urgently
                                    within the next 8 hours.</p>
                            </div>
                            <div class="d-flex align-items-center justify-content-center w-100">
                                <img src="images/approve1.png" alt />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuccessReview