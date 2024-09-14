import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import {  MagnifyingGlassIcon } from "@radix-ui/react-icons"


interface Suggestion {
  place_id: string;
  description: string;
}

interface PlaceAutocompleteProps {
  onSelect: (value: Suggestion) => void;
  placeholder?: string;
}

export function PlaceAutocomplete({ onSelect, placeholder = "Search places..." }: PlaceAutocompleteProps) {
  const [input, setInput] = useState('');
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
    if (input.length > 3 && selectedSuggestion?.description !== input) {
      setIsLoading(true);
      fetch(`http://localhost/taxi/api/get_suggestions.php?input=${encodeURIComponent(input)}`)
        .then(response => response.json())
        .then(data => {
          setSuggestions(data);
          setShowSuggestions(true);
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
        }).finally(() => {
          setIsLoading(false);
        });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInput(suggestion.description);
    setSelectedSuggestion(suggestion);
    onSelect(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={autocompleteRef} className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-9"
        />
      </div>
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
                className="text-left p-2 hover:bg-gray-100 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
