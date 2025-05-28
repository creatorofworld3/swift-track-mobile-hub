
import React from 'react';
import GoogleMap from './GoogleMap';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'driver' | 'delivery' | 'warehouse';
  title: string;
  status?: string;
  info?: string;
}

interface InteractiveMapProps {
  markers?: MapMarker[];
  height?: string;
  showControls?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = (props) => {
  // This component now acts as a wrapper for the enhanced GoogleMap component
  return <GoogleMap {...props} />;
};

export default InteractiveMap;
