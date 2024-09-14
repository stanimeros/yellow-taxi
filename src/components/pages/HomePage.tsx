import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-6">Welcome to Our Website</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        This is a basic homepage created with React, Tailwind CSS, and shadcn UI components.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link to="/about">About Us</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/contact">Contact</Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
