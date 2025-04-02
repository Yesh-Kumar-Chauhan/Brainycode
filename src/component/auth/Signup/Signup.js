import React, { useRef, useState } from 'react'
import { MultiStep } from 'react-multistep';
import GeneralDetails from './GeneralDetails';
import WorkExpertise from './WorkExpertise';
import WorkField from './WorkField';
// import SignIn from '../Signin';
import { useUser } from '../../../UserContext';

const SignUp = () => {
  // const [currentStep, setCurrentStep] = useState(-1);
  const { currentStep, setCurrentStep } = useUser();

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const steps = [
    { name: 'General Details', component: <GeneralDetails onNext={nextStep} onBack={handleBack}/> },
    { name: 'Work Field', component: <WorkField onNext={nextStep} onBack={handleBack}/> },
    { name: 'Work Expertise', component: <WorkExpertise onNext={nextStep} onBack={handleBack}/> },
    // { name: 'Signin', component: <SignIn /> },
  ];

  return (
    <>
      {currentStep >= 0 ? (
        steps.map((step, index) => (
          index === currentStep && step.component
        ))
      ) : (
        <section className="banner_section generate_banner login_section position-relative d-flex align-items-center">
          <div className="container position-relative" style={{ zIndex: 9 }}>
            <div className="row py-lg-5 position-relative">
              <div className="col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-center">
                <div className="banner_content login_form">
                  <h1 className="m-0">Join the Adventure!</h1>
                  <p className="mt-3 pt-lg-1 mb-4 pb-lg-3 pb-md-2">Start your journey to unlock the secrets of Brainycode. Whether you're a student, a seasoned professional, or a spy (we promise we won't tell), we've got something exciting for you!</p>
                  <button type="button" className="btn btn-primary inner_button" onClick={nextStep}>Get Started</button>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12 col-12 mt-lg-0 mt-md-4 mt-4">
                <div className="sign_up_img">
                  <img src="images/getStarted.png" width="100%" alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default SignUp