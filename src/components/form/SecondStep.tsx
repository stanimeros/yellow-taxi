import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { GlobalState } from '../objects/GlobalState';
import { TripSummary } from './TripSummary';
import { VehicleCategory } from '../objects/VehicleCategory';

interface SecondStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  globalState: GlobalState;
}

export const SecondStep: React.FC<SecondStepProps> = ({ setStep, globalState }) => {
  const { 
    api, startDestination, endDestination,
    pickupDateTime, returnDateTime,
    adults, children,
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
            passengers: adults + children,
            startId: startDestination?.place_id,
            endId: endDestination?.place_id,
            startDate: pickupDateTime?.toISOString(),
            returnDate: returnDateTime?.toISOString(),
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle categories');
        }
        const data = await response.json();
        setVehicleCategories(data);
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
            {vehicleCategories.map((vehicle, index) => (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${globalState.vehicleCategory === vehicle.name ? 'bg-primary/10 border-primary' : ''}`}
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
            ))}
          </div>
        </div>
        <Button onClick={() => setStep(3)} className="w-full">Next Step</Button>
      </Card>
      <TripSummary globalState={globalState}/>
    </div>
  );
};
