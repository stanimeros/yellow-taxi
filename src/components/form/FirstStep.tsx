import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import {GoogleMap, useLoadScript } from '@react-google-maps/api';
import { PassengerPicker } from '../ui/passenger-picker';
import { PlaceAutocomplete } from '../ui/place-autocomplete';
import { TimePicker } from '../ui/time-picker';

interface FirstStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const FirstStep: React.FC<FirstStepProps> = ({ setStep }) => {
  const [startDestination, setStartDestination] = useState('');
  const [endDestination, setEndDestination] = useState('');
  const [pickupDateTime, setPickupDateTime] = useState<Date | undefined>(undefined);
  const [returnDateTime, setReturnDateTime] = useState<Date | undefined>(undefined);
  const [isReturnEnabled, setIsReturnEnabled] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
    libraries: ['places'],
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex">
      <div className="w-2/3 p-4">
        <h2 className="text-2xl font-bold mb-4">Book Your Ride</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="start">Start Destination</Label>
            <PlaceAutocomplete
              onSelect={(value) => setStartDestination(value)}
              placeholder="Enter start location"
            />
          </div>
          <div>
            <Label htmlFor="end">End Destination</Label>
            <PlaceAutocomplete
              onSelect={(value) => setEndDestination(value)}
              placeholder="Enter end location"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="pickup-date">Pickup Date</Label>
            <DatePicker
              id="pickup-date"
              selected={pickupDateTime}
              onSelect={setPickupDateTime}
            />
            <Label htmlFor="pickup-time">Pickup Time</Label>
            <TimePicker
              id="pickup-time"
              selected={pickupDateTime}
              onSelect={setPickupDateTime}
            />
            <Label htmlFor="return-switch">Return Date</Label>
            <Switch
              id="return-switch"
              checked={isReturnEnabled}
              onCheckedChange={setIsReturnEnabled}
            />
          </div>
          {isReturnEnabled && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="return-date">Return Date</Label>
              <DatePicker
                id="return-date"
                selected={returnDateTime}
                onSelect={setReturnDateTime}
              />
              <Label htmlFor="return-time">Return Time</Label>
              <TimePicker
                id="return-time"
                selected={returnDateTime}
                onSelect={setReturnDateTime}
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Label>Passengers</Label>
            <PassengerPicker
              onPassengersChange={(newAdults, newChildren) => {
                setAdults(newAdults);
                setChildren(newChildren);
              }}
            />
          </div>
          <Button onClick={() => setStep(2)}>Next Step</Button>
        </div>
      </div>
      <div className="w-1/3 p-4">
        <h3 className="text-xl font-bold mb-4">Trip Summary</h3>
        <div className="space-y-2">
          <p><strong>From:</strong> {startDestination}</p>
          <p><strong>To:</strong> {endDestination}</p>
          <p><strong>Pickup:</strong> {pickupDateTime?.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</p>
          {isReturnEnabled && (
            <p><strong>Return:</strong> {returnDateTime?.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</p>
          )}
          <p><strong>Passengers:</strong> {adults} adults, {children} children</p>
        </div>
        <div className="mt-4 h-64">
          <GoogleMap
            zoom={10}
            center={{ lat: 0, lng: 0 }}
            mapContainerClassName="w-full h-full"
          >
            {/* Add markers for start and end destinations when coordinates are available */}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};
