import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';

export const Cancelled: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Cancelled!</h1>
        <p className="text-l mb-8">Your payment was cancelled. If you think there is a mistake, please contact us.</p>
        <Button asChild>
          <Link to="/">
            Go back to Home
          </Link>
        </Button>
      </Card>
    </div>
  );
};
