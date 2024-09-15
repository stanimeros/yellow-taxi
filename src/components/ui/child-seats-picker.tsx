import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ChildSeatsPickerProps {
  infantSeats: number;
  babySeats: number;
  boosterSeats: number;
  setInfantSeats: (value: number) => void;
  setBabySeats: (value: number) => void;
  setBoosterSeats: (value: number) => void;
}
export function ChildSeatsPicker({ infantSeats, babySeats, boosterSeats, setInfantSeats, setBabySeats, setBoosterSeats }: ChildSeatsPickerProps) {
  const MAX_SEATS = 10;

  const updateSeats = (type: 'infant' | 'baby' | 'booster', operation: 'add' | 'subtract') => {
    const setValue = {
      'infant': setInfantSeats,
      'baby': setBabySeats,
      'booster': setBoosterSeats
    }[type];
    const currentValue = { 'infant': infantSeats, 'baby': babySeats, 'booster': boosterSeats }[type];
    
    let newValue = currentValue;
    if (operation === 'add' && infantSeats + babySeats + boosterSeats < MAX_SEATS) {
      newValue = currentValue + 1;
    } else if (operation === 'subtract' && currentValue > 0) {
      newValue = currentValue - 1;
    }

    setValue(newValue);
  };

  const renderSeatControl = (type: 'infant' | 'baby' | 'booster', label: string) => {
    const value = { 'infant': infantSeats, 'baby': babySeats, 'booster': boosterSeats }[type];
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateSeats(type, 'subtract')}
            disabled={value <= 0}
            className="disabled:opacity-40"
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{value}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateSeats(type, 'add')}
            disabled={infantSeats + babySeats + boosterSeats >= MAX_SEATS}
            className="disabled:opacity-40"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          {infantSeats} Infant Seat{infantSeats !== 1 ? 's' : ''}, {babySeats} Baby Seat{babySeats !== 1 ? 's' : ''}, {boosterSeats} Booster Seat{boosterSeats !== 1 ? 's' : ''}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          {renderSeatControl('infant', 'Infant Seats')}
          {renderSeatControl('baby', 'Baby Seats')}
          {renderSeatControl('booster', 'Booster Seats')}
        </div>
      </PopoverContent>
    </Popover>
  );
}
