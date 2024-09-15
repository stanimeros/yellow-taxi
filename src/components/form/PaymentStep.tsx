import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { GlobalState } from '../objects/GlobalState';
import { TripSummary } from './TripSummary';
import { Checkbox } from '../ui/checkbox';

interface PaymentStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  globalState: GlobalState;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ setStep, globalState }) => {
  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="flex flex-col justify-between space-y-4 lg:col-span-2 shadow-lg overflow-hidden p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold text-primary">Payment</h2>
            <Button variant="outline" onClick={() => setStep(3)}>
              Go Back
            </Button>
          </div>
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
        <Button onClick={() => setStep(4)} className="w-full mt-6">Pay</Button>
      </Card>
      <TripSummary globalState={globalState}/>
    </div>
  );
};
