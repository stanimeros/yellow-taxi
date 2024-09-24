import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { PassengerPicker } from '../ui/passenger-picker';
import { PlaceAutocomplete } from '../ui/place-autocomplete';
import { TimePicker } from '../ui/time-picker';
import { Card } from '../ui/card';
import { GlobalState } from '../objects/GlobalState';
import { LuggagePicker } from '../ui/luggage-picker';

interface RouteStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  globalState: GlobalState;
}

export const RouteStep: React.FC<RouteStepProps> = ({ setStep, globalState }) => {
  const { 
    api, startDestination, setStartDestination,
    endDestination, setEndDestination,
    pickupDateTime, setPickupDateTime,
    returnDateTime, setReturnDateTime,
    adults, setAdults, 
    children, setChildren,
    luggage, setLuggage } = globalState;

  const [isReturnEnabled, setIsReturnEnabled] = useState(returnDateTime != null);
  const [missingStartDestination, setMissingStartDestination] = useState(false);
  const [missingEndDestination, setMissingEndDestination] = useState(false);
  const [missingPickupDate, setMissingPickupDate] = useState(false);
  
  const handleSetStepToTwo = () => {
    if (!startDestination) {
      setMissingStartDestination(true);
    }
    if (!endDestination) {
      setMissingEndDestination(true);
    }
    if (!pickupDateTime) {
      setMissingPickupDate(true);
    }
    
    if (isReturnEnabled && !returnDateTime){
      setIsReturnEnabled(false);
    }

    if (!startDestination || !endDestination || !pickupDateTime){
      return;
    }
    setStep(2);
  };

  return (
    <Card className="flex flex-col justify-between space-y-4 shadow-lg overflow-hidden p-6 flex-grow h-fit sm:w-1/2">
      <h2 className="text-3xl font-bold mb-6 text-primary">Book Your Ride</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2 w-full">
            <Label htmlFor="start" className={`text-sm font-medium ${missingStartDestination ? 'text-red-500' : ''}`}>Start Destination</Label>
            <PlaceAutocomplete
              api={api}
              selectedDescription={startDestination?.description}
              onSelect={(value) => {
                setStartDestination(value);
                setMissingStartDestination(false);
              }}
            />
          </div>
          <div className="flex flex-col space-y-2 w-full">
          <Label htmlFor="end" className={`text-sm font-medium ${missingEndDestination ? 'text-red-500' : ''}`}>End Destination</Label>
            <PlaceAutocomplete
              api={api}
              selectedDescription={endDestination?.description}
              onSelect={(value) => {
                setEndDestination(value);
                setMissingEndDestination(false);
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2 w-full">
            <Label htmlFor="pickup-date" className={`text-sm font-medium ${missingPickupDate ? 'text-red-500' : ''}`}>Pickup Date</Label>
            <DatePicker
              id="pickup-date"
              selected={pickupDateTime}
              onSelect={(datetime) => {
                if (datetime) {
                  const newDate = new Date(datetime);
                  newDate.setHours(9, 0, 0, 0);
                  setPickupDateTime(newDate);
                  setMissingPickupDate(false);
                }
              }}
            />
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <Label htmlFor="pickup-time" className="text-sm font-medium">Pickup Time</Label>
            <TimePicker
              id="pickup-time"
              selected={pickupDateTime}
              onSelect={setPickupDateTime}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="return-switch"
            checked={isReturnEnabled}
            onCheckedChange={(checked) => {
              setIsReturnEnabled(checked);
              if (!checked) {
                setReturnDateTime(undefined);
              }
            }}
          />
          <Label htmlFor="return-switch" className="text-sm font-medium">
            Add Return Trip
            <span className="ml-1 text-xs text-green-600 font-normal">(Discount applied)</span>
          </Label>
        </div>
        {isReturnEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="return-date" className="text-sm font-medium">Return Date</Label>
              <DatePicker
                id="return-date"
                selected={returnDateTime}
                onSelect={(datetime) => {
                  if (datetime) {
                    const newDate = new Date(datetime);
                    newDate.setHours(9, 0, 0, 0);
                    setReturnDateTime(newDate);
                  }
                }}
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="return-time" className="text-sm font-medium">Return Time</Label>
              <TimePicker
                id="return-time"
                selected={returnDateTime}
                onSelect={setReturnDateTime}
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2 w-full">
            <Label className="text-sm font-medium">Passengers</Label>
            <PassengerPicker
              adults={adults}
              setAdults={setAdults}
              children={children}
              setChildren={setChildren}
            />
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <Label className="text-sm font-medium">Luggage</Label>
            <LuggagePicker
              luggage={luggage}
              setLuggage={setLuggage}
            />
          </div>
        </div>
        <Button onClick={handleSetStepToTwo} className="w-full">Next Step</Button>
      </div>
    </Card>
  );
};
