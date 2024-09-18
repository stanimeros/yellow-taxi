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
    adults, children, duration, 
    distance, luggage, vehicleOption, 
    email, name, areaCode, phone, 
    ferryName, airplaneName, 
    infantSeats, babySeats, 
    boosterSeats, bulkyLuggage, notes,
    price, setDuration, setDistance
  } = globalState;

  return (
    <Card className="flex flex-col justify-between shadow-lg overflow-hidden w-1/3 h-fit">
      <div className='p-6'>
        <h3 className="text-2xl font-bold mb-4 text-primary">Trip Summary</h3>
        <div className="space-y-3">
          {startDestination && <p><strong>From:</strong> {startDestination.description}</p>}
          {endDestination && <p><strong>To:</strong> {endDestination.description}</p>}
          {pickupDateTime && <p><strong>Pickup:</strong> {pickupDateTime.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</p>}
          {returnDateTime && <p><strong>Return:</strong> {returnDateTime.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</p>}
          {(adults > 0 || children > 0) && <p><strong>Passengers:</strong> {adults} adults{children > 0 ? `, ${children} children` : ''}</p>}
          {duration && <p><strong>Duration:</strong> {duration}</p>}
          {distance && <p><strong>Distance:</strong> {distance}</p>}
          {luggage > 0 && <p><strong>Luggage:</strong> {luggage} pieces</p>}
          {vehicleOption && <p><strong>Vehicle:</strong> {vehicleOption.title}</p>}
          {name && <p><strong>Name:</strong> {name}</p>}
          {email && <p><strong>Email:</strong> {email}</p>}
          {areaCode && phone && <p><strong>Phone:</strong> +{areaCode} {phone}</p>}
          {ferryName && <p><strong>Ferry:</strong> {ferryName}</p>}
          {airplaneName && <p><strong>Flight:</strong> {airplaneName}</p>}
          {(infantSeats > 0 || babySeats > 0 || boosterSeats > 0) && (
            <p><strong>Child Seats: </strong> 
              {infantSeats > 0 && `${infantSeats} infant`}
              {babySeats > 0 && `${infantSeats > 0 ? ', ' : ''}${babySeats} baby`}
              {boosterSeats > 0 && `${infantSeats > 0 || babySeats > 0 ? ', ' : ''}${boosterSeats} booster`}
            </p>
          )}
          {bulkyLuggage && <p><strong>Bulky Luggage:</strong> Yes</p>}
          {notes && <p><strong>Notes:</strong> {notes}</p>}
          {price && (
            <p>
              <strong>Total Price:</strong>{" "}
              <span className="text-primary font-bold">{price}</span>
            </p>
          )}
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
