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
    <Card className="flex flex-col justify-between shadow-lg overflow-hidden flex-shrink w-[300px] h-fit mx-auto">
      <div className='p-4 flex flex-col gap-2'>
        <h3 className="text-2xl font-bold mb-2 text-primary">Trip Summary</h3>
        <h4 className='text-l font-bold'>Route {vehicleOption && `- ${vehicleOption.title}`}</h4>
        {pickupDateTime && <p>Pickup: {pickupDateTime.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</p>}
        {returnDateTime && <p>Return: {returnDateTime.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</p>}
        <p>{adults} adults{children > 0 && `, ${children} children`}{luggage > 0 ? ` and  ${luggage} luggage pieces` : ` and no luggage`}</p>
        {(name || email || (areaCode && phone)) &&
          <>
            <h4 className='text-l font-bold'>Book Details</h4>
            {name && <p>{name}</p>}
            {email && <p>{email}</p>}
            {areaCode && phone && <p>{`(+${areaCode}) ${phone}`}</p>}
          </>
        }
        {(ferryName || airplaneName || infantSeats > 0 ||
        babySeats > 0 || boosterSeats > 0 || bulkyLuggage) &&
          <>
            <h4 className='text-l font-bold'>More information</h4>
            {ferryName && <p>Ferry: {ferryName}</p>}
            {airplaneName && <p>Flight: {airplaneName}</p>}
            {(infantSeats > 0 || babySeats > 0 || boosterSeats > 0) && (
              <p>
                {`Child Seats: `}
                {infantSeats > 0 && `${infantSeats} infant`}
                {babySeats > 0 && `${infantSeats > 0 ? ', ' : ''}${babySeats} baby`}
                {boosterSeats > 0 && `${infantSeats > 0 || babySeats > 0 ? ', ' : ''}${boosterSeats} booster`}
              </p>
            )}
            {bulkyLuggage && <p>Bulky Luggage: Yes</p>}
          </>
        }
        {notes && 
          <>
            <h4 className='text-l font-bold'>Notes</h4>
            <p>{notes}</p>
          </>
        } 
        {price && (
          <p className='text-xl mt-6'>
            <strong>{`Total Price: `}</strong>
            <span className="text-primary font-bold">{`${price.toFixed(2)}€`}</span>
          </p>
        )}
      </div>
      {distance && duration && <div>{distance} - {duration}</div>}
      <div className='h-[400px]'>
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
