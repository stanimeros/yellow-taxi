import React from 'react';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"

interface LuggagePickerProps {
  luggage: number;
  setLuggage: React.Dispatch<React.SetStateAction<number>>;
}

export const LuggagePicker: React.FC<LuggagePickerProps> = ({ luggage, setLuggage }) => {
  return (
    <div className="flex items-center w-full">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setLuggage(prev => Math.max(0, prev - 1))}
        aria-label="Decrease luggage"
        disabled={luggage <= 0}
        className="disabled:opacity-40"
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <span className="mx-4 font-medium">{luggage}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setLuggage(prev => prev + 1)}
        aria-label="Increase luggage"
        disabled={luggage >= 12}
        className="disabled:opacity-40"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

