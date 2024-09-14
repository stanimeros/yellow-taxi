import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Suggestion {
  place_id: string;
  description: string;
}

interface PlaceAutocompleteProps {
  onSelect: (value: string) => void;
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
    onSelect(suggestion.place_id);
    setShowSuggestions(false);
  };

  return (
    <div ref={autocompleteRef} className="relative">
      <Input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full"
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ScrollArea className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion.place_id}
              variant="ghost"
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.description}
            </Button>
          ))}
        </ScrollArea>
      )}
    </div>
  );
}
