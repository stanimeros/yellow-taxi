
import { Input } from "@/components/ui/input";
import { IconProps } from '@radix-ui/react-icons/dist/types';

interface InputIconProps {
  icon?: IconProps 
  placeholder?: string;
  inputValue?: string;
  setInputValue: (value: String) => void;
}

export function InputIcon({ icon, placeholder, inputValue, setInputValue }: InputIconProps) {

  return (
    <div className="relative">
      {icon}
      <Input
        type="text"
        value={inputValue}
        onChange={setInputValue}
        placeholder={placeholder}
        className="w-full pl-9"
      />
    </div>
  );
}
