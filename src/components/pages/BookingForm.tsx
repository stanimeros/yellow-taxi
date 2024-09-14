import React, { useState } from 'react';
import { FirstStep } from '../form/FirstStep';

export const BookingForm: React.FC = () => {
  const [step, setStep] = useState(1);

  
  if (step === 1) {
    return <FirstStep
      setStep={setStep}
     />;
  } else if (step === 2) {
    // return <SecondStep
    //   setStep={setStep}
    //  />;
  } else if (step === 3) {
    // return <ThirdStep />;
  }
};
