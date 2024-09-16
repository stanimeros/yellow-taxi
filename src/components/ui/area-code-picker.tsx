import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface AreaCodePickerProps {
  areaCode: string;
  setAreaCode: React.Dispatch<React.SetStateAction<string>>;
}

export const AreaCodePicker: React.FC<AreaCodePickerProps> = ({ areaCode, setAreaCode }) => {
  return (
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
  );
};
