import React, { useState } from 'react';
import { FirstStep } from '../form/FirstStep';
import { Suggestion } from '../objects/Suggestion';
import { GlobalState } from '../objects/GlobalState';
import { SecondStep } from '../form/SecondStep';

export const BookingForm: React.FC = () => {
  const [step, setStep] = useState(2);

  const [startDestination, setStartDestination] = useState<Suggestion | null>(null);
  const [endDestination, setEndDestination] = useState<Suggestion | null>(null);
  const [pickupDateTime, setPickupDateTime] = useState<Date | undefined>(undefined);
  const [returnDateTime, setReturnDateTime] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [luggage, setLuggage] = useState(0);
  const [vehicleCategory, setVehicleCategory] = useState('');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const api = 'http://localhost/taxi/api'

  const globalState: GlobalState = {
    api, language, setLanguage,
    theme, setTheme,
    startDestination, setStartDestination,
    endDestination, setEndDestination,
    pickupDateTime, setPickupDateTime,
    returnDateTime, setReturnDateTime,
    adults, setAdults,
    children, setChildren,
    duration, setDuration,
    distance, setDistance,
    luggage, setLuggage,
    vehicleCategory, setVehicleCategory,
  };

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
          <span className={step >= 2 ? "text-blue-600 font-semibold" : ""}>Vehicle</span>
          <span className={step >= 3 ? "text-blue-600 font-semibold" : ""}>Details</span>
          <span className={step >= 3 ? "text-blue-600 font-semibold" : ""}>Payment</span>
        </div>
      </div>
      <div>
        {step === 1 && <FirstStep setStep={setStep} globalState={globalState} />}
        {step === 2 && (
          <SecondStep setStep={setStep} globalState={globalState}/>
        )}
        {step === 3 && (
          <></>
          // <ThirdStep />
        )}
      </div>
    </div>
  );
};
