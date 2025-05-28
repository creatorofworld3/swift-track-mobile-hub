
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, ZoomIn, ZoomOut, Truck, Package2 } from 'lucide-react';
import { websocketService } from '@/services/websocket';
import { toast } from 'sonner';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'driver' | 'delivery' | 'warehouse';
  title: string;
  status?: string;
  info?: string;
  speed?: number;
  heading?: number;
}

interface GoogleMapProps {
  markers?: MapMarker[];
  height?: string;
  showControls?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
  apiKey?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  markers = [], 
  height = "h-96", 
  showControls = true,
  onMarkerClick,
  apiKey = "demo_key" // In production, use proper API key
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize with default markers if none provided
    const defaultMarkers: MapMarker[] = [
      {
        id: 'DRV-001',
        lat: 40.7128,
        lng: -74.0060,
        type: 'driver',
        title: 'Mike Wilson',
        status: 'active',
        info: 'Currently delivering DEL-002',
        speed: 25,
        heading: 45
      },
      {
        id: 'DRV-002', 
        lat: 40.7614,
        lng: -73.9776,
        type: 'driver',
        title: 'Lisa Chen',
        status: 'active',
        info: 'On route to next delivery',
        speed: 30,
        heading: 120
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

    setMapMarkers(markers.length > 0 ? markers : defaultMarkers);
    setIsLoading(false);
  }, [markers]);

  useEffect(() => {
    // Connect to WebSocket for real-time updates
    websocketService.connect();

    const handleLocationUpdate = (data: any) => {
      setMapMarkers(prev => 
        prev.map(marker => 
          marker.id === data.driverId 
            ? { 
                ...marker, 
                lat: data.location.lat, 
                lng: data.location.lng,
                speed: data.speed,
                heading: data.heading 
              }
            : marker
        )
      );
    };

    const handleDeliveryUpdate = (data: any) => {
      toast.info(`Delivery ${data.deliveryId} status: ${data.status}`);
    };

    websocketService.subscribe('location_update', handleLocationUpdate);
    websocketService.subscribe('delivery_status', handleDeliveryUpdate);

    return () => {
      websocketService.unsubscribe('location_update', handleLocationUpdate);
      websocketService.unsubscribe('delivery_status', handleDeliveryUpdate);
    };
  }, []);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
    toast.success(`Selected: ${marker.title}`);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 1, 18);
    setZoomLevel(newZoom);
    toast.info(`Zoomed in to level ${newZoom}`);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 1, 1);
    setZoomLevel(newZoom);
    toast.info(`Zoomed out to level ${newZoom}`);
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

  if (isLoading) {
    return (
      <div className={`${height} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`${height} bg-gradient-to-br from-blue-50 to-green-50 rounded-lg relative overflow-hidden border-2 border-blue-200`}>
        {/* Enhanced Map Background with Street Layout */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="grid grid-cols-16 grid-rows-12 h-full w-full">
              {Array.from({ length: 192 }).map((_, i) => (
                <div key={i} className="border border-slate-200"></div>
              ))}
            </div>
          </div>
          
          {/* Street network */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 right-0 h-3 bg-gray-300 shadow-sm"></div>
            <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-300 shadow-sm"></div>
            <div className="absolute top-3/4 left-0 right-0 h-3 bg-gray-300 shadow-sm"></div>
            <div className="absolute left-1/5 top-0 bottom-0 w-3 bg-gray-300 shadow-sm"></div>
            <div className="absolute left-2/5 top-0 bottom-0 w-3 bg-gray-300 shadow-sm"></div>
            <div className="absolute left-3/5 top-0 bottom-0 w-3 bg-gray-300 shadow-sm"></div>
            <div className="absolute left-4/5 top-0 bottom-0 w-3 bg-gray-300 shadow-sm"></div>
          </div>

          {/* Parks and landmarks */}
          <div className="absolute top-1/6 left-1/4 w-16 h-16 bg-green-200 rounded-lg opacity-60"></div>
          <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-blue-200 rounded-full opacity-60"></div>
        </div>

        {/* Map Controls */}
        {showControls && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/95 backdrop-blur shadow-lg"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/95 backdrop-blur shadow-lg"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/95 backdrop-blur shadow-lg"
              onClick={() => toast.info('Map view toggled')}
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Zoom Level & Connection Status */}
        <div className="absolute top-4 left-4 space-y-2 z-30">
          <div className="bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-lg text-sm">
            Zoom: {zoomLevel}
          </div>
          <div className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Live Updates
          </div>
        </div>

        {/* Dynamic Markers */}
        {mapMarkers.map((marker, index) => (
          <div
            key={marker.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-20 hover:z-30"
            style={{
              left: `${25 + (index % 4) * 18}%`,
              top: `${20 + Math.floor(index / 4) * 25}%`,
              transition: 'all 0.5s ease-in-out'
            }}
            onClick={() => handleMarkerClick(marker)}
          >
            <div className={`${getMarkerColor(marker.type, marker.status)} text-white p-3 rounded-full shadow-lg hover:scale-125 transition-all duration-200 relative`}>
              {getMarkerIcon(marker.type)}
              {marker.speed && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {Math.round(marker.speed)}
                </div>
              )}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
              <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap border">
                <div className="font-medium">{marker.title}</div>
                {marker.speed && (
                  <div className="text-xs text-gray-500">{Math.round(marker.speed)} mph</div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Real-time Activity Indicator */}
        <div className="absolute bottom-4 left-4 text-sm text-gray-700 bg-white/95 backdrop-blur px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <Navigation className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium">Real-time Tracking Active</div>
              <div className="text-xs text-gray-500">
                {mapMarkers.filter(m => m.type === 'driver').length} drivers • {mapMarkers.filter(m => m.type === 'delivery').length} deliveries
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Marker Details */}
      {selectedMarker && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {getMarkerIcon(selectedMarker.type)}
                {selectedMarker.title}
              </CardTitle>
              <Badge variant={selectedMarker.status === 'active' ? 'default' : 'secondary'}>
                {selectedMarker.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">{selectedMarker.info}</p>
            {selectedMarker.speed && (
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium">Speed: {Math.round(selectedMarker.speed)} mph</span>
                <span className="font-medium">Heading: {selectedMarker.heading}°</span>
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Navigation className="mr-2 h-4 w-4" />
                Track
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <MapPin className="mr-2 h-4 w-4" />
                Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoogleMap;
