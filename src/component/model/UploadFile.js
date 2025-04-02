import React, { useState } from 'react'

const UploadFile = ({ handleUploadAndReview, setUploadReviewForm, uploadReviewForm, closeModal }) => {
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file &&
            (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                || file.type === "application/vnd.ms-excel"
                || file.name.endsWith('.csv')
            )) {
            setUploadReviewForm((state) => ({ ...state, file: file }));
            setError(null);
        } else {
            setError("Unsupported file type. Only .csv and .xlsx files are allowed.");
            event.target.value = null;
        }
    };
    return (
        <>
            <div className="modal generate_modal definition_modal define_input_modal  justify-content-center align-items-lg-start py-4  align-items-md-start align-items-start  show"
                id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body p-0">
                            <div className="inner_text tracking_form sign_up_img">
                                <h2 className="text-center mb-4"><b>Upload File</b></h2>
                                <div className="generate_code_section">
                                    <form action className="tracking_form">
                                        <div className="mb-4">
                                            <p className="mb-2"><b>File</b></p>
                                            <div className="upload_files positino-relative">

                                                <input type="file"
                                                    accept=".csv,
                                                     application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                                      application/vnd.ms-excel"
                                                    onChange={(e) => { handleFileChange(e) }}
                                                />

                                                <button className="d-flex align-items-center justify-content-center gap-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                        viewBox="0 0 24 25" fill="none">
                                                        <path
                                                            d="M20.3999 9.28014L20.3999 5.57426C20.3999 5.01263 20.1787 4.474 19.7848 4.07686C19.391 3.67972 18.8569 3.45662 18.2999 3.45662L5.6999 3.45661C5.14295 3.45661 4.60881 3.67972 4.21498 4.07686C3.82115 4.47399 3.5999 5.01263 3.5999 5.57426L3.5999 9.28014M11.9987 21.5433L11.9987 9.54333M11.9987 9.54333L7.19873 14.1285M11.9987 9.54333L16.7987 14.1285"
                                                            stroke="black" stroke-width="2" stroke-linecap="round"
                                                            stroke-linejoin="round" />
                                                    </svg>
                                                    <span>Upload</span>
                                                </button>
                                            </div>
                                            {
                                                !error ? (<p className="mb-0 mt-2">Upload a file for
                                                    input. Supported
                                                    formats are .xlsx / .csv</p>) : (<span className='text-danger'>{error}</span>)
                                            }

                                        </div>
                                        <div>
                                            <p className="mb-2"><b>Description :</b></p>
                                            <textarea className="form-control p-3" placeholder="What’s brewing in your mind?"
                                                id="exampleFormControlTextarea1" rows="3"
                                                value={uploadReviewForm.description}
                                                onChange={(e) => { setUploadReviewForm((state) => ({ ...state, description: e.target.value })) }}></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div
                                    className="d-flex flex-wrap gap-lg-4 gap-md-3 gap-3 mt-4 flex-lg-row flex-md-row flex-column-reverse justify-content-end">
                                    <button
                                        type='button'
                                        className="btn btn-outline-primary text-center justify-content-center"
                                        // onClick={(e) => { handleUploadAndReview(e, true) }}>
                                        onClick={closeModal}>
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary text-center justify-content-center"
                                        type='submit'
                                        disabled={!!error}
                                        onClick={(e) => {

                                            handleUploadAndReview(e);

                                        }}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UploadFile