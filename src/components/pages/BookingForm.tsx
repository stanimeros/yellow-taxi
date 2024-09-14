import React, { useState } from 'react';
import { FirstStep } from '../form/FirstStep';

export const BookingForm: React.FC = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="m-16">
      <div className="w-full mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 4)* 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span className={step >= 0 ? "text-blue-600 font-semibold" : ""}>Welcome</span>
          <span className={step >= 1 ? "text-blue-600 font-semibold" : ""}>Route</span>
          <span className={step >= 2 ? "text-blue-600 font-semibold" : ""}>Details</span>
          <span className={step >= 3 ? "text-blue-600 font-semibold" : ""}>Payment</span>
          <span className={step >= 3 ? "text-blue-600 font-semibold" : ""}>Confirmation</span>
        </div>
      </div>
      <div>
        {step === 1 && <FirstStep setStep={setStep} />}
        {step === 2 && (
          <></>
          // <SecondStep setStep={setStep} />
        )}
        {step === 3 && (
          <></>
          // <ThirdStep />
        )}
      </div>
    </div>
  );
};
