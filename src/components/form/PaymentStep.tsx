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
          startDestination: startDestination,
          endDestinationId: endDestination,
          pickupDateTime: pickupDateTime?.toISOString(),
          returnDateTime: returnDateTime?.toISOString(),
          adults: adults,
          children: children,
          luggage: luggage,
          vehicleOption: vehicleOption,
          email: email,
          name: name,
          areaCode: areaCode,
          phone: phone,
          ferryName: ferryName,
          airplaneName: airplaneName,
          infantSeats: infantSeats, 
          babySeats: babySeats,
          boosterSeats: boosterSeats,
          bulkyLuggage: bulkyLuggage,
          notes: notes,
          coupons: coupons
        }),
      });
      if (!response.ok) { 
        throw new Error('Failed to submit');
      }
      const data = await response.json();
      if (data.status === "success") {
        console.log('Success');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error while submitting:', error);
    }finally{
      // setLoading(false);
    }
  };

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
