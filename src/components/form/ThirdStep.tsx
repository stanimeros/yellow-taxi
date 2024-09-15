import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { GlobalState } from '../objects/GlobalState';
import { TripSummary } from './TripSummary';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { ChildSeatsPicker } from '../ui/child-seats-picker';
import { Switch } from '../ui/switch';
import { PersonIcon, EnvelopeClosedIcon, GlobeIcon, MobileIcon, Pencil2Icon } from '@radix-ui/react-icons';

interface ThirdStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  globalState: GlobalState;
}

export const ThirdStep: React.FC<ThirdStepProps> = ({ setStep, globalState }) => {
  const { 
    email, setEmail,
    name, setName,
    phone, setPhone,
    areaCode, setAreaCode,
    setFerryName, setAirplaneName,
    setInfantChildSeats, setBabySeats, setBoosterSeats,
    bulkyLuggage, setBulkyLuggage,
    notes, setNotes
  } = globalState;

  const [showFerryInput, setShowFerryInput] = useState(false);
  const [showAirplaneInput, setShowAirplaneInput] = useState(false);
  const [showChildSeats, setShowChildSeats] = useState(false);

  const handleTransportChange = (value: string) => {
    setShowFerryInput(value === 'ferry');
    setShowAirplaneInput(value === 'airplane');
    setFerryName('');
    setAirplaneName('');
    const nameInput = document.getElementById('transport-name') as HTMLInputElement;
    if (nameInput) nameInput.value = '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="flex flex-col justify-between space-y-4 lg:col-span-2 shadow-lg overflow-hidden p-6">
        <div className='flex flex-col space-y-6'>
          <h2 className="text-2xl font-bold text-primary">Booking Details</h2>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center">
                  <PersonIcon className="w-4 h-4 mr-2" />
                  Full Name
                </Label>
                <Input 
                  id="fullName"
                  placeholder="Enter your full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <EnvelopeClosedIcon className="w-4 h-4 mr-2" />
                  Email Address
                </Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="areaCode" className="flex items-center">
                  <GlobeIcon className="w-4 h-4 mr-2" />
                  Phone Country Code
                </Label>
                <Select
                  value={areaCode}
                  onValueChange={(value) => setAreaCode(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">🇺🇸 United States (+1)</SelectItem>
                    <SelectItem value="GB">🇬🇧 United Kingdom (+44)</SelectItem>
                    <SelectItem value="DE">🇩🇪 Germany (+49)</SelectItem>
                    <SelectItem value="FR">🇫🇷 France (+33)</SelectItem>
                    <SelectItem value="IT">🇮🇹 Italy (+39)</SelectItem>
                    <SelectItem value="ES">🇪🇸 Spain (+34)</SelectItem>
                    <SelectItem value="CA">🇨🇦 Canada (+1)</SelectItem>
                    <SelectItem value="AU">🇦🇺 Australia (+61)</SelectItem>
                    <SelectItem value="JP">🇯🇵 Japan (+81)</SelectItem>
                    <SelectItem value="CN">🇨🇳 China (+86)</SelectItem>
                    {/* Add more countries as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center">
                  <MobileIcon className="w-4 h-4 mr-2" />
                  Phone Number
                </Label>
                <Input 
                  id="phone"
                  type="tel" 
                  placeholder="Enter your phone number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="flex items-center">
                Travel Method
              </Label>
              <RadioGroup
                value={showFerryInput ? 'ferry' : showAirplaneInput ? 'airplane' : 'none'}
                onValueChange={handleTransportChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ferry" id="ferry" />
                  <Label htmlFor="ferry" className="flex items-center">
                    Travelling by ferry
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="airplane" id="airplane" />
                  <Label htmlFor="airplane">Travelling by airplane</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">Not travelling by ferry or airplane</Label>
                </div>
              </RadioGroup>
              {(showFerryInput || showAirplaneInput) && (
                <Input
                  id='transport-name'
                  placeholder={showFerryInput ? "Enter ferry name" : "Enter airplane name"}
                  onChange={(e) => showFerryInput ? setFerryName(e.target.value) : setAirplaneName(e.target.value)}
                />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <Switch
                  id="showChildSeats"
                  checked={showChildSeats}
                  onCheckedChange={(checked) => {
                    setShowChildSeats(checked);
                    if (!checked) {
                      setInfantChildSeats(0);
                      setBabySeats(0);
                      setBoosterSeats(0);
                    }
                  }}
                />
                <Label htmlFor="showChildSeats" className="flex items-center">
                  Child Seats
                </Label>
              </div>
              {showChildSeats && (
                <ChildSeatsPicker
                  onChildSeatsChange={(newInfantChildSeats, newBabySeats, newBoosterSeats) => {
                    setInfantChildSeats(newInfantChildSeats);
                    setBabySeats(newBabySeats);
                    setBoosterSeats(newBoosterSeats)
                  }}
                />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bulkyLuggage" 
                checked={bulkyLuggage}
                onCheckedChange={(checked: boolean) => setBulkyLuggage(checked)}
              />
              <Label htmlFor="bulkyLuggage" className="flex items-center">
                I have bulky luggage
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center">
                <Pencil2Icon className="w-4 h-4 mr-2" />
                Additional Notes
              </Label>
              <Textarea 
                id="notes"
                placeholder="Enter any additional information" 
                className="h-24" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Button onClick={() => setStep(4)} className="w-full mt-6">Next Step</Button>
      </Card>
      <TripSummary globalState={globalState}/>
    </div>
  );
};
