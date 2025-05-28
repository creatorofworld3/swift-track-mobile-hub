import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import InteractiveMap from '@/components/InteractiveMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, Phone, RefreshCw, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Driver {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'break';
  currentLocation: { lat: number; lng: number };
  currentDelivery?: string;
  estimatedArrival?: string;
  phone: string;
}

const LiveTracking = () => {
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: 'DRV-001',
      name: 'Mike Wilson',
      status: 'active',
      currentLocation: { lat: 40.7128, lng: -74.0060 },
      currentDelivery: 'DEL-002',
      estimatedArrival: '3:15 PM',
      phone: '+1 (555) 111-2222'
    },
    {
      id: 'DRV-002',
      name: 'Lisa Chen',
      status: 'active',
      currentLocation: { lat: 40.7614, lng: -73.9776 },
      currentDelivery: 'DEL-005',
      estimatedArrival: '2:45 PM',
      phone: '+1 (555) 333-4444'
    },
    {
      id: 'DRV-003',
      name: 'Tom Rodriguez',
      status: 'break',
      currentLocation: { lat: 40.7282, lng: -73.7949 },
      phone: '+1 (555) 555-6666'
    },
    {
      id: 'DRV-004',
      name: 'Sarah Kim',
      status: 'inactive',
      currentLocation: { lat: 40.6782, lng: -73.9442 },
      phone: '+1 (555) 777-8888'
    }
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(prev => prev.map(driver => ({
        ...driver,
        currentLocation: {
          lat: driver.currentLocation.lat + (Math.random() - 0.5) * 0.001,
          lng: driver.currentLocation.lng + (Math.random() - 0.5) * 0.001
        }
      })));
      setLastUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const refreshTracking = () => {
    setLastUpdate(new Date());
    toast.success('Tracking data refreshed!');
  };

  const handleContactDriver = (driverName: string, phone: string) => {
    toast.success(`Calling ${driverName} at ${phone}`);
  };

  const handleShowRoute = (driverName: string) => {
    toast.success(`Opening route for ${driverName}`);
  };

  const handleMapMarkerClick = (marker: any) => {
    toast.info(`Selected: ${marker.title}`);
  };

  // Convert drivers to map markers
  const mapMarkers = drivers.map(driver => ({
    id: driver.id,
    lat: driver.currentLocation.lat,
    lng: driver.currentLocation.lng,
    type: 'driver' as const,
    title: driver.name,
    status: driver.status,
    info: driver.currentDelivery ? `Delivering ${driver.currentDelivery}` : 'Available'
  }));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Tracking</h1>
            <p className="text-gray-600">Real-time driver and delivery tracking</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <Button onClick={refreshTracking} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Interactive Map */}
        <Card>
          <CardHeader>
            <CardTitle>Live Map View</CardTitle>
            <CardDescription>Real-time positions of all active drivers</CardDescription>
          </CardHeader>
          <CardContent>
            <InteractiveMap 
              markers={mapMarkers}
              height="h-96"
              onMarkerClick={handleMapMarkerClick}
            />
          </CardContent>
        </Card>

        {/* Driver Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {drivers.map((driver) => (
            <Card key={driver.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{driver.name}</CardTitle>
                  <Badge className={getStatusColor(driver.status)}>
                    {driver.status}
                  </Badge>
                </div>
                <CardDescription>{driver.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {driver.currentLocation.lat.toFixed(4)}, {driver.currentLocation.lng.toFixed(4)}
                    </span>
                  </div>
                  
                  {driver.currentDelivery && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Navigation className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Delivery: {driver.currentDelivery}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          ETA: {driver.estimatedArrival}
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{driver.phone}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleContactDriver(driver.name, driver.phone)}
                  >
                    <Phone className="mr-1 h-3 w-3" />
                    Contact
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleShowRoute(driver.name)}
                  >
                    <Navigation className="mr-1 h-3 w-3" />
                    Route
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {drivers.filter(d => d.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {drivers.filter(d => d.currentDelivery).length} on delivery
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28 mph</div>
              <p className="text-xs text-muted-foreground">
                Within city limits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage Area</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 mi²</div>
              <p className="text-xs text-muted-foreground">
                Metropolitan area
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LiveTracking;
