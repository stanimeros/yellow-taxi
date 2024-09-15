import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PassengerPickerProps {
  adults: number;
  children: number;
  setAdults: (value: number) => void;
  setChildren: (value: number) => void;
}

export function PassengerPicker({ adults, children, setAdults, setChildren }: PassengerPickerProps) {
  const MAX_PASSENGERS = 12;

  const updatePassengers = (type: 'adults' | 'children', operation: 'add' | 'subtract') => {
    const setValue = type === 'adults' ? setAdults : setChildren;
    const currentValue = type === 'adults' ? adults : children;
    
    if (operation === 'add' && adults + children < MAX_PASSENGERS) {
      setValue(currentValue + 1);
    } else if (operation === 'subtract' && currentValue > 0) {
      setValue(currentValue - 1);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          {adults} Adult{adults !== 1 ? 's' : ''}, {children} Child{children !== 1 ? 'ren' : ''}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Adults</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updatePassengers('adults', 'subtract')}
                disabled={adults <= 1}
                className="disabled:opacity-40"
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{adults}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updatePassengers('adults', 'add')}
                disabled={adults + children >= MAX_PASSENGERS}
                className="disabled:opacity-40"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Children</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updatePassengers('children', 'subtract')}
                disabled={children <= 0}
                className="disabled:opacity-40"
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{children}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updatePassengers('children', 'add')}
                disabled={adults + children >= MAX_PASSENGERS}
                className="disabled:opacity-40"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
