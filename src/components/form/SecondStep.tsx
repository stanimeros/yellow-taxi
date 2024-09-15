import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { GlobalState } from '../objects/GlobalState';
import { TripSummary } from './TripSummary';
import { VehicleCategory } from '../objects/VehicleCategory';
import { Skeleton } from '../ui/skeleton';

interface SecondStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  globalState: GlobalState;
}

export const SecondStep: React.FC<SecondStepProps> = ({ setStep, globalState }) => {
  const { 
    api, startDestination, endDestination,
    returnDateTime, adults, children,
    vehicleCategory, setVehicleCategory,
  } = globalState;
  const [vehicleCategories, setVehicleCategories] = useState<VehicleCategory[]>([]);

  useEffect(() => {
    const fetchVehicleCategories = async () => {
      try {
        const response = await fetch(`${api}/get_pricing.php`, {
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
          throw new Error('Failed to fetch vehicle categories');
        }
        const data = await response.json();
        if (data.status === "success" && Array.isArray(data.categories)) {
          const formattedCategories = data.categories.map((category: any) => ({
            name: category.title,
            image: category.image_url,
            description: category.description,
            price: `$${category.price}`,
            capacity: category.passengers,
            suitcases: category.suitcases,
            features: category.features,
          }));
          setVehicleCategories(formattedCategories);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching vehicle categories:', error);
      }
    };

    fetchVehicleCategories();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="flex flex-col justify-between space-y-4 lg:col-span-2 shadow-lg overflow-hidden p-6">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-primary">Choose Your Vehicle</h2>
          <div className="space-y-4">
            {vehicleCategories.length === 0 ? (
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
              vehicleCategories.map((vehicle, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    globalState.vehicleCategory === vehicle.name 
                      ? 'bg-primary/10 border-primary hover:bg-primary/20' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setVehicleCategory(vehicle.name)}
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
