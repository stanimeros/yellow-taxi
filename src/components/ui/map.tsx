import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';

interface MapProps {
  fromDestinationID: string | null;
  toDestinationID: string | null;
  setDuration: (duration: string) => void;
  setDistance: (distance: string) => void;
}

const style: React.CSSProperties = {
  width: '100%',
  height: '100%'
};

const center: google.maps.LatLngLiteral = {
  lat: 37.9838,
  lng: 23.7275
};

export function Map({ fromDestinationID, toDestinationID, setDuration, setDistance }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  })

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (isLoaded && fromDestinationID && toDestinationID) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { placeId: fromDestinationID },
          destination: { placeId: toDestinationID },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK && response) {
            setDirections(response);
            const route = response.routes[0];
            const leg = route.legs[0];
            if (leg.duration && leg.distance) {
              setDuration(leg.duration.text);
              setDistance(leg.distance.text);
            }
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    }
  }, [isLoaded, fromDestinationID, toDestinationID, setDuration, setDistance]);

  if (!isLoaded) return null;

  return (
    <GoogleMap
      mapContainerStyle={style}
      center={center}
      zoom={10}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}
