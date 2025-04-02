import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';


import { z } from 'zod';
const Schema = z.object({
    inputType: z.string(),
    inputVariable: z.string(),
    outputType: z.string(),
    outputVariable: z.string()
});
const GenerateVariable = ({ fomData, closeModal, setfomData, openAddColumnModel }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(Schema),
        defaultValues: fomData,
    });
    const onSubmit = async (values) => {
        const { framework, language, type, prompt } = fomData
        const newObject = { ...values, framework, language, type, prompt };
        setfomData(newObject);
        closeModal();
    };


    useEffect(() => {
        setValue('inputType', fomData.inputType || '');
        setValue('inputVariable', fomData.inputVariable || '');
        setValue('outputType', fomData.outputType || '');
        setValue('outputVariable', fomData.outputVariable || '');
    }, [fomData, setValue]);

    const handleCancel = () => {
        closeModal();
        setfomData((state) => ({ ...state, inputType: '', inputVariable: '', outputType: '', outputVariable: '' }));
        reset();  // Reset the form to its default values
    };


    return (
        <>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="inner_text text-center generate_form">
                        <h2 className="mb-4 pb-lg-2">Define inputs, expected outputs.</h2>
                        <p className="m-0">
                            please provide deatails input variable and expected outputs for your code. This
                            <br />
                            information is essential for our testing and review process.
                            <br /> Note: Input variables from your code have been automatically included.

                        </p>
                        <div className='mt-4 pt-3'>
                            <div className="input-output-container mt-0">
                                <div className="input-section">
                                    <h2 className='mb-3 pb-1'>Input</h2>
                                    <div className='d-flex align-items-center position-relative gap-4'>
                                        <div className='position-relative modal_select'>
                                            <select {...register('inputType')}
                                                className={errors.inputType ? 'is-invalid' : ''} >
                                                <option value="">VarType</option>
                                                <option value="Int">Int</option>
                                                <option value="Char">Char</option>
                                                <option value="String">String</option>

                                            </select>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M17.0956 11.5676C17.5198 11.2141 17.5772 10.5835 17.2236 10.1592C16.87 9.73493 16.2395 9.67761 15.8152 10.0312L17.0956 11.5676ZM12.2127 14.335L11.5725 15.1032C11.9434 15.4122 12.482 15.4122 12.8529 15.1032L12.2127 14.335ZM8.61021 10.0312C8.18594 9.67761 7.55537 9.73493 7.20181 10.1592C6.84824 10.5835 6.90557 11.2141 7.32985 11.5676L8.61021 10.0312ZM15.8152 10.0312L11.5725 13.5667L12.8529 15.1032L17.0956 11.5676L15.8152 10.0312ZM12.8529 13.5667L8.61021 10.0312L7.32985 11.5676L11.5725 15.1032L12.8529 13.5667ZM20.5999 12C20.5999 16.7496 16.7496 20.6 11.9999 20.6V22.6C17.8541 22.6 22.5999 17.8542 22.5999 12H20.5999ZM11.9999 20.6C7.25025 20.6 3.3999 16.7496 3.3999 12H1.3999C1.3999 17.8542 6.14568 22.6 11.9999 22.6V20.6ZM3.3999 12C3.3999 7.25034 7.25025 3.39999 11.9999 3.39999V1.39999C6.14568 1.39999 1.3999 6.14578 1.3999 12H3.3999ZM11.9999 3.39999C16.7496 3.39999 20.5999 7.25034 20.5999 12H22.5999C22.5999 6.14578 17.8541 1.39999 11.9999 1.39999V3.39999Z" fill="black" />
                                            </svg>
                                        </div>

                                        <input type="text" placeholder="VariableName"

                                            className={`input-field ${errors.inputVariable ? 'is-invalid' : ''}`}
                                            {...register('inputVariable')} />
                                        {errors.inputType && (
                                            <div style={{ color: "red" }} className="input-field variable_error">{errors.inputType.message}</div>
                                        )}
                                    </div>

                                </div>
                                <div className="separator"></div>
                                <div className="output-section">
                                    <h2 className='mb-3 pb-1'>Output</h2>
                                    <div className='d-flex align-items-center position-relative gap-4'>
                                        <div className='position-relative modal_select'>
                                            <select {...register('outputType')} className={errors.outputType ? 'is-invalid' : ''}>
                                                <option value="">ReturnType</option>
                                                <option value="Int">Int</option>
                                                <option value="Char">Char</option>
                                            </select>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M17.0956 11.5676C17.5198 11.2141 17.5772 10.5835 17.2236 10.1592C16.87 9.73493 16.2395 9.67761 15.8152 10.0312L17.0956 11.5676ZM12.2127 14.335L11.5725 15.1032C11.9434 15.4122 12.482 15.4122 12.8529 15.1032L12.2127 14.335ZM8.61021 10.0312C8.18594 9.67761 7.55537 9.73493 7.20181 10.1592C6.84824 10.5835 6.90557 11.2141 7.32985 11.5676L8.61021 10.0312ZM15.8152 10.0312L11.5725 13.5667L12.8529 15.1032L17.0956 11.5676L15.8152 10.0312ZM12.8529 13.5667L8.61021 10.0312L7.32985 11.5676L11.5725 15.1032L12.8529 13.5667ZM20.5999 12C20.5999 16.7496 16.7496 20.6 11.9999 20.6V22.6C17.8541 22.6 22.5999 17.8542 22.5999 12H20.5999ZM11.9999 20.6C7.25025 20.6 3.3999 16.7496 3.3999 12H1.3999C1.3999 17.8542 6.14568 22.6 11.9999 22.6V20.6ZM3.3999 12C3.3999 7.25034 7.25025 3.39999 11.9999 3.39999V1.39999C6.14568 1.39999 1.3999 6.14578 1.3999 12H3.3999ZM11.9999 3.39999C16.7496 3.39999 20.5999 7.25034 20.5999 12H22.5999C22.5999 6.14578 17.8541 1.39999 11.9999 1.39999V3.39999Z" fill="black" />
                                            </svg>
                                        </div>
                                        <input type="text" placeholder="VariableName"
                                            className={`input-field ${errors.outputVariable ? 'is-invalid' : ''}`}
                                            {...register('outputVariable')} />
                                        {errors.outputType && (
                                            <div style={{ color: "red" }} className="input-field variable_error">{errors.outputType.message}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-4 pt-3 d-flex align-items-center flex-wrap flex-lg-row flex-md-row flex-row-reverse gap-4 justify-content-center'>
                            <button type="submit" style={{minHeight:"56px"}} className='btn btn-outline-primary w-auto' onClick={handleCancel} >Cancel</button >
                            <button type="submit" className='btn btn-primary' >Add Variables</button>
                            <button type="button" className='btn btn-primary' onClick={openAddColumnModel}>Add Columns</button>
                        </div>
                    </div>

                </form>
            </div>
        </>
    )
}
export default GenerateVariable;