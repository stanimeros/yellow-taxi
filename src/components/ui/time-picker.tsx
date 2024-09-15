import { ClockIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TimePickerProps {
  id?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

export function TimePicker({ id, selected, onSelect }: TimePickerProps) {
  const handleTimeChange = (type: 'hours' | 'minutes', increment: number) => {
    if (selected) {
      const newDate = new Date(selected);
      if (type === 'hours') {
        newDate.setHours((newDate.getHours() + increment + 24) % 24);
      } else {
        newDate.setMinutes((newDate.getMinutes() + increment + 60) % 60);
      }
      onSelect?.(newDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <ClockIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "HH:mm") : <span>Pick time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="flex justify-between space-x-2">
            <div className="flex flex-col items-center space-y-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleTimeChange('hours', 1)}
              >
                <ChevronUpIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleTimeChange('hours', -1)}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2 text-4xl px-4">
              <div>
                {selected ? format(selected, "HH") : "--"}
              </div>
              <div>:</div>
              <div>
                {selected ? format(selected, "mm") : "--"}
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleTimeChange('minutes', 5)}
              >
                <ChevronUpIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleTimeChange('minutes', -5)}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
