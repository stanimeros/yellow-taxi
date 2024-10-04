import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Suggestion } from '../objects/Suggestion';
import { InputIcon } from './input-icon';
import { MapPin } from 'lucide-react';

interface PlaceAutocompleteProps {
  api: string;
  placeholder?: string;
  selectedDescription?: string;
  onSelect: (value: Suggestion) => void;
}

export function PlaceAutocomplete({ api, placeholder = "Search places...", selectedDescription = '', onSelect }: PlaceAutocompleteProps) {
  const [input, setInput] = useState(selectedDescription);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && input.length > 3 && input.length < 13 && selectedSuggestion?.description !== input) {
      setIsLoading(true);

      fetch(`${api}/get_predictions.php?input=${encodeURIComponent(input)}`)
      .then(response => response.json())
      .then(data => {
        setSuggestions(data);
        setShowSuggestions(true);
      })
      .catch(error => {
        console.error('Error fetching predictions:', error);
      }).finally(() => {
        setIsLoading(false);
      });
    }else{
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [input]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInput(suggestion.description);
    setSelectedSuggestion(suggestion);
    onSelect(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={autocompleteRef} className="relative">
      <InputIcon
        icon = {<MagnifyingGlassIcon className='w-4'/>}
        inputValue = {input}
        setInputValue = {setInput}
        placeholder={placeholder}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full top-full left-0 overflow-hidden">
          <div className="w-full bg-white border border-gray-300 rounded-md shadow-lg my-1 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="flex flex-nowrap items-center p-2 gap-2 hover:bg-gray-100 cursor-pointer overflow-hidden"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <MapPin className='w-4'/>
                <div className='overflow-hidden text-ellipsis w-full whitespace-nowrap'>
                  {suggestion.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
