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


interface FirstStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

interface Suggestion {
  place_id: string;
  description: string;
}

export const FirstStep: React.FC<FirstStepProps> = ({ setStep }) => {
  const [startDestination, setStartDestination] = useState<Suggestion | null>(null);
  const [endDestination, setEndDestination] = useState<Suggestion | null>(null);
  const [pickupDateTime, setPickupDateTime] = useState<Date | undefined>(undefined);
  const [returnDateTime, setReturnDateTime] = useState<Date | undefined>(undefined);
  const [isReturnEnabled, setIsReturnEnabled] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [luggage, setLuggage] = useState(0);

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
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="end" className="text-sm font-medium">End Destination</Label>
              <PlaceAutocomplete
                onSelect={(value) => setEndDestination(value)}
                placeholder="Type a place"
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
              onCheckedChange={setIsReturnEnabled}
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
                onPassengersChange={(newAdults, newChildren) => {
                  setAdults(newAdults);
                  setChildren(newChildren);
                }}
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
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="mx-4 font-medium">{luggage}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setLuggage(prev => prev + 1)}
                  aria-label="Increase luggage"
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
        <div className='p-6'>
          <h3 className="text-2xl font-bold mb-4 text-primary">Trip Summary</h3>
          <div className="space-y-3">
            <p><strong>From:</strong> {startDestination?.description || 'Select starting point'}</p>
            <p><strong>To:</strong> {endDestination?.description || 'Select destination'}</p>
            <p><strong>Pickup:</strong> {pickupDateTime ? pickupDateTime.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : 'Select pickup date and time'}</p>
            {isReturnEnabled && (
              <p><strong>Return:</strong> {returnDateTime ? returnDateTime.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : 'Select return date and time'}</p>
            )}
            <p><strong>Passengers:</strong> {adults > 0 || children > 0 ? `${adults} adults${children > 0 ? `, ${children} children` : ''}` : 'Select number of passengers'}</p>
            <p><strong>Duration:</strong> {startDestination && endDestination ? (duration || 'Calculating...') : 'Select destination points'}</p>
            <p><strong>Distance:</strong> {startDestination && endDestination ? (distance || 'Calculating...') : 'Select destination points'}</p>
          </div>
        </div>
        <div className="h-[400px] lg:h-[500px]">
          <Map
            fromDestinationID={startDestination?.place_id || null}
            toDestinationID={endDestination?.place_id || null}
            setDuration={setDuration}
            setDistance={setDistance}
          />
        </div>
      </Card>
    </div>
  );
};
