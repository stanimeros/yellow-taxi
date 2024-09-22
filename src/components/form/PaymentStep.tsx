import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { GlobalState } from '../objects/GlobalState';
import { Checkbox } from '../ui/checkbox';
import { Coupon } from '../ui/coupon';
import { Loader2 } from 'lucide-react';

interface PaymentStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  globalState: GlobalState;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ setStep, globalState }) => {

  const {
    api, startDestination,
    endDestination, pickupDateTime,
    returnDateTime, adults,
    children, luggage,
    vehicleOption, email,
    name, areaCode, phone,
    ferryName, airplaneName,
    infantSeats, babySeats,
    boosterSeats, bulkyLuggage,
    notes, coupons
  } = globalState;

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${api}/submit.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDestinationId: startDestination?.place_id,
          endDestinationId: endDestination?.place_id,
          pickupDateTime: formatDateForGreece(pickupDateTime!),
          returnDateTime: returnDateTime ? formatDateForGreece(returnDateTime) : null,
          adults: adults,
          children: children,
          luggage: luggage,
          vehicleOptionId: vehicleOption?.id,
          email: email,
          name: name,
          phone: `${areaCode} ${phone}`,
          ferryName: ferryName,
          airplaneName: airplaneName,
          infantSeats: infantSeats, 
          babySeats: babySeats,
          boosterSeats: boosterSeats,
          bulkyLuggage: bulkyLuggage,
          notes: notes,
          coupons: coupons.join(',')
        }),
      });
      if (!response.ok) { 
        throw new Error('Failed to submit');
      }
      const data = await response.json();
      if (data.status === "success") {
        window.location.href = data.redirect_url;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error while submitting:', error);
    }finally{
      setLoading(false);
    }
  };

  function formatDateForGreece(date: { getMonth: () => number; getDate: () => number; getFullYear: () => number; getTime: () => number; getTimezoneOffset: () => number; }) {
    // Determine if Greece is in DST (Greece follows DST from last Sunday in March to last Sunday in October)
    const isDST = (date.getMonth() > 2 && date.getMonth() < 9) || // Between April (index 3) and September (index 9)
      (date.getMonth() === 2 && date.getDate() >= (31 - (new Date(date.getFullYear(), 2, 1).getDay() + 1))) || // Last Sunday in March
      (date.getMonth() === 9 && date.getDate() < (31 - new Date(date.getFullYear(), 9, 1).getDay())); // Before last Sunday in October
  
    const timezoneOffset = isDST ? 180 : 120; // UTC+3 for DST, UTC+2 for standard time
  
    // Get the current UTC time in milliseconds
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  
    // Calculate the new time by applying the timezone offset (in minutes)
    const newTime = new Date(utcTime + timezoneOffset * 60000);
  
    // Extract the year, month, day, hours, and minutes
    const year = newTime.getFullYear();
    const month = String(newTime.getMonth() + 1).padStart(2, '0');
    const day = String(newTime.getDate()).padStart(2, '0');
    const hours = String(newTime.getHours()).padStart(2, '0');
    const minutes = String(newTime.getMinutes()).padStart(2, '0');
    // const seconds = String(newTime.getSeconds()).padStart(2, '0');
  
    // Return the formatted date-time string
    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  }

  return (
    <Card className="flex flex-col justify-between space-y-4 shadow-lg overflow-hidden p-6 flex-grow h-fit sm:w-1/2">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-primary">Payment</h2>
          <Button variant="outline" onClick={() => setStep(3)}>
            Go Back
          </Button>
        </div>
        <Coupon
          globalState={globalState}
        />
        <p className="text-sm text-gray-600 mb-4">
          Upon clicking "Pay", you will be redirected to our secure payment gateway powered by Stripe. There, you can safely complete your transaction using your preferred payment method.
        </p>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I accept the terms and conditions
          </label>
        </div>
      </div>
      <Button onClick={handleSubmit} className="w-full mt-6 rounded-md flex items-center justify-center gap-2 bg-primary text-white">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Proccessing...</span>
            </>
          ) : (
            <span>Pay</span>
          )}
        </Button>
    </Card>
  );
};
