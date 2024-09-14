import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  id?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

export function DateTimePicker({ id, selected, onSelect }: DateTimePickerProps) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "dd/MM/yyyy HH:mm") : <span>Pick date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
        />
        <div className="p-4 border-t">
          <div className="flex items-center justify-center space-x-4">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="23"
                value={selected ? format(selected, "HH") : ""}
                onChange={(e) => {
                  if (selected) {
                    const newDate = new Date(selected);
                    newDate.setHours(parseInt(e.target.value));
                    onSelect?.(newDate);
                  }
                }}
                className="w-14 text-center rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="text-xl font-semibold text-gray-500">:</span>
              <Input
                type="number"
                min="0"
                max="59"
                step="5"
                value={selected ? format(selected, "mm") : ""}
                onChange={(e) => {
                  if (selected) {
                    const newDate = new Date(selected);
                    newDate.setMinutes(parseInt(e.target.value));
                    onSelect?.(newDate);
                  }
                }}
                className="w-14 text-center rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
