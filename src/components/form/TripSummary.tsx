import React from 'react';
import { Map } from '@/components/ui/map';
import { Card } from '../ui/card';
import { GlobalState } from '../objects/GlobalState';

interface TripSummaryProps {
  globalState: GlobalState;
}

export const TripSummary: React.FC<TripSummaryProps> = ({ globalState }) => {
  const {
    startDestination, endDestination,
    pickupDateTime, returnDateTime,
    adults, children,
    duration, distance,
    setDuration,setDistance
  } = globalState;

  return (
    <Card className="flex flex-col justify-between shadow-lg overflow-hidden">
      <div className='p-6'>
        <h3 className="text-2xl font-bold mb-4 text-primary">Trip Summary</h3>
        <div className="space-y-3">
          <p><strong>From:</strong> {startDestination?.description || 'Select starting point'}</p>
          <p><strong>To:</strong> {endDestination?.description || 'Select destination'}</p>
          <p><strong>Pickup:</strong> {pickupDateTime ? pickupDateTime.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : 'Select pickup date and time'}</p>
          {returnDateTime && (
            <p><strong>Return:</strong> {returnDateTime ? returnDateTime.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : 'Select return date and time'}</p>
          )}
          <p><strong>Passengers:</strong> {adults > 0 || children > 0 ? `${adults} adults${children > 0 ? `, ${children} children` : ''}` : 'Select number of passengers'}</p>
          <p><strong>Duration:</strong> {startDestination && endDestination ? (duration || 'Calculating...') : 'Select destination points'}</p>
          <p><strong>Distance:</strong> {startDestination && endDestination ? (distance || 'Calculating...') : 'Select destination points'}</p>
        </div>
      </div>
      <div className="h-[400px]">
        <Map
          fromDestinationID={startDestination?.place_id || null}
          toDestinationID={endDestination?.place_id || null}
          setDuration={setDuration}
          setDistance={setDistance}
        />
      </div>
    </Card>
  );
}
