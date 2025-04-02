import React from 'react'
import MultiStep from 'react-multistep';
import GeneralDetails from './GeneralDetails';
import WorkExpertise from './WorkExpertise';
import WorkField from './WorkField';

const steps = [
    { name: 'Step 1', component: <GeneralDetails /> },
    { name: 'Step 2', component: <WorkField /> },
    { name: 'Step 3', component: <WorkExpertise /> }
  ];

const StepForm = () => {
  return (
    <div>
      <h1>Multi-Step Form</h1>
      <MultiStep steps={steps} />
    </div>
  )
}

export default StepForm