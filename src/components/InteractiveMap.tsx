
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation, 
  ZoomIn, 
  ZoomOut, 
  Map,
  Truck,
  Package2,
  Clock
} from 'lucide-react';

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

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  markers = [], 
  height = "h-96", 
  showControls = true,
  onMarkerClick 
}) => {
  const [zoomLevel, setZoomLevel] = useState(10);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'satellite'>('map');

  const defaultMarkers: MapMarker[] = [
    {
      id: 'driver-1',
      lat: 40.7128,
      lng: -74.0060,
      type: 'driver',
      title: 'Mike Wilson',
      status: 'active',
      info: 'Currently delivering DEL-002'
    },
    {
      id: 'driver-2', 
      lat: 40.7614,
      lng: -73.9776,
      type: 'driver',
      title: 'Lisa Chen',
      status: 'active',
      info: 'On route to next delivery'
    },
    {
      id: 'delivery-1',
      lat: 40.7282,
      lng: -73.7949,
      type: 'delivery',
      title: 'Delivery DEL-003',
      status: 'pending',
      info: '123 Main St, Queens'
    },
    {
      id: 'warehouse-1',
      lat: 40.6782,
      lng: -73.9442,
      type: 'warehouse',
      title: 'Main Warehouse',
      status: 'active',
      info: 'Distribution Center'
    }
  ];

  const displayMarkers = markers.length > 0 ? markers : defaultMarkers;

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 1, 1));
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'driver': return <Truck className="h-4 w-4" />;
      case 'delivery': return <Package2 className="h-4 w-4" />;
      case 'warehouse': return <MapPin className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getMarkerColor = (type: string, status?: string) => {
    if (type === 'driver') {
      return status === 'active' ? 'bg-green-500' : 'bg-gray-500';
    }
    if (type === 'delivery') {
      return status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500';
    }
    return 'bg-blue-500';
  };

  return (
    <div className="relative">
      <div className={`${height} bg-gradient-to-br from-blue-100 to-green-100 rounded-lg relative overflow-hidden border-2 border-dashed border-blue-200`}>
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200">
          {/* Grid pattern to simulate map */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
              {Array.from({ length: 96 }).map((_, i) => (
                <div key={i} className="border border-slate-300"></div>
              ))}
            </div>
          </div>
          
          {/* Road-like patterns */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-0 right-0 h-2 bg-gray-400 opacity-60"></div>
            <div className="absolute top-2/3 left-0 right-0 h-2 bg-gray-400 opacity-60"></div>
            <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-gray-400 opacity-60"></div>
            <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gray-400 opacity-60"></div>
          </div>
        </div>

        {/* Map Controls */}
        {showControls && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/90 backdrop-blur"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/90 backdrop-blur"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/90 backdrop-blur"
              onClick={() => setViewMode(viewMode === 'map' ? 'satellite' : 'map')}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Zoom Level Indicator */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-sm">
          Zoom: {zoomLevel}
        </div>

        {/* Markers */}
        {displayMarkers.map((marker, index) => (
          <div
            key={marker.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: `${30 + (index % 3) * 20}%`,
              top: `${25 + Math.floor(index / 3) * 25}%`,
            }}
            onClick={() => handleMarkerClick(marker)}
          >
            <div className={`${getMarkerColor(marker.type, marker.status)} text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform`}>
              {getMarkerIcon(marker.type)}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
              <div className="bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                {marker.title}
              </div>
            </div>
          </div>
        ))}

        {/* Center point indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        </div>

        {/* Interactive Features Label */}
        <div className="absolute bottom-4 left-4 text-sm text-gray-600 bg-white/90 backdrop-blur px-3 py-2 rounded">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            <span>Interactive Map • Click markers for details</span>
          </div>
        </div>
      </div>

      {/* Selected Marker Info */}
      {selectedMarker && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{selectedMarker.title}</CardTitle>
              <Badge variant={selectedMarker.status === 'active' ? 'default' : 'secondary'}>
                {selectedMarker.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">{selectedMarker.info}</p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Navigation className="mr-2 h-4 w-4" />
                Navigate
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Clock className="mr-2 h-4 w-4" />
                ETA
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveMap;
