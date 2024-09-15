import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { Map } from '@/components/ui/map';
import { PassengerPicker } from '../ui/passenger-picker';
import { PlaceAutocomplete } from '../ui/place-autocomplete';
import { TimePicker } from '../ui/time-picker';
import { Card } from '../ui/card';
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"
import { GlobalState } from '../objects/GlobalState';

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
    setDuration, setDistance,
    luggage, setLuggage } = globalState;

  const [isReturnEnabled, setIsReturnEnabled] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-primary">Book Your Ride</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="start" className="text-sm font-medium">Start Destination</Label>
              <PlaceAutocomplete
                onSelect={(value) => setStartDestination(value)}
                placeholder="Type a place"
                api={api}
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="end" className="text-sm font-medium">End Destination</Label>
              <PlaceAutocomplete
                onSelect={(value) => setEndDestination(value)}
                placeholder="Type a place"
                api={api}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="pickup-date" className="text-sm font-medium">Pickup Date</Label>
              <DatePicker
                id="pickup-date"
                selected={pickupDateTime}
                onSelect={setPickupDateTime}
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
                  onSelect={setReturnDateTime}
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
              <div className="flex items-center w-full">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setLuggage(prev => Math.max(0, prev - 1))}
                  aria-label="Decrease luggage"
                  disabled={luggage <= 1}
                  className="disabled:opacity-40"
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="mx-4 font-medium">{luggage}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setLuggage(prev => prev + 1)}
                  aria-label="Increase luggage"
                  disabled={luggage >= 12}
                  className="disabled:opacity-40"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Button onClick={() => setStep(2)} className="w-full">Next Step</Button>
        </div>
      </Card>
      <Card className="shadow-lg overflow-hidden">
        <Map
          fromDestinationID={startDestination?.place_id || null}
          toDestinationID={endDestination?.place_id || null}
          setDuration={setDuration}
          setDistance={setDistance}
        />
      </Card>
    </div>
  );
};
