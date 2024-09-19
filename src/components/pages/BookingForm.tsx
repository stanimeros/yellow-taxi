import React, { useState } from 'react';
import { RouteStep } from '../form/RouteStep';
import { Suggestion } from '../objects/Suggestion';
import { GlobalState } from '../objects/GlobalState';
import { OptionSteps } from '../form/OptionsStep';
import { DetailsStep } from '../form/DetailsStep';
import { PaymentStep } from '../form/PaymentStep';
import { VehicleOption } from '../objects/VehicleOption';
import { TripSummary } from '../form/TripSummary';

export const BookingForm: React.FC = () => {
  const [step, setStep] = useState(1);

  const [startDestination, setStartDestination] = useState<Suggestion | null>(null);
  const [endDestination, setEndDestination] = useState<Suggestion | null>(null);
  const [pickupDateTime, setPickupDateTime] = useState<Date | undefined>(undefined);
  const [returnDateTime, setReturnDateTime] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [luggage, setLuggage] = useState(0);
  const [vehicleOption, setVehicleOption] = useState<VehicleOption | null>(null);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [phone, setPhone] = useState('');
  const [ferryName, setFerryName] = useState('');
  const [airplaneName, setAirplaneName] = useState('');
  const [infantSeats, setInfantSeats] = useState(0);
  const [babySeats, setBabySeats] = useState(0);
  const [boosterSeats, setBoosterSeats] = useState(0);
  const [bulkyLuggage, setBulkyLuggage] = useState(false);
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState(0);
  const [coupons, setCoupons] = useState<string[]>([]);

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
    vehicleOption, setVehicleOption,
    email, setEmail,
    name, setName,
    areaCode, setAreaCode,
    phone, setPhone,
    ferryName, setFerryName,
    airplaneName, setAirplaneName,
    infantSeats, setInfantSeats, 
    babySeats, setBabySeats,
    boosterSeats, setBoosterSeats,
    bulkyLuggage, setBulkyLuggage,
    notes, setNotes,
    price, setPrice,
    coupons, setCoupons
  };

  return (
    <div className="m-[5%]">
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
        {step === 1 && <RouteStep setStep={setStep} globalState={globalState} />}
        {step > 1 && 
          <div className="flex flex-wrap gap-12 w-full">
            {step === 2 && <OptionSteps setStep={setStep} globalState={globalState}/>}
            {step === 3 && <DetailsStep setStep={setStep} globalState={globalState} />}
            {step === 4 && <PaymentStep setStep={setStep} globalState={globalState}/>}
            <TripSummary globalState={globalState}/>
          </div>
        }
      </div>
    </div>
  );
};
