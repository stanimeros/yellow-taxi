import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { GlobalState } from '../objects/GlobalState';
import { TripSummary } from './TripSummary';
import { VehicleCategory } from '../objects/VehicleCategory';
import { Skeleton } from '../ui/skeleton';

interface VehicleStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  globalState: GlobalState;
}

export const VehicleStep: React.FC<VehicleStepProps> = ({ setStep, globalState }) => {
  const { 
    api, startDestination, endDestination,
    returnDateTime, adults, children,
    setPrice, vehicleCategory, setVehicleCategory,
  } = globalState;
  const [options, setOptions] = useState<VehicleCategory[]>([]);

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
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch options');
        }
        const data = await response.json();
        if (data.status === "success" && Array.isArray(data.options)) {
          const formattedOptions = data.options.map((category: any) => ({
            name: category.title,
            image: category.image_url,
            description: category.description,
            price: category.price,
            capacity: category.passengers,
            suitcases: category.suitcases,
            features: category.features,
          }));
          setOptions(formattedOptions);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchoptions();
  }, []);

  return (
    <div className="flex space-x-12 w-full">
      <Card className="flex flex-col justify-between space-y-4 shadow-lg overflow-hidden p-6 w-2/3">
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
                <div key={index} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg">
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
              options.map((vehicle, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    globalState.vehicleCategory === vehicle.name 
                      ? 'bg-primary/10 border-primary hover:bg-primary/20' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setVehicleCategory(vehicle.name);
                    setPrice(parseFloat(vehicle.price));
                  }}
                >
                  <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
                    <img src={vehicle.image} alt={vehicle.name} className="w-48 rounded-md mr-0 md:mr-4 mb-4 md:mb-0" />
                    <div>
                      <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                      <p className="text-sm text-gray-600">{vehicle.description}</p>
                      <p className="text-sm text-gray-600">Capacity: {vehicle.capacity}</p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-lg font-bold mb-2">{vehicle.price}</p>
                    <Button 
                      size="sm"
                      variant={vehicleCategory === vehicle.name ? "default" : "outline"}
                    >
                      {vehicleCategory === vehicle.name ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <Button onClick={() => setStep(3)} className="w-full">Next Step</Button>
      </Card>
      <TripSummary globalState={globalState}/>
    </div>
  );
};
