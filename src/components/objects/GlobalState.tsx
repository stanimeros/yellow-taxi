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
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  areaCode: string;
  setAreaCode: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  ferryName: string;
  setFerryName: React.Dispatch<React.SetStateAction<string>>;
  airplaneName: string;
  setAirplaneName: React.Dispatch<React.SetStateAction<string>>;
  infantChildSeats: number;
  setInfantChildSeats: React.Dispatch<React.SetStateAction<number>>;
  babySeats: number;
  setBabySeats: React.Dispatch<React.SetStateAction<number>>;
  boosterSeats: number;
  setBoosterSeats: React.Dispatch<React.SetStateAction<number>>;
  bulkyLuggage: boolean;
  setBulkyLuggage: React.Dispatch<React.SetStateAction<boolean>>;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
};
