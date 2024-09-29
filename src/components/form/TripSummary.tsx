import React from 'react';
import { Card } from '../ui/card';
import { GlobalState } from '../objects/GlobalState';

interface TripSummaryProps {
  globalState: GlobalState;
}

export const TripSummary: React.FC<TripSummaryProps> = ({ globalState }) => {
  const {
    pickupDateTime, returnDateTime, 
    adults, children, duration, 
    distance, luggage, vehicleOption, 
    email, name, phoneCode, phone, 
    ferryName, airplaneName, 
    infantSeats, babySeats, price,
    boosterSeats, bulkyLuggage, notes,
  } = globalState;

  return (  
    <Card className="flex flex-col justify-between shadow-lg overflow-hidden flex-shrink w-[300px] mx-auto bg-primary text-white">
      <div>
        <div className="text-2xl font-bold px-2 py-4 border-b border-gray-400">Trip Summary</div>
        <div className='text-l font-bold p-2'>Route {vehicleOption && `- ${vehicleOption.title}`}</div>
        <div className='px-4 flex flex-col gap-2'>
          {pickupDateTime && <p>Pickup: {pickupDateTime.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</p>}
          {returnDateTime && <p>Return: {returnDateTime.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</p>}
          <p>{adults} adults{children > 0 && `, ${children} children`}{luggage > 0 ? ` and  ${luggage} luggage pieces` : ` and no luggage`}</p>
        </div>
        {(name || email || (phoneCode && phone)) &&
          <>
            <div className='text-l font-bold p-2'>Book Details</div>
            <div className='px-4 flex flex-col gap-2'>
              {name && <p>{name}</p>}
              {email && <p>{email}</p>}
              {phoneCode && phone && <p>{`(+${phoneCode}) ${phone}`}</p>}
            </div>
          </>
        }
        {(ferryName || airplaneName || infantSeats > 0 ||
        babySeats > 0 || boosterSeats > 0 || bulkyLuggage) &&
          <>
            <div className='text-l font-bold p-2'>More information</div>
            <div className='px-4 flex flex-col gap-2'>
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
            </div>
          </>
        }
        {notes && 
          <>
            <div className='text-l font-bold p-2'>Notes</div>
            <p className='px-4'>{notes}</p>
          </>
        } 
      </div>
      <div>
        {distance && duration && (
          <div className="text-xs text-center font-bold p-2 border-t border-gray-400">
            Distance: {distance} | Duration: {duration}
          </div>
        )}
        {price && (
          <p className='text-xl font-bold mt-6 p-2'>
            {`Total Price: ${price.toFixed(2)}€`}
          </p>
        )}
      </div>
    </Card>
  );
}
