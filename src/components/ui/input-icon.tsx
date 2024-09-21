import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

interface InputIconProps {
  icon?: ReactNode;
  placeholder?: string;
  inputValue?: string;
  setInputValue: (value: string) => void;
}

export function InputIcon({ icon, placeholder, inputValue, setInputValue }: InputIconProps) {
  return (
    <div className="relative flex items-center">
      <div className="absolute pl-2">
        {icon}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8"
      />
    </div>
  );
}
