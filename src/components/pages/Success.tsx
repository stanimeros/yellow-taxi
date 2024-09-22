import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';

export const Success: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Booking Successful!</h1>
        <p className="text-l mb-8">Thank you for booking your transfer trip.</p>
        <Button asChild>
          <Link to="/">
            Go back to Home
          </Link>
        </Button>
      </Card>
    </div>
  );
};
