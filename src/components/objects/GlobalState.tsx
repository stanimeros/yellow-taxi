import { Suggestion } from "./Suggestion";

// Define the GlobalState type
export type GlobalState = {
  language: string;
  setLanguage: (language: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  api: any; // Replace 'any' with the actual type of your API
  startDestination: Suggestion | null;
  setStartDestination: React.Dispatch<React.SetStateAction<Suggestion | null>>;
  endDestination: Suggestion | null;
  setEndDestination: React.Dispatch<React.SetStateAction<Suggestion | null>>;
  pickupDateTime: Date | undefined;
  setPickupDateTime: React.Dispatch<React.SetStateAction<Date | undefined>>;
  returnDateTime: Date | undefined;
  setReturnDateTime: React.Dispatch<React.SetStateAction<Date | undefined>>;
  adults: number;
  setAdults: React.Dispatch<React.SetStateAction<number>>;
  children: number;
  setChildren: React.Dispatch<React.SetStateAction<number>>;
  duration: string;
  setDuration: React.Dispatch<React.SetStateAction<string>>;
  distance: string;
  setDistance: React.Dispatch<React.SetStateAction<string>>;
  luggage: number;
  setLuggage: React.Dispatch<React.SetStateAction<number>>;
  vehicleCategory: string;
  setVehicleCategory: React.Dispatch<React.SetStateAction<string>>;
};
