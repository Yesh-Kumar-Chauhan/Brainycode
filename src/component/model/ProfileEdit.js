import React, { useState, useEffect, useRef } from 'react'
import api from "../../services/axios-config";
import { isAxiosError } from "axios";
import { useUser, UserProvider } from '../../UserContext';

const ProfileEdit = ({ handleCloseModal, profilePicture, setProfilePicture }) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [previewImage, setPreviewImage] = useState(null);
    const [load, setLoad] = useState(false);
    const [file, setFile] = useState(false);
    // const fileInputRef = useRef(null);
    const { setProfile } = useUser();
    const [validationMessage, setValidationMessage] = useState('');

    // const handleFileInputChange = (event) => {
    //     const file = event.target.files[0];
    //     setFile(file);
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         setProfilePicture(reader.result);
    //         setPreviewImage(reader.result);
    //     };
    //     reader.readAsDataURL(file);
    // };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type;
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

            if (validImageTypes.includes(fileType)) {
                setFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setProfilePicture(reader.result);
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
                setValidationMessage(''); // Clear any previous validation message
            } else {
                setValidationMessage('Please select a file with a valid image format ( PNG, JPG, JPEG) !');
                // Clear the file input
                event.target.value = null;
            }
        }
    };

    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Read the file

            reader.onload = () => resolve(reader.result); // Resolve the base64 string
            reader.onerror = error => reject(error); // Reject in case of an error
        });
    }

    const profileInput = async (data) => {
        setLoad(true)
        try {
            // const formData = new FormData();
            // formData.append('file', profilePicture);

            // const response = await api.post(
            //     `/auth/upload-profile?userId=${userData.id}`, formData,
            //     {
            //         headers: {
            //             'Content-Type': 'multipart/form-data'
            //         }
            //     }
            // );
            const base64String = await convertFileToBase64(file);
            // Remove the data URL prefix to get just the base64-encoded string
            const base64Data = base64String.split(',')[1];

            const response = await api.post(
                `/auth/upload-profile?userId=${userData.id}`,
                {
                    image: base64Data,
                    name: profilePicture.name,
                    mimetype : profilePicture.type
                },
                {
                    headers: {
                        'Content-Type': 'application/json' // Change Content-Type to application/json
                    }
                }
            );
            const profileUrl = response.data.profile;

            const updatedUserData = { ...userData, profileUrl };
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            setProfilePicture(response.data.profile)
            setProfile(response.data.profile)
            handleCloseModal();

        } catch (error) {
            if (isAxiosError(error) && error.response) {
            }
        } finally {
            setLoad(false);
        }
    }

    return (
        <div className='p-lg-4 p-md-3 p-3'>
            <div className='inner_text sign_up_img'>
                <h5 className='text-center'><b>Edit Profile Picture</b></h5>
            </div>
            <div className="row">
                <div
                    className="col-lg-12 col-md-12 col-sm-12 col-12">
                        
                    <div
                        className="mb-3 pb-1 position-relative my-3 d-lg-flex d-md-flex d-block align-items-center gap-3">
                        <div className='preview_img'  >
                            {previewImage ? (
                                <img src={previewImage} alt="Profile Preview"
                                    style={{ width: '141px', height: '132px', borderRadius: '50%' }} />
                            ) : (
                                userData.profileUrl ? (
                                    <img src={userData.profileUrl} alt="Profile Preview"
                                        style={{ width: '141px', height: '132px', borderRadius: '50%' }} />
                                ) : (
                                    <img src="images/blank-profile-picture.jpg" alt='Blank Profile Picture'
                                        style={{ width: '141px', height: '132px', borderRadius: '50%' }} />
                                )
                            )}
                        </div>
                        <div
                            className="upload_files positino-relative w-100 overflow-hidden">
                            <input
                                id='File'
                                type="file"
                                style={{ maxWidth: '187px' }}
                                // ref={fileInputRef}
                                onChange={handleFileInputChange}
                                accept=".jpg, .jpeg, .png"
                            />
                            <button
                                className="d-flex flex-row justify-content-center align-items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20" height="20"
                                    viewBox="0 0 24 25"
                                    fill="none">
                                    <path
                                        d="M20.3999 9.28014L20.3999 5.57426C20.3999 5.01263 20.1787 4.474 19.7848 4.07686C19.391 3.67972 18.8569 3.45662 18.2999 3.45662L5.6999 3.45661C5.14295 3.45661 4.60881 3.67972 4.21498 4.07686C3.82115 4.47399 3.5999 5.01263 3.5999 5.57426L3.5999 9.28014M11.9987 21.5433L11.9987 9.54333M11.9987 9.54333L7.19873 14.1285M11.9987 9.54333L16.7987 14.1285"
                                        stroke="black"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                                <span>Upload</span>
                            </button>
                            {validationMessage && <div className="validation-message text-danger">{validationMessage}</div>}
                        </div>
                    </div>
                    <div className='d-flex  align-items-center justify-content-center flex-lg-row flex-md-row flex-column-reverse gap-3 w-100'>
                        <button className="btn btn-outline-primary w-auto" onClick={handleCloseModal}>Cancel</button>
                        <button type='submit' className="btn btn-primary w-100" style={{ maxWidth: '121px' }} onClick={profileInput}>
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
                                " Submit"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileEdit