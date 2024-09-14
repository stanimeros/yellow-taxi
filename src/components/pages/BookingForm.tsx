import React, { useState } from 'react';
import { FirstStep } from '../form/FirstStep';
import { Card } from "@/components/ui/card";

export const BookingForm: React.FC = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="flex justify-center items-center m-16">
      <Card className="w-full max-w-[1200px] p-6">
        {step === 1 && <FirstStep setStep={setStep} />}
        {step === 2 && (
          <></>
          // <SecondStep setStep={setStep} />
        )}
        {step === 3 && (
          <></>
          // <ThirdStep />
        )}
      </Card>
    </div>
  );
};
