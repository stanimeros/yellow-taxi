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
        <SelectItem value="1">🇺🇸 United States (+1)</SelectItem>
        <SelectItem value="44">🇬🇧 United Kingdom (+44)</SelectItem>
        <SelectItem value="49">🇩🇪 Germany (+49)</SelectItem>
        <SelectItem value="33">🇫🇷 France (+33)</SelectItem>
        <SelectItem value="39">🇮🇹 Italy (+39)</SelectItem>
        <SelectItem value="34">🇪🇸 Spain (+34)</SelectItem>
        <SelectItem value="61">🇦🇺 Australia (+61)</SelectItem>
        <SelectItem value="81">🇯🇵 Japan (+81)</SelectItem>
        <SelectItem value="86">🇨🇳 China (+86)</SelectItem>
        {/* Add more countries as needed */}
      </SelectContent>
    </Select>
  );
};
