import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { GlobalState } from '../objects/GlobalState';
import { VehicleOption } from '../objects/VehicleOption';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';
import { Label } from '../ui/label';

interface OptionsStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  globalState: GlobalState;
}

export const OptionSteps: React.FC<OptionsStepProps> = ({ setStep, globalState }) => {
  const { 
    api, startDestination, endDestination,
    coupons, returnDateTime, adults, children,
    setPrice, vehicleOption, setVehicleOption,
  } = globalState;

  const [options, setOptions] = useState<VehicleOption[]>([]);
  const [missingSelectedOption, setMissingSelectedOption] = useState(false);

  useEffect(() => {
    const fetchoptions = async () => {
      try {
        const response = await fetch(`${api}/get_options.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startId: startDestination?.place_id,
            endId: endDestination?.place_id,
            returnDate: returnDateTime?.toISOString() ?? null,
            passengers: adults + children, 
            coupons: [...coupons].join(','), 
          }),
        });
        if (!response.ok) { 
          throw new Error('Failed to fetch options');
        }
        const data = await response.json();
        if (data.status === "success" && Array.isArray(data.options)) {
          const vehicleOptions = data.options.map((option: any) => ({
            id: parseInt(option.id),
            title: option.title,
            description: option.description,
            price: parseFloat(option.price),
            image_url: option.image_url,
            max_passengers: parseInt(option.max_passengers),
            max_luggage: parseInt(option.max_luggage),
          }));
          setOptions(vehicleOptions);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchoptions();
  }, []);

  const handleNextStep = () => {
    if (!vehicleOption) {
      setMissingSelectedOption(true);
      toast.error("Selecting a preferred option is required", {
        description: "Please select an option to continue",
      });
      return;
    }
  
    setStep(3);
  };

  return (
    <Card className="flex flex-col justify-between space-y-4 shadow-lg overflow-hidden p-6 flex-grow h-fit">
      <div className='flex flex-col space-y-4'>
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-primary">Choose Your Vehicle</h2>
          <Button variant="outline" onClick={() => setStep(1)}>
            Go Back
          </Button>
        </div>
        <div className="space-y-4">
          {options.length === 0 ? (
            // Skeleton loading state
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-10 md:flex-row items-center justify-between p-4 border rounded-lg">
                <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0 w-full">
                  <Skeleton className="w-48 h-32 rounded-md mr-0 md:mr-4 mb-4 md:mb-0" />
                  <div className="w-full">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <Skeleton className="h-6 w-20 mb-2" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))
          ) : (
            options.map((option, index) => (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                  globalState.vehicleOption?.title === option.title 
                    ? 'bg-primary/10 border-primary hover:bg-primary/20' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  if (option == vehicleOption){
                    setVehicleOption(null);
                    setPrice(undefined);
                  }else{
                    setVehicleOption(option);
                    setPrice(option.price);
                    setMissingSelectedOption(false);
                  }
                }}
              >
                <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
                  <img src={option.image_url} alt={option.title} className="w-48 rounded-md mr-0 md:mr-4 mb-4 md:mb-0" />
                  <div>
                    <h3 className="text-lg font-semibold">{option.title}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <p className="text-sm text-gray-600">Capacity: {option.max_passengers}</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-lg font-bold mb-2">{`${option.price.toFixed(2)}€`}</p>
                  <Button 
                    size="sm"
                    variant={vehicleOption?.title === option.title ? "default" : "outline"}
                  >
                    {vehicleOption?.title === option.title ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {missingSelectedOption && (
        <Label className="text-red-500">Please select a vehicle option</Label>
      )}
      <Button onClick={handleNextStep} className="w-full">Next Step</Button>
    </Card>
  );
};
