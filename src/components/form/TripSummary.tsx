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
    <Card className="flex flex-col justify-between shadow-lg overflow-hidden w-full md:w-fit h-fit bg-white rounded-lg p-4 space-y-4">
      {/* Trip Summary */}
      <div className="text-2xl font-bold text-gray-900">Trip Summary</div>

      {/* Dates and Passengers Info */}
      <div>
        {vehicleOption && <div className="text-lg font-medium text-gray-700">Route - {vehicleOption.title}</div>}
        <div className="mt-2 space-y-1">
          {pickupDateTime && <p className="text-sm text-gray-600">Pickup: {pickupDateTime.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</p>}
          {returnDateTime && <p className="text-sm text-gray-600">Return: {returnDateTime.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</p>}
          <p className="text-sm text-gray-600">
            {adults} adults{children > 0 && `, ${children} children`}{luggage > 0 ? `, ${luggage} luggage pieces` : `, no luggage`}
          </p>
        </div>
      </div>

      {/* Booking Details */}
      {(name || email || (phoneCode && phone)) && (
        <div>
          <div className="text-lg font-semibold text-gray-700">Booking Details</div>
          <div className="mt-2 space-y-1">
            {name && <p className="text-sm text-gray-600">{name}</p>}
            {email && <p className="text-sm text-gray-600">{email}</p>}
            {(phoneCode || phone) && <p className="text-sm text-gray-600">{`(+${phoneCode}) ${phone}`}</p>}
          </div>
        </div>
      )}

      {/* More Information */}
      {(ferryName || airplaneName || infantSeats > 0 || babySeats > 0 || boosterSeats > 0 || bulkyLuggage) && (
        <div>
          <div className="text-lg font-semibold text-gray-700">More Information</div>
          <div className="mt-2 space-y-1">
            {ferryName && <p className="text-sm text-gray-600">Ferry: {ferryName}</p>}
            {airplaneName && <p className="text-sm text-gray-600">Flight: {airplaneName}</p>}
            {(infantSeats > 0 || babySeats > 0 || boosterSeats > 0) && (
              <p className="text-sm text-gray-600">
                {infantSeats > 0 && `${infantSeats} infant`}
                {babySeats > 0 && `${infantSeats > 0 ? ', ' : ''}${babySeats} baby`}
                {boosterSeats > 0 && `${infantSeats > 0 || babySeats > 0 ? ', ' : ''}${boosterSeats} booster`}
                {` seats`}
              </p>
            )}
            {bulkyLuggage && <p className="text-sm text-gray-600">Bulky Luggage: Yes</p>}
          </div>
        </div>
      )}

      {/* Notes Section */}
      {notes && (
        <div>
          <div className="text-lg font-semibold text-gray-700">Notes</div>
          <p className="mt-2 text-sm text-gray-600">{notes}</p>
        </div>
      )}

      {/* Price and Distance/Duration */}
      <div className="space-y-4 pt-10">
        {price && (
          <div className="text-center space-y-1">
            <div className="text-2xl font-semibold text-gray-900">Total Price:</div>
            <div className="text-3xl font-bold text-green-600">{`${price.toFixed(2)}€`}</div>
            <div className="text-sm text-gray-500">(including VAT)</div>
          </div>
        )}
        {distance && duration && (
          <div className="text-center text-sm text-gray-600">
            Distance: {distance} | Duration: {duration}
          </div>
        )}
      </div>
    </Card>
  );
}
