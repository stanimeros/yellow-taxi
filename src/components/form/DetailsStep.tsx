import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { GlobalState } from '../objects/GlobalState';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { ChildSeatsPicker } from '../ui/child-seats-picker';
import { Switch } from '../ui/switch';
import { PersonIcon, EnvelopeClosedIcon, GlobeIcon, MobileIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { PhoneCodePicker } from '../ui/phone-code-picker';
import { InputIcon } from '../ui/input-icon';
import { PlaneIcon, ShipIcon } from 'lucide-react'
import { toast } from 'sonner';

interface DetailsStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  globalState: GlobalState;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({ setStep, globalState }) => {
  const { 
    email, setEmail,
    name, setName,
    phone, setPhone,
    phoneCode, setPhoneCode,
    ferryName, setFerryName, 
    airplaneName, setAirplaneName,
    infantSeats, setInfantSeats, 
    babySeats, setBabySeats, 
    boosterSeats, setBoosterSeats,
    bulkyLuggage, setBulkyLuggage,
    notes, setNotes
  } = globalState;

  const [showFerryInput, setShowFerryInput] = useState(ferryName.length > 0);
  const [showAirplaneInput, setShowAirplaneInput] = useState(airplaneName.length > 0);
  const [showChildSeats, setShowChildSeats] = useState(infantSeats > 0 || babySeats > 0 || boosterSeats > 0);

  const [missingName, setMissingName] = useState(false);
  const [missingEmail, setMissingEmail] = useState(false);
  const [missingPhoneCode, setMissingPhoneCode] = useState(false);
  const [missingPhone, setMissingPhone] = useState(false);

  const handleTransportChange = (value: string) => {
    setShowFerryInput(value === 'ferry');
    setShowAirplaneInput(value === 'airplane');
    setFerryName('');
    setAirplaneName('');
    const nameInput = document.getElementById('transport-name') as HTMLInputElement;
    if (nameInput) nameInput.value = '';
  };
  
  const handleNextStep = () => {
    if (!name) {
      setMissingName(true);
      toast.error("Name is required", {
        description: "Please enter your name",
      });
    }
    
    if (!email) {
      setMissingEmail(true);
      toast.error("Email is required", {
        description: "Please enter your email",
      });
    }
    
    if (!phoneCode) {
      setMissingPhoneCode(true);
      toast.error("Phone Area Code is required", {
        description: "Please select your phone area code",
      });
    }
    
    if (!phone) {
      setMissingPhone(true);
      toast.error("Phone Number is required", {
        description: "Please enter your phone number",
      });
    }

    if (!name || !email || !phoneCode || !phone){
      return;
    }

    setStep(4);
  };

  return (
    <Card className="flex flex-col justify-between space-y-4 shadow-lg overflow-hidden p-6 flex-grow h-fit">
      <div className='flex flex-col space-y-6'>
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-primary">Booking Details</h2>
          <Button variant="outline" onClick={() => setStep(2)}>
            Go Back
          </Button>
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`space-y-2 ${missingName ? 'text-red-500' : ''}`}>
              <Label htmlFor="fullName" className="flex items-center">
                <PersonIcon className="w-4 h-4 mr-2" />
                Full Name
              </Label>
              <Input 
                id="fullName"
                placeholder="Enter your full name" 
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setMissingName(false);
                }}
              />
            </div>
            <div className={`space-y-2 ${missingEmail ? 'text-red-500' : ''}`}>
              <Label htmlFor="email" className="flex items-center">
                <EnvelopeClosedIcon className="w-4 h-4 mr-2" />
                Email Address
              </Label>
              <Input 
                id="email"
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMissingEmail(false);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`space-y-2 ${missingPhoneCode ? 'text-red-500' : ''}`}>
              <Label htmlFor="phoneCode" className="flex items-center">
                <GlobeIcon className="w-4 h-4 mr-2" />
                Phone Area Code
              </Label>
              <PhoneCodePicker
                value={phoneCode}
                onChange={(value) => {
                  setPhoneCode(value);
                  setMissingPhoneCode(false);
                }}
              />
            </div>
            <div className={`space-y-2 ${missingPhone ? 'text-red-500' : ''}`}>
              <Label htmlFor="phone" className="flex items-center">
                <MobileIcon className="w-4 h-4 mr-2" />
                Phone Number
              </Label>
              <Input 
                id="phone"
                type="tel" 
                placeholder="Enter your phone number" 
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setMissingPhone(false);
                }}
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
              <InputIcon
                icon = {showFerryInput ? <ShipIcon className='w-4'/> : <PlaneIcon className='w-4'/>}
                inputValue = {showFerryInput ? ferryName : airplaneName}
                setInputValue = {showFerryInput ? setFerryName : setAirplaneName}
                placeholder={showFerryInput ? "Enter ferry name" : "Enter airplane name"}
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
                    setInfantSeats(0);
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
                infantSeats={infantSeats}
                babySeats={babySeats}
                boosterSeats={boosterSeats}
                setInfantSeats={setInfantSeats}
                setBabySeats={setBabySeats}
                setBoosterSeats={setBoosterSeats}
              />
            )}
          </div>
          <div className="space-y-2">
            <div className='flex justify-between'>
              <Label htmlFor="notes" className="flex items-center">
                <Pencil2Icon className="w-4 h-4 mr-2" />
                Additional Notes
              </Label>
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
            </div>
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
      <Button onClick={handleNextStep} className="w-full mt-6">Next Step</Button>
    </Card>
  );
};
