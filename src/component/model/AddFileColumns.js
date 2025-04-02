import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { z } from 'zod';

const AddFileColumn = ({ addColumns, inputs, setInputs }) => {

    const addInput = () => {
        setInputs(inputs.concat({ id: Math.random(), name: '' }));
    };

    const removeInput = (id) => {
        if (inputs.length > 1) {
            setInputs(inputs.filter(input => input.id !== id));
        }
    };

    const handleInputChange = (id, newName) => {
        setInputs(inputs.map(input => input.id === id ? { ...input, name: newName } : input));
    };

    return (
        <>
            <div className="modal generate_modal show definition_modal code_submission justify-content-center align-items-lg-center align-items-md-start align-items-start  show"
                id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body p-0">
                            <div className="inner_text tracking_form sign_up_img">
                                <h5 className="text-start mb-3"><b>Column definition
                                    :</b></h5>
                                <form action>
                                    <div className='definition_form d-flex flex-column gap-4'>
                                        {
                                            inputs.map((input, index) => (
                                                <div key={index} className="d-flex gap-3 align-items-center">
                                                    <p className="text-nowrap m-0">Col {index + 1}</p>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="VariableName"
                                                            className="text-center"
                                                            value={input.name}
                                                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                                                        />
                                                    </div>
                                                    <div onClick={() => removeInput(input.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"
                                                            fill="none">
                                                            <g clip-path="url(#clip0_998_721)">
                                                                <path
                                                                    d="M22 3.5H7C6.31 3.5 5.765 3.85 5.405 4.38L0 12.495L5.405 20.61C5.765 21.14 6.31 21.5 7 21.5H22C23.105 21.5 24 20.605 24 19.5V5.5C24 4.395 23.105 3.5 22 3.5ZM19 16.085L17.585 17.5L14 13.915L10.415 17.5L9 16.085L12.585 12.5L9 8.915L10.415 7.5L14 11.085L17.585 7.5L19 8.915L15.415 12.5L19 16.085Z"
                                                                    fill="#271353" />
                                                            </g>
                                                            <defs>
                                                                <clippath id="clip0_998_721">
                                                                    <rect width="24" height="24" fill="white"
                                                                        transform="translate(0 0.5)" />
                                                                </clippath>
                                                            </defs>
                                                        </svg>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="w-100 d-flex align-items-center flex-column gap-3 justify-content-center mt-5">
                                        <button type='button' className="btn btn-outline-primary" onClick={addInput}>
                                            Add column
                                        </button>
                                        <button type='button' className="btn btn-primary" onClick={() => { addColumns(inputs) }}>
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AddFileColumn;